const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma');

const app = express();
const PORT = Number(process.env.PORT) || 3002;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const now = () => new Date().toISOString();
const sameId = (a, b) => String(a) === String(b);

const num = (v, fallback = 0) => {
  if (v === undefined || v === null || v === '') return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const statusText = (v) => String(v || '').trim().toLowerCase();

const isCancelled = (r) =>
  ['cancelled', 'canceled', 'لغو شده', 'لغوشده'].includes(statusText(r.status));

const isReceived = (r) =>
  ['received', 'completed', 'دریافت‌شده', 'دریافت شده', 'تکمیل‌شده', 'تکمیل شده'].includes(statusText(r.status));

const totalOf = (r) => num(r.totalAmount ?? r.total, 0);
const paidOf = (r) => Math.max(0, num(r.paidAmount, 0));
const getItemProductId = (i) => i.productId ?? i.product_id;
const qtyOf = (i) => num(i.quantity ?? i.stock, 0);
const priceOf = (i) => num(i.unitPrice ?? i.price ?? i.purchasePrice, 0);

const bad = (res, message) => res.status(400).json({ message });
const missing = (res, message = 'رکورد موردنظر پیدا نشد.') =>
  res.status(404).json({ message });

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

function productForApi(p) {
  return p;
}

function inventoryForApi(row, product) {
  const stock = product.stock;

  return {
    ...row,
    productId: product.id,
    productName: product.name,
    sku: product.sku || '',
    category: product.category || '',
    stock,
    quantity: row?.quantity ?? stock,
    minStock: product.minStock,
    minQuantity: row?.minQuantity ?? product.minStock,
    status:
      stock <= 0
        ? 'ناموجود'
        : stock <= product.minStock
          ? 'کم‌موجود'
          : 'موجود',
  };
}

async function syncInventory(tx, product) {
  return tx.inventoryItem.upsert({
    where: { productId: product.id },
    create: {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.stock,
      minQuantity: product.minStock,
      unit: product.unit,
      lastUpdated: now(),
      status:
        product.stock <= 0
          ? 'ناموجود'
          : product.stock <= product.minStock
            ? 'کم‌موجود'
            : 'موجود',
    },
    update: {
      productName: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.stock,
      minQuantity: product.minStock,
      unit: product.unit,
      lastUpdated: now(),
      status:
        product.stock <= 0
          ? 'ناموجود'
          : product.stock <= product.minStock
            ? 'کم‌موجود'
            : 'موجود',
    },
  });
}

async function changeStock(
  tx,
  productId,
  quantity,
  direction,
  reason,
  referenceId = null,
  date = now()
) {
  const qty = num(quantity, NaN);

  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error('تعداد باید عدد صحیح و بزرگ‌تر از صفر باشد.');
  }

  const product = await tx.product.findUnique({
    where: { id: Number(productId) },
  });

  if (!product) {
    throw new Error(`محصول ${productId} پیدا نشد.`);
  }

  const next = product.stock + qty * direction;

  if (next < 0) {
    throw new Error(`موجودی محصول «${product.name}» کافی نیست.`);
  }

  const updated = await tx.product.update({
    where: { id: product.id },
    data: {
      stock: next,
      status:
        next <= 0
          ? 'ناموجود'
          : next <= product.minStock
            ? 'کم‌موجود'
            : 'موجود',
    },
  });

  await syncInventory(tx, updated);

  await tx.stockMovement.create({
    data: {
      productId: product.id,
      type: direction > 0 ? 'in' : 'out',
      quantity: qty,
      reason,
      referenceId,
      createdAt: date,
    },
  });

  return updated;
}

async function createPayment(tx, data) {
  return tx.payment.create({
    data: {
      type: data.type,
      referenceId: Number(data.referenceId),
      amount: num(data.amount, 0),
      method: data.method || 'نامشخص',
      date: data.date || now(),
      description: data.description || null,
      customerId:
        data.customerId == null ? null : Number(data.customerId),
      supplierId:
        data.supplierId == null ? null : Number(data.supplierId),
    },
  });
}

function financial(total, paid) {
  const t = Math.max(0, num(total, 0));
  const p = Math.min(t, Math.max(0, num(paid, 0)));

  return {
    totalAmount: t,
    paidAmount: p,
    remainingAmount: Math.max(0, t - p),
    paymentStatus:
      p === t
        ? 'تسویه‌شده'
        : p === 0
          ? 'پرداخت‌نشده'
          : 'بدهکار',
  };
}

function whitelist(body, fields) {
  const out = {};

  for (const field of fields) {
    if (body[field] !== undefined) {
      out[field] = body[field];
    }
  }

  return out;
}

app.get('/', (req, res) => {
  res.json({
    name: 'StoreFlow API',
    version: '2.0.0',
    status: 'running',
    database: 'mysql',
  });
});

app.get(
  '/api/health',
  asyncRoute(async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      database: 'mysql',
      timestamp: now(),
    });
  })
);

