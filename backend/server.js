
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, "data");

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

// ---------- فایل‌های داده ----------

const FILES = {
  products: "products.json",
  inventory: "inventory.json",
  stockMovements: "stockMovements.json",
  suppliers: "suppliers.json",
  customers: "customers.json",
  purchases: "purchases.json",
  sales: "salesInvoices.json",
  categories: "categories.json",
  payments: "payments.json",
  salesReturns: "salesReturns.json",
  purchaseReturns: "purchaseReturns.json",
};

const REPORT_FILES = [
  "categorySales.json",
  "productSalesReport.json",
  "salesTrend.json",
  "paymentMethods.json",
];

function readArray(fileName) {
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const filePath = path.join(DATA_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
    return [];
  }

  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!Array.isArray(parsed)) {
    throw new Error(`${fileName} must contain a JSON array.`);
  }

  return parsed;
}

function writeArray(fileName, value) {
  const filePath = path.join(DATA_DIR, fileName);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

const db = {};

for (const [key, fileName] of Object.entries(FILES)) {
  db[key] = readArray(fileName);
}

for (const fileName of REPORT_FILES) {
  readArray(fileName);
}

// ---------- توابع کمکی ----------

const sameId = (a, b) => String(a) === String(b);

function number(value, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const result = Number(value);
  return Number.isFinite(result) ? result : NaN;
}

function newId(items) {
  return (
    items.reduce(
      (max, item) => Math.max(max, Number(item.id) || 0),
      0
    ) + 1
  );
}

function dateNow() {
  return new Date().toISOString();
}

function statusText(value) {
  return String(value || "").trim().toLowerCase();
}

function isCancelled(record) {
  return ["cancelled", "canceled", "لغو شده", "لغوشده"].includes(
    statusText(record.status)
  );
}

function invoiceTotal(record) {
  return number(record.totalAmount ?? record.total, 0);
}

function paidAmount(record) {
  return Math.max(0, number(record.paidAmount, 0));
}

function persist(...keys) {
  for (const key of new Set(keys)) {
    writeArray(FILES[key], db[key]);
  }
}

function badRequest(res, message) {
  return res.status(400).json({ message });
}

function notFound(res, message = "رکورد موردنظر پیدا نشد.") {
  return res.status(404).json({ message });
}

function getById(items, id) {
  return items.find((item) => sameId(item.id, id));
}

function getProduct(id) {
  return getById(db.products, id);
}

function productStock(product) {
  return Math.max(0, number(product.stock, 0));
}

function getItemProductId(item) {
  return item.productId ?? item.product_id;
}

function getItemQty(item) {
  return number(item.quantity ?? item.stock, 0);
}

function getItemPrice(item) {
  return number(
    item.unitPrice ?? item.price ?? item.purchasePrice,
    0
  );
}

function transactionSnapshot() {
  return JSON.parse(JSON.stringify(db));
}

function restoreSnapshot(snapshot) {
  for (const key of Object.keys(db)) {
    db[key] = snapshot[key];
  }
}

function persistTransaction(keys, snapshot) {
  try {
    persist(...keys);
  } catch (error) {
    restoreSnapshot(snapshot);

    try {
      persist(...keys);
    } catch (_) {
      // خطای اصلی در ادامه گزارش می‌شود.
    }

    throw error;
  }
}

// ---------- هماهنگی محصولات و موجودی ----------

function getInventory(product) {
  let row = db.inventory.find(
    (item) => sameId(item.productId, product.id)
  );

  if (!row && product.sku) {
    row = db.inventory.find(
      (item) => item.sku && item.sku === product.sku
    );
  }

  if (!row && product.name) {
    row = db.inventory.find(
      (item) =>
        String(item.productName || item.name || "").trim() ===
        String(product.name).trim()
    );
  }

  if (!row) {
    row = {
      id: newId(db.inventory),
      productId: product.id,
      productName: product.name,
      sku: product.sku || "",
      stock: productStock(product),
      minStock: number(product.minStock, 0),
    };

    db.inventory.push(row);
  }

  row.productId = product.id;
  row.productName = product.name;
  row.sku = product.sku || row.sku || "";
  row.minStock = number(product.minStock, number(row.minStock, 0));

  if ("quantity" in row && !("stock" in row)) {
    row.quantity = productStock(product);
  } else {
    row.stock = productStock(product);
  }

  return row;
}

function changeStock(
  product,
  quantity,
  direction,
  reason,
  referenceId,
  date = dateNow()
) {
  const qty = number(quantity, NaN);

  if (!Number.isInteger(qty) || qty <= 0) {
    throw new Error("تعداد باید عدد صحیح و بزرگ‌تر از صفر باشد.");
  }

  const nextStock = productStock(product) + qty * direction;

  if (nextStock < 0) {
    throw new Error(`موجودی محصول «${product.name}» کافی نیست.`);
  }

  product.stock = nextStock;

  const inventory = getInventory(product);

  if ("quantity" in inventory && !("stock" in inventory)) {
    inventory.quantity = nextStock;
  } else {
    inventory.stock = nextStock;
  }

  db.stockMovements.push({
    id: newId(db.stockMovements),
    productId: product.id,
    productName: product.name,
    sku: product.sku || "",
    type: direction > 0 ? "in" : "out",
    quantity: qty,
    reason,
    referenceId,
    date,
  });
}

function addPayment({
  type,
  referenceId,
  amount,
  method,
  date,
  description,
  customerId,
  supplierId,
}) {
  const payment = {
    id: newId(db.payments),
    type,
    referenceId,
    amount: number(amount, 0),
    method: method || "نامشخص",
    date: date || dateNow(),
    description: description || "",
  };

  if (customerId !== undefined) payment.customerId = customerId;
  if (supplierId !== undefined) payment.supplierId = supplierId;

  db.payments.push(payment);

  return payment;
}

function setFinancialState(invoice) {
  const total = Math.max(0, invoiceTotal(invoice));
  const paid = Math.min(total, paidAmount(invoice));

  invoice.totalAmount = total;
  invoice.paidAmount = paid;
  invoice.remainingAmount = Math.max(0, total - paid);

  invoice.paymentStatus =
    invoice.remainingAmount === 0
      ? "تسویه‌شده"
      : paid === 0
        ? "پرداخت‌نشده"
        : "بدهکار";
}

function applyReturnFinance(invoice, returnAmount) {
  const oldTotal = Math.max(0, invoiceTotal(invoice));
  const oldPaid = paidAmount(invoice);
  const newTotal = Math.max(0, oldTotal - returnAmount);

  // اگر مبلغ پرداخت‌شده از مبلغ جدید فاکتور بیشتر باشد،
  // اختلاف آن بازپرداخت واقعی است.
  const refundAmount = Math.max(0, oldPaid - newTotal);

  invoice.totalAmount = newTotal;

  if ("total" in invoice) {
    invoice.total = newTotal;
  }

  invoice.paidAmount = Math.min(oldPaid, newTotal);
  invoice.remainingAmount = Math.max(
    0,
    newTotal - invoice.paidAmount
  );

  invoice.paymentStatus =
    invoice.remainingAmount === 0
      ? "تسویه‌شده"
      : invoice.paidAmount === 0
        ? "پرداخت‌نشده"
        : "بدهکار";

  return refundAmount;
}

function totalItemQty(items, productId) {
  return (items || [])
    .filter((item) => sameId(getItemProductId(item), productId))
    .reduce((sum, item) => sum + getItemQty(item), 0);
}

function returnedQty(list, referenceId, productId) {
  return list
    .filter((record) => sameId(record.referenceId, referenceId))
    .reduce((sum, record) => {
      return (
        sum +
        (record.items || [])
          .filter((item) =>
            sameId(getItemProductId(item), productId)
          )
          .reduce((subtotal, item) => subtotal + getItemQty(item), 0)
      );
    }, 0);
}

function isReceived(purchase) {
  return [
    "received",
    "completed",
    "دریافت‌شده",
    "دریافت شده",
    "تکمیل‌شده",
    "تکمیل شده",
  ].includes(statusText(purchase.status));
}

// هماهنگی اولیه موجودی بر اساس شناسه، SKU یا نام.
// عمداً از تطبیق بر اساس ترتیب ردیف‌ها استفاده نمی‌کنیم.
for (const product of db.products) {
  getInventory(product);
}

persist("inventory");

// ---------- صفحه اصلی و سلامت سرور ----------

app.get("/", (req, res) => {
  res.json({
    name: "StoreFlow API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: dateNow(),
  });
});

// ---------- محصولات ----------

app.get("/api/products", (req, res) => {
  let rows = db.products;

  if (req.query.search) {
    const q = String(req.query.search).toLowerCase();

    rows = rows.filter((product) =>
      [product.name, product.sku, product.category].some((value) =>
        String(value || "").toLowerCase().includes(q)
      )
    );
  }

  if (req.query.category) {
    rows = rows.filter(
      (product) => String(product.category) === String(req.query.category)
    );
  }

  if (req.query.status === "low-stock") {
    rows = rows.filter(
      (product) =>
        productStock(product) <= number(product.minStock, 0)
    );
  }

  res.json(rows);
});

app.get("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  if (!product) return notFound(res);

  res.json(product);
});