// Products
app.get(
  '/api/products',
  asyncRoute(async (req, res) => {
    const where = {};

    if (req.query.category) {
      where.category = String(req.query.category);
    }

    if (req.query.search) {
      where.OR = ['name', 'sku', 'category'].map((key) => ({
        [key]: { contains: String(req.query.search) },
      }));
    }

    let rows = await prisma.product.findMany({
      where:
        req.query.status === 'low-stock' ||
        req.query.status === 'inactive'
          ? {}
          : where,
      orderBy: { id: 'asc' },
    });

    if (req.query.status === 'low-stock') {
      rows = rows.filter((p) => p.stock <= p.minStock);
    }

    if (req.query.status === 'inactive') {
      rows = rows.filter((p) => !p.isActive);
    }

    res.json(rows.map(productForApi));
  })
);

app.get(
  '/api/products/:id',
  asyncRoute(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!product) return missing(res);

    res.json(product);
  })
);

app.post(
  '/api/products',
  upload.single("image"),
  asyncRoute(async (req, res) => {
    const body = req.body || {};

    if (!String(body.name || '').trim()) {
      return bad(res, 'نام محصول الزامی است.');
    }

    const price = num(body.price, 0);
    const stock = num(body.stock, 0);
    const minStock = num(body.minStock, 0);

    if (
      ![price, stock, minStock].every(Number.isFinite) ||
      price < 0 ||
      stock < 0 ||
      minStock < 0 ||
      !Number.isInteger(stock) ||
      !Number.isInteger(minStock)
    ) {
      return bad(
        res,
        'قیمت و موجودی باید عدد معتبر و غیرمنفی باشند.'
      );
    }

    try {
      const product = await prisma.$transaction(async (tx) => {
        const created = await tx.product.create({
          data: {
            name: String(body.name).trim(),
            sku: String(body.sku || `SF-${Date.now()}`),
            category: String(body.category || 'بدون دسته‌بندی'),
            image: body.image ?? null,
            date: body.date ?? now(),
            price: Math.round(price),
            costPrice:
              body.costPrice == null
                ? null
                : Math.round(num(body.costPrice)),
            averageCost:
              body.averageCost == null
                ? null
                : Math.round(num(body.averageCost)),
            stock,
            unit: body.unit ?? null,
            minStock,
            status:
              body.status ||
              (stock <= 0
                ? 'ناموجود'
                : stock <= minStock
                  ? 'کم‌موجود'
                  : 'موجود'),
            isActive: body.isActive ?? true,
          },
        });

        await syncInventory(tx, created);
        return created;
      });

      res.status(201).json({
        message: 'محصول ایجاد شد.',
        data: product,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return bad(res, 'کد محصول تکراری است.');
      }

      throw error;
    }
  })
);

app.patch(
  '/api/products/:id',
   upload.single("image"),
  asyncRoute(async (req, res) => {

    const id = Number(req.params.id);

    const old = await prisma.product.findUnique({
      where: { id },
    });

    if (!old) return missing(res);

    if ('stock' in req.body || 'quantity' in req.body) {
      return bad(
        res,
        'موجودی را از مسیرهای خرید، فروش یا اصلاح موجودی تغییر بده.'
      );
    }

    if (
      req.body.price !== undefined &&
      (!Number.isFinite(num(req.body.price, NaN)) ||
        num(req.body.price) < 0)
    ) {
      return bad(res, 'قیمت معتبر نیست.');
    }

    const data = whitelist(req.body || {}, [
      'name',
      'sku',
      'category',
      'image',
      'date',
      'price',
      'costPrice',
      'averageCost',
      'unit',
      'minStock',
      'status',
      'isActive',
    ]);
    if (data.name !== undefined && !String(data.name).trim()) {
      return bad(res, 'نام محصول الزامی است.');
    }

    if (data.name !== undefined) {
      data.name = String(data.name).trim();
    }

    for (const key of [
      'price',
      'costPrice',
      'averageCost',
      'minStock',
    ]) {
      if (data[key] != null) {
        data[key] = Math.round(num(data[key]));
      }
    }

    try {
      const product = await prisma.$transaction(async (tx) => {
        const updated = await tx.product.update({
          where: { id },
          data,
        });

        await syncInventory(tx, updated);
        return updated;
      });

      res.json({
        message: 'محصول ویرایش شد.',
        data: product,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return bad(res, 'کد محصول تکراری است.');
      }

      throw error;
    }
  })
);

app.delete(
  '/api/products/:id',
  asyncRoute(async (req, res) => {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) return missing(res);

    const [sales, purchases] = await Promise.all([
      prisma.salesInvoice.findMany(),
      prisma.purchase.findMany(),
    ]);

    const used =
      sales.some((sale) =>
        (sale.items || []).some((item) =>
          sameId(getItemProductId(item), id)
        )
      ) ||
      purchases.some((purchase) =>
        (purchase.items || []).some((item) =>
          sameId(getItemProductId(item), id)
        )
      );

    if (used) {
      return bad(
        res,
        'این محصول در فاکتور ثبت شده و قابل حذف نیست؛ آن را غیرفعال کن.'
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: false, status: 'غیرفعال' },
    });

    res.json({
      message: 'محصول غیرفعال شد.',
      data: updated,
    });
  })
);



// Inventory
app.get(
  '/api/inventory',
  asyncRoute(async (req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { id: 'asc' },
    });

    const rows = await Promise.all(
      products.map(async (product) =>
        inventoryForApi(
          await prisma.inventoryItem.findUnique({
            where: { productId: product.id },
          }),
          product
        )
      )
    );

    res.json(
      req.query.status === 'low-stock'
        ? rows.filter((row) => row.stock <= row.minStock)
        : rows
    );
  })
);

app.get(
  '/api/stock-movements',
  asyncRoute(async (req, res) => {
    const [movements, products] = await Promise.all([
      prisma.stockMovement.findMany({
        orderBy: { id: 'desc' },
      }),
      prisma.product.findMany(),
    ]);

    const byId = new Map(
      products.map((product) => [product.id, product])
    );

    res.json(
      movements.map((movement) => ({
        ...movement,
        date: movement.createdAt,
        productName: byId.get(movement.productId)?.name || '',
        sku: byId.get(movement.productId)?.sku || '',
      }))
    );
  })
);

app.post(
  '/api/inventory/:productId/adjust',
  asyncRoute(async (req, res) => {
    const quantity = num(req.body.quantity, NaN);
    const direction =
      req.body.direction === 'in'
        ? 1
        : req.body.direction === 'out'
          ? -1
          : 0;

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      !direction
    ) {
      return bad(
        res,
        'جهت باید in یا out و تعداد باید عدد صحیح مثبت باشد.'
      );
    }

    try {
      const product = await prisma.$transaction((tx) =>
        changeStock(
          tx,
          req.params.productId,
          quantity,
          direction,
          'manual-adjustment'
        )
      );

      res.json({
        message: 'موجودی اصلاح شد.',
        data: product,
      });
    } catch (error) {
      if (/پیدا نشد|موجودی|تعداد/.test(error.message)) {
        return bad(res, error.message);
      }

      throw error;
    }
  })
);

// Suppliers, customers, categories
const resources = {
  suppliers: {
    model: 'supplier',
    fields: [
      'code', 'name', 'contactPerson', 'phone', 'mobile', 'email',
      'province', 'city', 'address', 'postalCode', 'category',
      'productsCount', 'totalPurchases', 'paidAmount', 'debt',
      'paymentTerm', 'lastPurchaseDate', 'startDate', 'status',
      'rating', 'description',
    ],
    required: ['code', 'name'],
  },
  customers: {
    model: 'customer',
    fields: [
      'code', 'name', 'phone', 'email', 'type', 'city', 'address',
      'totalOrders', 'totalPurchases', 'paidAmount', 'debt',
      'lastPurchaseDate', 'registerDate', 'status', 'notes',
    ],
    required: ['code', 'name'],
  },
  categories: {
    model: 'category',
    fields: ['name', 'slug', 'description', 'isActive'],
    required: ['name', 'slug'],
  },
};

for (const [pathName, config] of Object.entries(resources)) {
  app.get(
    `/api/${pathName}`,
    asyncRoute(async (req, res) => {
      let rows = await prisma[config.model].findMany({
        orderBy: { id: 'asc' },
      });

      if (req.query.search) {
        const query = String(req.query.search).toLowerCase();

        rows = rows.filter((row) =>
          Object.values(row).some((value) =>
            String(value ?? '').toLowerCase().includes(query)
          )
        );
      }

      res.json(rows);
    })
  );

  app.get(
    `/api/${pathName}/:id`,
    asyncRoute(async (req, res) => {
      const row = await prisma[config.model].findUnique({
        where: { id: Number(req.params.id) },
      });

      if (!row) return missing(res);

      res.json(row);
    })
  );

  app.post(
    `/api/${pathName}`,
    asyncRoute(async (req, res) => {
      const body = req.body || {};

      for (const field of config.required) {
        if (!String(body[field] ?? '').trim()) {
          const label =
            field === 'name'
              ? 'نام'
              : field === 'code'
                ? 'کد'
                : 'شناسه یکتا';

          return bad(res, `${label} الزامی است.`);
        }
      }

      const data = whitelist(body, config.fields);

      if (data.name !== undefined) {
        data.name = String(data.name).trim();
      }

      try {
        const row = await prisma[config.model].create({ data });

        res.status(201).json({
          message: 'رکورد ایجاد شد.',
          data: row,
        });
      } catch (error) {
        if (error.code === 'P2002') {
          return bad(res, 'کد یا شناسه تکراری است.');
        }

        throw error;
      }
    })
  );

  app.patch(
    `/api/${pathName}/:id`,
    asyncRoute(async (req, res) => {
      const id = Number(req.params.id);

      const old = await prisma[config.model].findUnique({
        where: { id },
      });

      if (!old) return missing(res);

      const data = whitelist(req.body || {}, config.fields);

      if (data.name !== undefined && !String(data.name).trim()) {
        return bad(res, 'نام الزامی است.');
      }

      if (data.name !== undefined) {
        data.name = String(data.name).trim();
      }

      try {
        const row = await prisma[config.model].update({
          where: { id },
          data,
        });

        res.json({
          message: 'رکورد ویرایش شد.',
          data: row,
        });
      } catch (error) {
        if (error.code === 'P2002') {
          return bad(res, 'کد یا شناسه تکراری است.');
        }

        throw error;
      }
    })
  );

  app.delete(
    `/api/${pathName}/:id`,
    asyncRoute(async (req, res) => {
      const id = Number(req.params.id);

      const old = await prisma[config.model].findUnique({
        where: { id },
      });

      if (!old) return missing(res);

      try {
        const row = await prisma[config.model].delete({
          where: { id },
        });

        res.json({
          message: 'رکورد حذف شد.',
          data: row,
        });
      } catch (error) {
        if (error.code === 'P2003' || error.code === 'P2014') {
          return bad(
            res,
            'این رکورد به اطلاعات دیگری متصل است و قابل حذف نیست.'
          );
        }

        throw error;
      }
    })
  );
}