app.post("/api/products", (req, res) => {
  const body = req.body || {};

  if (!String(body.name || "").trim()) {
    return badRequest(res, "نام محصول الزامی است.");
  }

  const price = number(body.price, 0);
  const stock = number(body.stock, 0);
  const minStock = number(body.minStock, 0);

  if (
    ![price, stock, minStock].every(Number.isFinite) ||
    price < 0 ||
    stock < 0 ||
    minStock < 0
  ) {
    return badRequest(
      res,
      "قیمت و موجودی باید عدد غیرمنفی باشند."
    );
  }

  if (
    body.sku &&
    db.products.some((product) => product.sku === body.sku)
  ) {
    return badRequest(res, "کد محصول تکراری است.");
  }

  const snapshot = transactionSnapshot();

  const product = {
    ...body,
    id: newId(db.products),
    name: String(body.name).trim(),
    price,
    stock,
    minStock,
    createdAt: dateNow(),
  };

  db.products.push(product);
  getInventory(product);

  try {
    persistTransaction(["products", "inventory"], snapshot);
  } catch (error) {
    return res.status(500).json({
      message: "ذخیره محصول انجام نشد.",
    });
  }

  res.status(201).json({
    message: "محصول ایجاد شد.",
    data: product,
  });
});

app.patch("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  if (!product) return notFound(res);

  if ("stock" in req.body || "quantity" in req.body) {
    return badRequest(
      res,
      "موجودی را از مسیرهای خرید، فروش یا اصلاح موجودی تغییر بده."
    );
  }

  const updated = {
    ...product,
    ...req.body,
    id: product.id,
  };

  if (!String(updated.name || "").trim()) {
    return badRequest(res, "نام محصول الزامی است.");
  }

  if (
    req.body.price !== undefined &&
    (!Number.isFinite(number(req.body.price, NaN)) ||
      number(req.body.price) < 0)
  ) {
    return badRequest(res, "قیمت معتبر نیست.");
  }

  if (
    updated.sku &&
    db.products.some(
      (other) =>
        !sameId(other.id, product.id) && other.sku === updated.sku
    )
  ) {
    return badRequest(res, "کد محصول تکراری است.");
  }

  const snapshot = transactionSnapshot();

  Object.assign(product, updated);
  getInventory(product);

  try {
    persistTransaction(["products", "inventory"], snapshot);
  } catch (error) {
    return res.status(500).json({
      message: "ویرایش محصول انجام نشد.",
    });
  }

  res.json({
    message: "محصول ویرایش شد.",
    data: product,
  });
});