// Sales
app.get(
  '/api/sales',
  asyncRoute(async (req, res) => {
    const where = {};

    if (req.query.customerId) {
      where.customerId = Number(req.query.customerId);
    }

    if (req.query.status) {
      where.status = String(req.query.status);
    }

    res.json(
      await prisma.salesInvoice.findMany({
        where,
        orderBy: { id: 'desc' },
      })
    );
  })
);

app.get(
  '/api/sales/:id',
  asyncRoute(async (req, res) => {
    const sale = await prisma.salesInvoice.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!sale) return missing(res);

    res.json(sale);
  })
);

app.post(
  '/api/sales',
  asyncRoute(async (req, res) => {
    const body = req.body || {};

    if (!Array.isArray(body.items) || !body.items.length) {
      return bad(res, 'فاکتور باید حداقل یک محصول داشته باشد.');
    }

    try {
      const invoice = await prisma.$transaction(async (tx) => {
        const items = [];

        for (const raw of body.items) {
          const product = await tx.product.findUnique({
            where: { id: Number(getItemProductId(raw)) },
          });

          const quantity = num(raw.quantity, NaN);

          if (!product) {
            throw new Error('یکی از محصولات فاکتور پیدا نشد.');
          }

          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('تعداد محصول باید عدد صحیح مثبت باشد.');
          }

          if (product.stock < quantity) {
            throw new Error(`موجودی محصول «${product.name}» کافی نیست.`);
          }

          const price = num(
            raw.price ?? raw.unitPrice ?? product.price,
            NaN
          );

          if (!Number.isFinite(price) || price < 0) {
            throw new Error(`قیمت محصول «${product.name}» معتبر نیست.`);
          }

          const cost = num(product.averageCost ?? product.costPrice, 0);

          items.push({
            productId: product.id,
            name: product.name,
            sku: product.sku,
            quantity,
            price,
            unitPrice: price,
            totalPrice: price * quantity,
            unitCost: cost,
            costTotal: cost * quantity,
            profit: (price - cost) * quantity,
          });
        }

        const subtotal = items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );

        const discount = num(
          body.discountAmount ?? body.discount,
          0
        );

        if (
          !Number.isFinite(discount) ||
          discount < 0 ||
          discount > subtotal
        ) {
          throw new Error('مبلغ تخفیف معتبر نیست.');
        }

        const totalAmount = subtotal - discount;
        const paid = num(body.paidAmount, 0);

        if (
          !Number.isFinite(paid) ||
          paid < 0 ||
          paid > totalAmount
        ) {
          throw new Error('مبلغ پرداختی معتبر نیست.');
        }

        const customerId =
          body.customerId == null ? null : Number(body.customerId);

        const customerRecord =
          customerId == null
            ? null
            : await tx.customer.findUnique({
                where: { id: customerId },
              });

        if (customerId != null && !customerRecord) {
          throw new Error('مشتری انتخاب‌شده پیدا نشد.');
        }

        const invoice = await tx.salesInvoice.create({
          data: {
            invoiceNumber: body.invoiceNumber || `S-${Date.now()}`,
            customerId,
            customer:
              body.customer || customerRecord?.name || null,
            date: body.date || now(),
            time: body.time || null,
            items,
            itemsCount: items.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
            subtotal,
            discount,
            discountAmount: discount,
            totalAmount,
            total: totalAmount,
            paidAmount: paid,
            remainingAmount: totalAmount - paid,
            paymentStatus:
              paid === 0
                ? 'پرداخت‌نشده'
                : paid === totalAmount
                  ? 'تسویه‌شده'
                  : 'بدهکار',
            status: 'تکمیل‌شده',
            paymentMethod: body.paymentMethod || 'نقدی',
            description: body.description || null,
            costAmount: items.reduce(
              (sum, item) => sum + item.costTotal,
              0
            ),
            profitAmount:
              totalAmount -
              items.reduce((sum, item) => sum + item.costTotal, 0),
          },
        });

        for (const item of items) {
          await changeStock(
            tx,
            item.productId,
            item.quantity,
            -1,
            'sale',
            invoice.id,
            invoice.date
          );
        }

        if (paid > 0) {
          await createPayment(tx, {
            type: 'sale',
            referenceId: invoice.id,
            amount: paid,
            method: invoice.paymentMethod,
            date: invoice.date,
            description: `پرداخت فاکتور فروش ${invoice.invoiceNumber}`,
            customerId,
          });
        }

        return invoice;
      });

      res.status(201).json({
        message: 'فاکتور فروش ثبت شد.',
        data: invoice,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return bad(res, 'شماره فاکتور تکراری است.');
      }

      if (/پیدا نشد|تعداد|موجودی|قیمت|تخفیف|پرداخت/.test(error.message)) {
        return bad(res, error.message);
      }

      throw error;
    }
  })
);