app.delete("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  if (!product) return notFound(res);

  const usedInTransactions =
    db.sales.some((sale) =>
      (sale.items || []).some((item) =>
        sameId(getItemProductId(item), product.id)
      )
    ) ||
    db.purchases.some((purchase) =>
      (purchase.items || []).some((item) =>
        sameId(getItemProductId(item), product.id)
      )
    );

  if (usedInTransactions) {
    return badRequest(
      res,
      "این محصول در فاکتور ثبت شده و قابل حذف نیست؛ آن را غیرفعال کن."
    );
  }

  product.isActive = false;
  product.status = "غیرفعال";

  persist("products");

  res.json({
    message: "محصول غیرفعال شد.",
    data: product,
  });
});

// ---------- موجودی و گردش انبار ----------

app.get("/api/inventory", (req, res) => {
  let rows = db.products.map((product) => {
    const inventory = getInventory(product);
    const stock = productStock(product);
    const minStock = number(product.minStock, 0);

    return {
      ...inventory,
      productId: product.id,
      productName: product.name,
      sku: product.sku || "",
      stock,
      minStock,
      status:
        stock <= 0
          ? "ناموجود"
          : stock <= minStock
            ? "کم‌موجود"
            : "موجود",
    };
  });

  if (req.query.status === "low-stock") {
    rows = rows.filter((item) => item.stock <= item.minStock);
  }

  res.json(rows);
});

app.get("/api/stock-movements", (req, res) => {
  res.json(db.stockMovements);
});

app.post("/api/inventory/:productId/adjust", (req, res) => {
  const product = getProduct(req.params.productId);

  if (!product) return notFound(res, "محصول پیدا نشد.");

  const quantity = number(req.body.quantity, NaN);
  const direction =
    req.body.direction === "in"
      ? 1
      : req.body.direction === "out"
        ? -1
        : 0;

  if (
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    direction === 0
  ) {
    return badRequest(
      res,
      "جهت باید in یا out و تعداد باید عدد صحیح مثبت باشد."
    );
  }

  const snapshot = transactionSnapshot();

  try {
    changeStock(
      product,
      quantity,
      direction,
      "manual-adjustment",
      null
    );

    persistTransaction(
      ["products", "inventory", "stockMovements"],
      snapshot
    );

    res.json({
      message: "موجودی اصلاح شد.",
      data: product,
    });
  } catch (error) {
    restoreSnapshot(snapshot);
    return badRequest(res, error.message);
  }
});