app.all('/api/sales/:id', (req, res, next) => {
  if (['PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    return bad(
      res,
      'فاکتور فروش ثبت‌شده را از این مسیر تغییر نده؛ برای اصلاح از برگشت فروش استفاده کن.'
    );
  }

  next();
});

// Purchases
app.get(
  '/api/purchases',
  asyncRoute(async (req, res) => {
    res.json(
      await prisma.purchase.findMany({
        orderBy: { id: 'desc' },
      })
    );
  })
);

app.get(
  '/api/purchases/:id',
  asyncRoute(async (req, res) => {
    const purchase = await prisma.purchase.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!purchase) return missing(res);

    res.json(purchase);
  })
);

app.post(
  '/api/purchases',
  asyncRoute(async (req, res) => {
    const body = req.body || {};

    if (!Array.isArray(body.items) || !body.items.length) {
      return bad(res, 'خرید باید حداقل یک محصول داشته باشد.');
    }

    try {
      const purchase = await prisma.$transaction(async (tx) => {
        const items = [];

        for (const raw of body.items) {
          const product = await tx.product.findUnique({
            where: { id: Number(getItemProductId(raw)) },
          });

          const quantity = num(raw.quantity, NaN);
          const unitPrice = num(raw.unitPrice ?? raw.price, NaN);

          if (!product) {
            throw new Error('یکی از محصولات خرید پیدا نشد.');
          }

          if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error('تعداد خرید باید عدد صحیح مثبت باشد.');
          }

          if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            throw new Error('قیمت خرید معتبر نیست.');
          }

          items.push({
            productId: product.id,
            productName: product.name,
            quantity,
            unitPrice,
            totalPrice: quantity * unitPrice,
          });
        }

        const shippingCost = num(body.shippingCost, 0);

        if (!Number.isFinite(shippingCost) || shippingCost < 0) {
          throw new Error('هزینه حمل معتبر نیست.');
        }

        const subtotal = items.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );

        const totalAmount = subtotal + shippingCost;
        const paid = num(body.paidAmount, 0);

        if (
          !Number.isFinite(paid) ||
          paid < 0 ||
          paid > totalAmount
        ) {
          throw new Error('مبلغ پرداختی معتبر نیست.');
        }

        const supplierId =
          body.supplierId == null ? null : Number(body.supplierId);

        const supplier =
          supplierId == null
            ? null
            : await tx.supplier.findUnique({
                where: { id: supplierId },
              });

        if (supplierId != null && !supplier) {
          throw new Error('تأمین‌کننده پیدا نشد.');
        }

        const purchase = await tx.purchase.create({
          data: {
            orderNumber: body.orderNumber || `P-${Date.now()}`,
            supplierId,
            supplierName: body.supplierName || supplier?.name || null,
            date: body.date || now(),
            orderDate: body.orderDate || body.date || now(),
            expectedDate: body.expectedDate || null,
            receivedDate: null,
            receivedAt: null,
            status: 'در انتظار دریافت',
            itemsCount: items.reduce(
              (sum, item) => sum + item.quantity,
              0
            ),
            items,
            subtotal,
            totalAmount,
            total: totalAmount,
            shippingCost,
            paidAmount: paid,
            remainingAmount: totalAmount - paid,
            paymentStatus:
              paid === 0
                ? 'پرداخت‌نشده'
                : paid === totalAmount
                  ? 'تسویه‌شده'
                  : 'بدهکار',
            description: body.description || null,
          },
        });

        if (paid > 0) {
          await createPayment(tx, {
            type: 'purchase',
            referenceId: purchase.id,
            amount: paid,
            method: body.paymentMethod || 'نقدی',
            date: purchase.date,
            description: `پرداخت خرید ${purchase.orderNumber || purchase.id}`,
            supplierId,
          });
        }

        return purchase;
      });

      res.status(201).json({
        message: 'سفارش خرید ثبت شد؛ برای افزایش موجودی آن را دریافت کن.',
        data: purchase,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return bad(res, 'شماره سفارش خرید تکراری است.');
      }

      if (/پیدا نشد|تعداد|قیمت|حمل|پرداخت/.test(error.message)) {
        return bad(res, error.message);
      }

      throw error;
    }
  })
);