// ---------- مشتریان، تأمین‌کنندگان و دسته‌بندی‌ها ----------

const masterResources = {
  suppliers: "suppliers",
  customers: "customers",
  categories: "categories",
};

for (const [resource, dataKey] of Object.entries(masterResources)) {
  app.get(`/api/${resource}`, (req, res) => {
    let rows = db[dataKey];

    if (req.query.search) {
      const q = String(req.query.search).toLowerCase();

      rows = rows.filter((item) =>
        Object.values(item).some((value) =>
          String(value ?? "").toLowerCase().includes(q)
        )
      );
    }

    res.json(rows);
  });

  app.get(`/api/${resource}/:id`, (req, res) => {
    const record = getById(db[dataKey], req.params.id);

    if (!record) return notFound(res);

    res.json(record);
  });

  app.post(`/api/${resource}`, (req, res) => {
    const body = req.body || {};

    if (!String(body.name || "").trim()) {
      return badRequest(res, "نام الزامی است.");
    }

    const record = {
      ...body,
      id: newId(db[dataKey]),
      name: String(body.name).trim(),
      createdAt: dateNow(),
    };

    db[dataKey].push(record);

    try {
      persist(dataKey);
    } catch (error) {
      db[dataKey].pop();
      return res.status(500).json({
        message: "ذخیره انجام نشد.",
      });
    }

    res.status(201).json({
      message: "رکورد ایجاد شد.",
      data: record,
    });
  });

  app.patch(`/api/${resource}/:id`, (req, res) => {
    const record = getById(db[dataKey], req.params.id);

    if (!record) return notFound(res);

    const previous = { ...record };

    Object.assign(record, req.body, { id: record.id });

    if (!String(record.name || "").trim()) {
      Object.assign(record, previous);
      return badRequest(res, "نام الزامی است.");
    }

    try {
      persist(dataKey);
    } catch (error) {
      Object.assign(record, previous);
      return res.status(500).json({
        message: "ذخیره انجام نشد.",
      });
    }

    res.json({
      message: "رکورد ویرایش شد.",
      data: record,
    });
  });

  app.delete(`/api/${resource}/:id`, (req, res) => {
    const index = db[dataKey].findIndex((record) =>
      sameId(record.id, req.params.id)
    );

    if (index < 0) return notFound(res);

    const [removed] = db[dataKey].splice(index, 1);

    try {
      persist(dataKey);
    } catch (error) {
      db[dataKey].splice(index, 0, removed);
      return res.status(500).json({
        message: "حذف انجام نشد.",
      });
    }

    res.json({
      message: "رکورد حذف شد.",
      data: removed,
    });
  });
}

// ---------- فروش ----------

app.get("/api/sales", (req, res) => {
  let rows = db.sales;

  if (req.query.customerId) {
    rows = rows.filter((sale) =>
      sameId(sale.customerId, req.query.customerId)
    );
  }

  if (req.query.status) {
    rows = rows.filter(
      (sale) => String(sale.status) === String(req.query.status)
    );
  }

  res.json(rows);
});

app.get("/api/sales/:id", (req, res) => {
  const sale = getById(db.sales, req.params.id);

  if (!sale) return notFound(res);

  res.json(sale);
});