app.post(
  '/api/purchases/:id/receive',
  asyncRoute(async (req, res) => {
    const id = Number(req.params.id);

    try {
      const purchase = await prisma.$transaction(async (tx) => {
        const record = await tx.purchase.findUnique({
          where: { id },
        });

        if (!record) throw new Error('سفارش خرید پیدا نشد.');
        if (isReceived(record)) throw new Error('این خرید قبلاً دریافت شده است.');
        if (isCancelled(record)) throw new Error('سفارش لغوشده قابل دریافت نیست.');

        const items = Array.isArray(record.items) ? record.items : [];

        const base = items.reduce(
          (sum, item) =>
            sum + num(item.totalPrice, qtyOf(item) * priceOf(item)),
          0
        );

        for (const item of items) {
          const productId = Number(getItemProductId(item));
          const quantity = qtyOf(item);
          const cost = priceOf(item);

          const product = await tx.product.findUnique({
            where: { id: productId },
          });

          if (!product) {
            throw new Error(`محصول ${productId} پیدا نشد.`);
          }

          const oldQuantity = product.stock;
          const oldCost = num(
            product.averageCost ?? product.costPrice,
            0
          );

          const allocatedShipping =
            base > 0
              ? num(record.shippingCost, 0) *
                ((quantity * cost) / base)
              : 0;

          const landedCost =
            cost + allocatedShipping / quantity;

          const averageCost =
            oldQuantity + quantity > 0
              ? Math.round(
                  (oldQuantity * oldCost + quantity * landedCost) /
                    (oldQuantity + quantity)
                )
              : Math.round(landedCost);

          await tx.product.update({
            where: { id: productId },
            data: {
              averageCost,
              costPrice:
                product.costPrice ?? Math.round(landedCost),
            },
          });

          await changeStock(
            tx,
            productId,
            quantity,
            1,
            'purchase',
            record.id
          );
        }

        return tx.purchase.update({
          where: { id },
          data: {
            status: 'دریافت‌شده',
            receivedDate: now(),
            receivedAt: now(),
          },
        });
      });

      res.json({
        message: 'خرید دریافت شد و موجودی به‌روزرسانی شد.',
        data: purchase,
      });
    } catch (error) {
      if (/پیدا نشد|قبلاً|لغوشده|موجودی|تعداد/.test(error.message)) {
        return bad(res, error.message);
      }

      throw error;
    }
  })
);

app.patch(
  '/api/purchases/:id',
  asyncRoute(async (req, res) => {
    const id = Number(req.params.id);

    const purchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) return missing(res);

    if (isReceived(purchase)) {
      return bad(res, 'خرید دریافت‌شده را نمی‌توان ویرایش کرد.');
    }

    const data = whitelist(req.body || {}, [
      'supplierId',
      'expectedDate',
      'description',
    ]);

    if (data.supplierId !== undefined) {
      data.supplierId =
        data.supplierId == null ? null : Number(data.supplierId);
    }

    const updated = await prisma.purchase.update({
      where: { id },
      data,
    });

    res.json({
      message: 'اطلاعات خرید ویرایش شد.',
      data: updated,
    });
  })
);

app.delete(
  '/api/purchases/:id',
  asyncRoute(async (req, res) => {
    const id = Number(req.params.id);

    const purchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) return missing(res);

    if (isReceived(purchase)) {
      return bad(res, 'خرید دریافت‌شده قابل حذف نیست.');
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({
        where: { referenceId: id, type: 'purchase' },
      });

      await tx.purchase.delete({
        where: { id },
      });
    });

    res.json({ message: 'سفارش خرید حذف شد.' });
  })
);

// Payments and finance
app.get(
  '/api/finance/payments',
  asyncRoute(async (req, res) => {
    res.json(
      await prisma.payment.findMany({
        where: req.query.type
          ? { type: String(req.query.type) }
          : {},
        orderBy: { id: 'desc' },
      })
    );
  })
);

app.post(
  '/api/finance/payments',
  asyncRoute(async (req, res) => {
    const body = req.body || {};
    const { type, referenceId, method, description } = body;
    const amount = num(body.amount, NaN);

    if (!['sale', 'purchase'].includes(type)) {
      return bad(res, 'نوع پرداخت باید sale یا purchase باشد.');
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return bad(res, 'مبلغ پرداخت باید بیشتر از صفر باشد.');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const model = type === 'sale' ? 'salesInvoice' : 'purchase';
        const id = Number(referenceId);

        const invoice = await tx[model].findUnique({
          where: { id },
        });

        if (!invoice) {
          throw new Error('فاکتور مربوط به پرداخت پیدا نشد.');
        }

        if (isCancelled(invoice)) {
          throw new Error('برای فاکتور لغوشده نمی‌توان پرداخت ثبت کرد.');
        }

        const remaining = Math.max(
          0,
          totalOf(invoice) - paidOf(invoice)
        );

        if (amount > remaining) {
          throw new Error('مبلغ پرداخت از مانده فاکتور بیشتر است.');
        }

        const values = financial(
          totalOf(invoice),
          paidOf(invoice) + amount
        );

        const updated = await tx[model].update({
          where: { id },
          data: values,
        });

        const payment = await createPayment(tx, {
          type,
          referenceId: id,
          amount,
          method,
          date: now(),
          description,
          customerId: invoice.customerId,
          supplierId: invoice.supplierId,
        });

        return { invoice: updated, payment };
      });

      res.status(201).json({
        message: 'پرداخت ثبت شد.',
        data: result.payment,
        invoice: result.invoice,
      });
    } catch (error) {
      if (/پیدا نشد|لغوشده|مانده/.test(error.message)) {
        return bad(res, error.message);
      }

      throw error;
    }
  })
);