app.post("/api/sales", (req, res) => {
  const body = req.body || {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest(res, "فاکتور باید حداقل یک محصول داشته باشد.");
  }

  const snapshot = transactionSnapshot();

  try {
    const items = [];

    for (const raw of body.items) {
      const product = getProduct(getItemProductId(raw));
      const quantity = number(raw.quantity, NaN);

      if (!product) throw new Error("یکی از محصولات فاکتور پیدا نشد.");

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("تعداد محصول باید عدد صحیح مثبت باشد.");
      }

      if (productStock(product) < quantity) {
        throw new Error(`موجودی محصول «${product.name}» کافی نیست.`);
      }

      const price = number(
        raw.price ?? raw.unitPrice ?? product.price,
        NaN
      );

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`قیمت محصول «${product.name}» معتبر نیست.`);
      }

      const cost = number(product.averageCost ?? product.costPrice, 0);

      items.push({
        productId: product.id,
        name: product.name,
        sku: product.sku || "",
        quantity,
        price,
        unitPrice: price,
        totalPrice: price * quantity,
        unitCost: cost,
        costTotal: cost * quantity,
        profit: (price - cost) * quantity,
      });
    }

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = number(body.discountAmount ?? body.discount, 0);

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > subtotal
    ) {
      throw new Error("مبلغ تخفیف معتبر نیست.");
    }

    const totalAmount = subtotal - discount;
    const paid = number(body.paidAmount, 0);

    if (!Number.isFinite(paid) || paid < 0 || paid > totalAmount) {
      throw new Error("مبلغ پرداختی معتبر نیست.");
    }

    for (const item of items) {
      changeStock(
        getProduct(item.productId),
        item.quantity,
        -1,
        "sale",
        null
      );
    }

    const costAmount = items.reduce(
      (sum, item) => sum + item.costTotal,
      0
    );

    const invoice = {
      id: newId(db.sales),
      invoiceNumber: body.invoiceNumber || `S-${Date.now()}`,
      customerId: body.customerId ?? null,
      date: body.date || dateNow(),
      items,
      subtotal,
      discountAmount: discount,
      totalAmount,
      total: totalAmount,
      paidAmount: paid,
      remainingAmount: totalAmount - paid,
      paymentStatus:
        paid === 0
          ? "پرداخت‌نشده"
          : paid === totalAmount
            ? "تسویه‌شده"
            : "بدهکار",
      status: "تکمیل‌شده",
      paymentMethod: body.paymentMethod || "نقدی",
      description: body.description || "",
      costAmount,
      profitAmount: totalAmount - costAmount,
    };

    db.sales.push(invoice);

    if (paid > 0) {
      addPayment({
        type: "sale",
        referenceId: invoice.id,
        amount: paid,
        method: invoice.paymentMethod,
        date: invoice.date,
        description: `پرداخت فاکتور فروش ${invoice.invoiceNumber}`,
        customerId: invoice.customerId,
      });
    }

    persistTransaction(
      ["sales", "products", "inventory", "stockMovements", "payments"],
      snapshot
    );

    res.status(201).json({
      message: "فاکتور فروش ثبت شد.",
      data: invoice,
    });
  } catch (error) {
    restoreSnapshot(snapshot);
    return badRequest(res, error.message);
  }
});

app.all("/api/sales/:id", (req, res, next) => {
  if (["PATCH", "PUT", "DELETE"].includes(req.method)) {
    return badRequest(
      res,
      "فاکتور فروش ثبت‌شده را از این مسیر تغییر نده؛ برای اصلاح از برگشت فروش استفاده کن."
    );
  }

  next();
});

// ---------- خرید و دریافت کالا ----------

app.get("/api/purchases", (req, res) => {
  res.json(db.purchases);
});

app.get("/api/purchases/:id", (req, res) => {
  const purchase = getById(db.purchases, req.params.id);

  if (!purchase) return notFound(res);

  res.json(purchase);
});

app.post("/api/purchases", (req, res) => {
  const body = req.body || {};

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest(res, "خرید باید حداقل یک محصول داشته باشد.");
  }

  const snapshot = transactionSnapshot();

  try {
    const items = body.items.map((raw) => {
      const product = getProduct(getItemProductId(raw));
      const quantity = number(raw.quantity, NaN);
      const unitPrice = number(raw.unitPrice ?? raw.price, NaN);

      if (!product) throw new Error("یکی از محصولات خرید پیدا نشد.");

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("تعداد خرید باید عدد صحیح مثبت باشد.");
      }

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        throw new Error("قیمت خرید معتبر نیست.");
      }

      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      };
    });

    const shippingCost = number(body.shippingCost, 0);

    if (!Number.isFinite(shippingCost) || shippingCost < 0) {
      throw new Error("هزینه حمل معتبر نیست.");
    }

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalAmount = subtotal + shippingCost;
    const paid = number(body.paidAmount, 0);

    if (!Number.isFinite(paid) || paid < 0 || paid > totalAmount) {
      throw new Error("مبلغ پرداختی معتبر نیست.");
    }

    const purchase = {
      id: newId(db.purchases),
      supplierId: body.supplierId ?? null,
      date: body.date || dateNow(),
      orderDate: body.orderDate || body.date || dateNow(),
      expectedDate: body.expectedDate || null,
      items,
      subtotal,
      shippingCost,
      totalAmount,
      total: totalAmount,
      paidAmount: paid,
      remainingAmount: totalAmount - paid,
      paymentStatus:
        paid === 0
          ? "پرداخت‌نشده"
          : paid === totalAmount
            ? "تسویه‌شده"
            : "بدهکار",
      status: "در انتظار دریافت",
      description: body.description || "",
      receivedAt: null,
    };

    db.purchases.push(purchase);

    if (paid > 0) {
      addPayment({
        type: "purchase",
        referenceId: purchase.id,
        amount: paid,
        method: body.paymentMethod || "نقدی",
        date: purchase.date,
        description: `پرداخت خرید ${purchase.id}`,
        supplierId: purchase.supplierId,
      });
    }

    persistTransaction(["purchases", "payments"], snapshot);

    res.status(201).json({
      message: "سفارش خرید ثبت شد؛ برای افزایش موجودی آن را دریافت کن.",
      data: purchase,
    });
  } catch (error) {
    restoreSnapshot(snapshot);
    return badRequest(res, error.message);
  }
});

app.post("/api/purchases/:id/receive", (req, res) => {
  const purchase = getById(db.purchases, req.params.id);

  if (!purchase) return notFound(res, "سفارش خرید پیدا نشد.");

  if (isReceived(purchase)) {
    return badRequest(res, "این خرید قبلاً دریافت شده است.");
  }

  if (isCancelled(purchase)) {
    return badRequest(res, "سفارش لغوشده قابل دریافت نیست.");
  }

  const snapshot = transactionSnapshot();

  try {
    const base = (purchase.items || []).reduce(
      (sum, item) =>
        sum + number(item.totalPrice, getItemQty(item) * getItemPrice(item)),
      0
    );

    for (const item of purchase.items || []) {
      const product = getProduct(getItemProductId(item));

      if (!product) {
        throw new Error(`محصول ${getItemProductId(item)} پیدا نشد.`);
      }

      const quantity = getItemQty(item);
      const unitCost = getItemPrice(item);
      const oldQuantity = productStock(product);
      const oldCost = number(product.averageCost ?? product.costPrice, 0);

      // تقسیم هزینه حمل بین اقلام خرید
      const allocatedShipping =
        base > 0
          ? number(purchase.shippingCost, 0) *
            ((quantity * unitCost) / base)
          : 0;

      const landedUnitCost = unitCost + allocatedShipping / quantity;

      product.averageCost =
        oldQuantity + quantity > 0
          ? (oldQuantity * oldCost + quantity * landedUnitCost) /
            (oldQuantity + quantity)
          : landedUnitCost;

      changeStock(
        product,
        quantity,
        1,
        "purchase",
        purchase.id
      );
    }

    purchase.status = "دریافت‌شده";
    purchase.receivedAt = dateNow();

    persistTransaction(
      ["purchases", "products", "inventory", "stockMovements"],
      snapshot
    );

    res.json({
      message: "خرید دریافت شد و موجودی به‌روزرسانی شد.",
      data: purchase,
    });
  } catch (error) {
    restoreSnapshot(snapshot);
    return badRequest(res, error.message);
  }
});

app.patch("/api/purchases/:id", (req, res) => {
  const purchase = getById(db.purchases, req.params.id);

  if (!purchase) return notFound(res);

  if (isReceived(purchase)) {
    return badRequest(res, "خرید دریافت‌شده را نمی‌توان ویرایش کرد.");
  }

  for (const key of ["supplierId", "expectedDate", "description"]) {
    if (key in req.body) purchase[key] = req.body[key];
  }

  persist("purchases");

  res.json({
    message: "اطلاعات خرید ویرایش شد.",
    data: purchase,
  });
});

app.delete("/api/purchases/:id", (req, res) => {
  const index = db.purchases.findIndex((purchase) =>
    sameId(purchase.id, req.params.id)
  );

  if (index < 0) return notFound(res);

  const purchase = db.purchases[index];

  if (isReceived(purchase)) {
    return badRequest(res, "خرید دریافت‌شده قابل حذف نیست.");
  }

  db.purchases.splice(index, 1);
  db.payments = db.payments.filter(
    (payment) =>
      !(
        sameId(payment.referenceId, purchase.id) &&
        payment.type === "purchase"
      )
  );

  persist("purchases", "payments");

  res.json({ message: "سفارش خرید حذف شد." });
});

// ---------- پرداخت‌ها و خلاصه مالی ----------

app.get("/api/finance/payments", (req, res) => {
  let rows = db.payments;

  if (req.query.type) {
    rows = rows.filter((payment) => payment.type === req.query.type);
  }

  res.json(rows);
});