app.get(
  '/api/finance/summary',
  asyncRoute(async (req, res) => {
    const [sales, purchases, paymentCount] = await Promise.all([
      prisma.salesInvoice.findMany(),
      prisma.purchase.findMany(),
      prisma.payment.count(),
    ]);

    const validSales = sales.filter((sale) => !isCancelled(sale));
    const validPurchases = purchases.filter(
      (purchase) => !isCancelled(purchase)
    );
    const receivedPurchases = validPurchases.filter(isReceived);

    res.json({
      totalSales: validSales.reduce(
        (sum, sale) => sum + totalOf(sale),
        0
      ),
      totalPurchases: receivedPurchases.reduce(
        (sum, purchase) => sum + totalOf(purchase),
        0
      ),
      receivables: validSales.reduce(
        (sum, sale) =>
          sum + Math.max(0, totalOf(sale) - paidOf(sale)),
        0
      ),
      payables: validPurchases.reduce(
        (sum, purchase) =>
          sum + Math.max(0, totalOf(purchase) - paidOf(purchase)),
        0
      ),
      salesCount: validSales.length,
      purchasesCount: validPurchases.length,
      paymentCount,
    });
  })
);

// Returns
app.get(
  '/api/returns',
  asyncRoute(async (req, res) => {
    const [salesReturns, purchaseReturns] = await Promise.all([
      prisma.salesReturn.findMany({ orderBy: { id: 'desc' } }),
      prisma.purchaseReturn.findMany({ orderBy: { id: 'desc' } }),
    ]);

    res.json({ salesReturns, purchaseReturns });
  })
);

app.get(
  '/api/returns/sales',
  asyncRoute(async (req, res) => {
    res.json(
      await prisma.salesReturn.findMany({ orderBy: { id: 'desc' } })
    );
  })
);

app.get(
  '/api/returns/purchases',
  asyncRoute(async (req, res) => {
    res.json(
      await prisma.purchaseReturn.findMany({ orderBy: { id: 'desc' } })
    );
  })
);

async function processReturn({ kind, sourceId, body, res }) {
  const isSale = kind === 'sale';
  const id = Number(sourceId);

  if (!Array.isArray(body.items) || !body.items.length) {
    return bad(res, 'حداقل یک محصول برای برگشت انتخاب کن.');
  }

  try {
    const record = await prisma.$transaction(async (tx) => {
      const model = isSale ? 'salesInvoice' : 'purchase';
      const source = await tx[model].findUnique({ where: { id } });

      if (!source) {
        throw new Error('فاکتور مربوط به برگشت پیدا نشد.');
      }

      if (!isSale && !isReceived(source)) {
        throw new Error('فقط خرید دریافت‌شده قابل برگشت است.');
      }

      const previousReturns = isSale
        ? await tx.salesReturn.findMany({ where: { referenceId: id } })
        : await tx.purchaseReturn.findMany({ where: { referenceId: id } });

      const sourceItems = Array.isArray(source.items)
        ? source.items
        : [];

      let gross = 0;
      const items = [];
      const requested = new Map();

      for (const raw of body.items) {
        const productId = Number(getItemProductId(raw));
        const quantity = num(raw.quantity, NaN);

        if (!Number.isInteger(quantity) || quantity <= 0) {
          throw new Error('تعداد برگشت باید عدد صحیح مثبت باشد.');
        }

        const product = await tx.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          throw new Error(`محصول ${productId} پیدا نشد.`);
        }

        const originalQuantity = sourceItems
          .filter((item) =>
            sameId(getItemProductId(item), productId)
          )
          .reduce((sum, item) => sum + qtyOf(item), 0);

        const returnedQuantity = previousReturns
          .filter((r) => Array.isArray(r.items))
          .flatMap((r) => r.items)
          .filter((item) =>
            sameId(getItemProductId(item), productId)
          )
          .reduce((sum, item) => sum + qtyOf(item), 0);

        const alreadyRequested = requested.get(productId) || 0;

        if (
          quantity + returnedQuantity + alreadyRequested >
          originalQuantity
        ) {
          throw new Error(
            `تعداد برگشت محصول «${product.name}» بیشتر از مقدار فاکتور است.`
          );
        }

        requested.set(productId, alreadyRequested + quantity);

        if (!isSale && product.stock < quantity) {
          throw new Error(
            `موجودی محصول «${product.name}» برای برگشت خرید کافی نیست.`
          );
        }

        const originalItem = sourceItems.find((item) =>
          sameId(getItemProductId(item), productId)
        );

        const unitPrice = priceOf(originalItem);
        const totalPrice = unitPrice * quantity;

        gross += totalPrice;

        items.push({
          productId,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice,
        });
      }

      let totalAmount = gross;

      if (isSale) {
        const subtotal = sourceItems.reduce(
          (sum, item) => sum + qtyOf(item) * priceOf(item),
          0
        );

        const discount = num(
          source.discountAmount ?? source.discount,
          0
        );

        totalAmount = Math.max(
          0,
          Math.round(
            gross - (subtotal > 0 ? (discount * gross) / subtotal : 0)
          )
        );
      }

      for (const item of items) {
        await changeStock(
          tx,
          item.productId,
          item.quantity,
          isSale ? 1 : -1,
          isSale ? 'sales-return' : 'purchase-return',
          id,
          body.date || now()
        );
      }

      const values = financial(
        Math.max(0, totalOf(source) - totalAmount),
        Math.min(
          paidOf(source),
          Math.max(0, totalOf(source) - totalAmount)
        )
      );

      await tx[model].update({
        where: { id },
        data: {
          ...values,
          ...('total' in source ? { total: values.totalAmount } : {}),
        },
      });

      const refund = Math.max(0, paidOf(source) - values.totalAmount);
      const date = body.date || now();

      const data = {
        referenceId: id,
        date,
        type: isSale ? 'sales-return' : 'purchase-return',
        reason: body.reason || null,
        refundMethod: body.refundMethod || 'نامشخص',
        items,
        totalAmount,
        refundAmount: refund,
        status: 'ثبت‌شده',
        ...(isSale
          ? {
              invoiceNumber: source.invoiceNumber,
              customerId: source.customerId,
            }
          : { supplierId: source.supplierId }),
      };

      const created = isSale
        ? await tx.salesReturn.create({ data })
        : await tx.purchaseReturn.create({ data });

      if (refund > 0) {
        await createPayment(tx, {
          type: isSale ? 'sales-return' : 'purchase-return',
          referenceId: id,
          amount: -refund,
          method: data.refundMethod,
          date,
          description: `بازپرداخت برگشت ${isSale ? 'فروش' : 'خرید'} ${source.invoiceNumber || source.id}`,
          customerId: source.customerId,
          supplierId: source.supplierId,
        });
      }

      return created;
    });

    res.status(201).json({
      message: 'برگشت با موفقیت ثبت شد.',
      data: record,
    });
  } catch (error) {
    if (/پیدا نشد|تعداد برگشت|قابل برگشت|موجودی/.test(error.message)) {
      return bad(res, error.message);
    }

    throw error;
  }
}