app.post("/api/finance/payments", (req, res) => {
  const { type, referenceId, method, description } = req.body || {};
  const amount = number(req.body.amount, NaN);

  if (!["sale", "purchase"].includes(type)) {
    return badRequest(res, "نوع پرداخت باید sale یا purchase باشد.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return badRequest(res, "مبلغ پرداخت باید بیشتر از صفر باشد.");
  }

  const list = type === "sale" ? db.sales : db.purchases;
  const invoice = getById(list, referenceId);

  if (!invoice) return notFound(res, "فاکتور مربوط به پرداخت پیدا نشد.");

  if (isCancelled(invoice)) {
    return badRequest(res, "برای فاکتور لغوشده نمی‌توان پرداخت ثبت کرد.");
  }

  const remaining = Math.max(
    0,
    invoiceTotal(invoice) - paidAmount(invoice)
  );

  if (amount > remaining) {
    return badRequest(res, "مبلغ پرداخت از مانده فاکتور بیشتر است.");
  }

  const snapshot = transactionSnapshot();

  invoice.paidAmount = paidAmount(invoice) + amount;
  setFinancialState(invoice);

  const payment = addPayment({
    type,
    referenceId: invoice.id,
    amount,
    method,
    date: dateNow(),
    description,
    customerId: invoice.customerId,
    supplierId: invoice.supplierId,
  });

  try {
    persistTransaction(
      [type === "sale" ? "sales" : "purchases", "payments"],
      snapshot
    );
  } catch (error) {
    return res.status(500).json({ message: "ذخیره پرداخت انجام نشد." });
  }

  res.status(201).json({
    message: "پرداخت ثبت شد.",
    data: payment,
    invoice,
  });
});

app.get("/api/finance/summary", (req, res) => {
  const activeSales = db.sales.filter((sale) => !isCancelled(sale));
  const activePurchases = db.purchases.filter(
    (purchase) => !isCancelled(purchase)
  );

  const receivedPurchases = activePurchases.filter(isReceived);

  const totalSales = activeSales.reduce(
    (sum, sale) => sum + invoiceTotal(sale),
    0
  );

  const totalPurchases = receivedPurchases.reduce(
    (sum, purchase) => sum + invoiceTotal(purchase),
    0
  );

  const receivables = activeSales.reduce(
    (sum, sale) =>
      sum + Math.max(0, invoiceTotal(sale) - paidAmount(sale)),
    0
  );

  const payables = activePurchases.reduce(
    (sum, purchase) =>
      sum + Math.max(0, invoiceTotal(purchase) - paidAmount(purchase)),
    0
  );

  res.json({
    totalSales,
    totalPurchases,
    receivables,
    payables,
    salesCount: activeSales.length,
    purchasesCount: activePurchases.length,
    paymentCount: db.payments.length,
  });
});

// ---------- برگشت خرید و فروش ----------

app.get("/api/returns", (req, res) => {
  res.json({
    salesReturns: db.salesReturns,
    purchaseReturns: db.purchaseReturns,
  });
});

app.get("/api/returns/sales", (req, res) => {
  res.json(db.salesReturns);
});

app.get("/api/returns/purchases", (req, res) => {
  res.json(db.purchaseReturns);
});

function processReturn({ kind, source, body, res }) {
  const isSale = kind === "sale";
  const sourceItems = source.items || [];

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return badRequest(res, "حداقل یک محصول برای برگشت انتخاب کن.");
  }

  if (!isSale && !isReceived(source)) {
    return badRequest(res, "فقط خرید دریافت‌شده قابل برگشت است.");
  }

  const snapshot = transactionSnapshot();

  try {
    let gross = 0;
    const items = [];
    const requestedQuantities = new Map();

    for (const raw of body.items) {
      const productId = getItemProductId(raw);
      const quantity = number(raw.quantity, NaN);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("تعداد برگشت باید عدد صحیح مثبت باشد.");
      }

      const product = getProduct(productId);

      if (!product) {
        throw new Error(`محصول ${productId} پیدا نشد.`);
      }

      const originalQuantity = totalItemQty(sourceItems, productId);
      const previousReturns = returnedQty(
        isSale ? db.salesReturns : db.purchaseReturns,
        source.id,
        productId
      );

      const requestedSoFar =
        requestedQuantities.get(String(productId)) || 0;

      if (
        quantity + previousReturns + requestedSoFar >
        originalQuantity
      ) {
        throw new Error(
          `تعداد برگشت محصول «${product.name}» بیشتر از مقدار فاکتور است.`
        );
      }

      requestedQuantities.set(
        String(productId),
        requestedSoFar + quantity
      );

      if (!isSale && productStock(product) < quantity) {
        throw new Error(
          `موجودی محصول «${product.name}» برای برگشت خرید کافی نیست.`
        );
      }

      const original = sourceItems.find((item) =>
        sameId(getItemProductId(item), productId)
      );

      const unitPrice = getItemPrice(original);
      const lineTotal = unitPrice * quantity;

      gross += lineTotal;

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    let totalAmount = gross;

    if (isSale) {
      const subtotal = sourceItems.reduce(
        (sum, item) =>
          sum + getItemQty(item) * getItemPrice(item),
        0
      );

      const discount = number(
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

    const date = body.date || dateNow();

    for (const item of items) {
      changeStock(
        getProduct(item.productId),
        item.quantity,
        isSale ? 1 : -1,
        isSale ? "sales-return" : "purchase-return",
        source.id,
        date
      );
    }

    const refundAmount = applyReturnFinance(source, totalAmount);

    const record = {
      id: newId(isSale ? db.salesReturns : db.purchaseReturns),
      referenceId: source.id,
      ...(isSale
        ? {
            invoiceNumber: source.invoiceNumber || source.id,
            customerId: source.customerId ?? null,
          }
        : { supplierId: source.supplierId ?? null }),
      date,
      type: isSale ? "sales-return" : "purchase-return",
      reason: body.reason || "",
      refundMethod: body.refundMethod || "نامشخص",
      items,
      totalAmount,
      refundAmount,
      status: "ثبت‌شده",
    };

    (isSale ? db.salesReturns : db.purchaseReturns).push(record);

    if (refundAmount > 0) {
      addPayment({
        type: isSale ? "sales-return" : "purchase-return",
        referenceId: source.id,
        amount: -refundAmount,
        method: record.refundMethod,
        date,
        description: `بازپرداخت برگشت ${isSale ? "فروش" : "خرید"} ${source.invoiceNumber || source.id}`,
        customerId: source.customerId,
        supplierId: source.supplierId,
      });
    }

    persistTransaction(
      [
        "products",
        "inventory",
        "stockMovements",
        isSale ? "sales" : "purchases",
        isSale ? "salesReturns" : "purchaseReturns",
        "payments",
      ],
      snapshot
    );

    return res.status(201).json({
      message: "برگشت با موفقیت ثبت شد.",
      data: record,
    });
  } catch (error) {
    restoreSnapshot(snapshot);
    return badRequest(res, error.message);
  }
}

app.post("/api/returns/sales/:saleId", (req, res) => {
  const sale = getById(db.sales, req.params.saleId);

  if (!sale) return notFound(res, "فاکتور فروش پیدا نشد.");

  return processReturn({
    kind: "sale",
    source: sale,
    body: req.body || {},
    res,
  });
});

app.post("/api/returns/purchases/:purchaseId", (req, res) => {
  const purchase = getById(db.purchases, req.params.purchaseId);

  if (!purchase) return notFound(res, "فاکتور خرید پیدا نشد.");

  return processReturn({
    kind: "purchase",
    source: purchase,
    body: req.body || {},
    res,
  });
});

// ---------- گزارش‌های محاسباتی ----------

function buildReports() {
  const productSales = new Map();
  const categorySales = new Map();
  const dailySales = new Map();
  const methods = new Map();

  for (const sale of db.sales.filter((item) => !isCancelled(item))) {
    const date = String(sale.date || "").slice(0, 10) || "نامشخص";

    dailySales.set(
      date,
      (dailySales.get(date) || 0) + invoiceTotal(sale)
    );

    const method = sale.paymentMethod || "نامشخص";

    methods.set(
      method,
      (methods.get(method) || 0) + invoiceTotal(sale)
    );

    for (const item of sale.items || []) {
      const productId = getItemProductId(item);
      const product = getProduct(productId);
      const key = String(productId);

      const old = productSales.get(key) || {
        productId,
        name: item.name || item.productName || product?.name || "محصول",
        quantity: 0,
        sales: 0,
      };

      old.quantity += getItemQty(item);
      old.sales += number(
        item.totalPrice,
        getItemQty(item) * getItemPrice(item)
      );

      productSales.set(key, old);

      const category = product?.category || "بدون دسته‌بندی";

      categorySales.set(
        category,
        (categorySales.get(category) || 0) +
          number(item.totalPrice, getItemQty(item) * getItemPrice(item))
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
    paymentMethods: [...methods].map(([name, value]) => ({
      name,
      value,
    })),
  };
}

app.get("/api/reports", (req, res) => {
  res.json(buildReports());
});

app.get("/api/reports/:name", (req, res) => {
  const reports = buildReports();
  const report = reports[req.params.name];

  if (!report) {
    return notFound(res, "گزارش موردنظر پیدا نشد.");
  }

  res.json(report);
});

// ---------- خطاها و اجرای سرور ----------

app.use((req, res) => {
  res.status(404).json({
    message: "مسیر API پیدا نشد.",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("StoreFlow error:", error);

  if (res.headersSent) return next(error);

  res.status(500).json({
    message: "خطای داخلی سرور رخ داد.",
  });
});

app.listen(PORT, () => {
  console.log(`StoreFlow API running at http://localhost:${PORT}`);
});