app.post(
  '/api/returns/sales/:saleId',
  asyncRoute(async (req, res) =>
    processReturn({
      kind: 'sale',
      sourceId: req.params.saleId,
      body: req.body || {},
      res,
    })
  )
);

app.post(
  '/api/returns/purchases/:purchaseId',
  asyncRoute(async (req, res) =>
    processReturn({
      kind: 'purchase',
      sourceId: req.params.purchaseId,
      body: req.body || {},
      res,
    })
  )
);

// Reports
async function buildReports() {
  const [sales, products] = await Promise.all([
    prisma.salesInvoice.findMany(),
    prisma.product.findMany(),
  ]);

  const productMap = new Map(
    products.map((product) => [product.id, product])
  );

  const productSales = new Map();
  const categorySales = new Map();
  const dailySales = new Map();
  const paymentMethods = new Map();

  for (const sale of sales.filter((item) => !isCancelled(item))) {
    const day = String(sale.date || '').slice(0, 10) || 'نامشخص';

    dailySales.set(
      day,
      (dailySales.get(day) || 0) + totalOf(sale)
    );

    const method = sale.paymentMethod || 'نامشخص';

    paymentMethods.set(
      method,
      (paymentMethods.get(method) || 0) + totalOf(sale)
    );

    for (const item of Array.isArray(sale.items) ? sale.items : []) {
      const productId = getItemProductId(item);
      const product = productMap.get(Number(productId));
      const key = String(productId);

      const current = productSales.get(key) || {
        productId,
        name: item.name || item.productName || product?.name || 'محصول',
        quantity: 0,
        sales: 0,
      };

      current.quantity += qtyOf(item);
      current.sales += num(
        item.totalPrice,
        qtyOf(item) * priceOf(item)
      );

      productSales.set(key, current);

      const category = product?.category || 'بدون دسته‌بندی';

      categorySales.set(
        category,
        (categorySales.get(category) || 0) +
          num(item.totalPrice, qtyOf(item) * priceOf(item))
      );
    }
  }

  return {
    productSales: [...productSales.values()],
    categorySales: [...categorySales].map(([name, value]) => ({
      name,
      value,
    })),
    salesTrend: [...dailySales]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value })),
    paymentMethods: [...paymentMethods].map(([name, value]) => ({
      name,
      value,
    })),
  };
}

app.get(
  '/api/reports',
  asyncRoute(async (req, res) => {
    res.json(await buildReports());
  })
);

app.get(
  '/api/reports/:name',
  asyncRoute(async (req, res) => {
    const reports = await buildReports();
    const report = reports[req.params.name];

    if (!report) {
      return missing(res, 'گزارش موردنظر پیدا نشد.');
    }

    res.json(report);
  })
);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: 'مسیر API پیدا نشد.',
    path: req.originalUrl,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('StoreFlow MySQL error:', error);

  if (res.headersSent) return next(error);

  res.status(500).json({
    message: 'خطای داخلی سرور رخ داد.',
    detail:
      process.env.NODE_ENV === 'development'
        ? error.message
        : undefined,
  });
});

async function start() {
  try {
    await prisma.$connect();

    console.log('MySQL connected successfully');

    app.listen(PORT, () => {
      console.log(
        `StoreFlow MySQL API running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error('Could not connect to MySQL:', error);
    process.exit(1);
  }
}

start();
