
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const sameId = (a, b) => String(a) === String(b);
const round = (n) => Math.round(n * 100) / 100;

function nextId(items) {
  const ids = items
    .map((item) => Number(item.id))
    .filter(Number.isFinite);

  return ids.length ? Math.max(...ids) + 1 : 1;
}

function saveChanges(dataPath, changes) {
  const previous = new Map();
  const written = [];

  try {
    for (const [fileName] of changes) {
      const filePath = path.join(dataPath, fileName);

      previous.set(
        fileName,
        fs.existsSync(filePath)
          ? fs.readFileSync(filePath, "utf8")
          : null
      );
    }

    for (const [fileName, data] of changes) {
      fs.writeFileSync(
        path.join(dataPath, fileName),
        JSON.stringify(data, null, 2),
        "utf8"
      );

      written.push(fileName);
    }

    return null;
  } catch (error) {
    for (const fileName of written.reverse()) {
      const filePath = path.join(dataPath, fileName);

      try {
        const oldContent = previous.get(fileName);

        if (oldContent === null) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } else {
          fs.writeFileSync(filePath, oldContent, "utf8");
        }
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
    }

    return error;
  }
}

function getInventoryField(item) {
  if (item.stock !== undefined) return "stock";
  if (item.quantity !== undefined) return "quantity";
  return "stock";
}

function getProductStock(product) {
  const stock = Number(product.stock ?? 0);
  return Number.isFinite(stock) ? stock : 0;
}

function getItemPrice(item) {
  return Number(item.unitPrice ?? item.price ?? 0);
}

function getPreviouslyReturned(returns, referenceId, productId) {
  return returns.reduce((sum, record) => {
    if (!sameId(record.referenceId, referenceId)) {
      return sum;
    }

    return sum + (record.items || []).reduce((quantity, item) => {
      return sameId(item.productId, productId)
        ? quantity + Number(item.quantity || 0)
        : quantity;
    }, 0);
  }, 0);
}

function prepareStock(db, grouped, direction, returnId, reason, date) {
  const nextProducts = db.products.map((product) => {
    const change = grouped.get(String(product.id));

    if (!change) return product;

    const currentStock = getProductStock(product);
    const newStock =
      direction === "in"
        ? currentStock + change.quantity
        : currentStock - change.quantity;

    return {
      ...product,
      stock: newStock,
      Status:
        newStock <= 0
          ? "ناموجود"
          : newStock <= Number(product.minStock ?? 0)
            ? "رو به اتمام"
            : "موجود",
    };
  });

  const nextInventory = db.inventory.map((record) => {
    const productId = record.productId ?? record.product_id;
    const change = grouped.get(String(productId));

    if (!change) return record;

    const field = getInventoryField(record);
    const current = Number(record[field] ?? 0);

    const newQuantity =
      direction === "in"
        ? current + change.quantity
        : current - change.quantity;

    return {
      ...record,
      [field]: newQuantity,
      lastUpdated: date,
      status:
        newQuantity <= 0
          ? "ناموجود"
          : newQuantity <= Number(
              record.minQuantity ?? record.minStock ?? 0
            )
            ? "کمبود موجودی"
            : "موجود",
    };
  });

  // اگر رکورد موجودی برای محصولی وجود نداشته باشد، ایجادش می‌کنیم.
  const inventoryIds = new Set(
    nextInventory.map((item) =>
      String(item.productId ?? item.product_id)
    )
  );

  for (const [productId] of grouped) {
    if (inventoryIds.has(productId)) continue;

    const product = nextProducts.find((item) =>
      sameId(item.id, productId)
    );

    nextInventory.push({
      id: nextId(nextInventory),
      productId: product.id,
      productName: product.name,
      sku: product.sku ?? "",
      quantity: getProductStock(product),
      minQuantity: Number(product.minStock ?? 0),
      unit: product.unit ?? "عدد",
      warehouse: "انبار اصلی",
      lastUpdated: date,
      status:
        getProductStock(product) <=
        Number(product.minStock ?? 0)
          ? "کمبود موجودی"
          : "موجود",
    });

    inventoryIds.add(productId);
  }

  const nextMovements = [...db.stockMovements];

  for (const [productId, change] of grouped) {
    const product = nextProducts.find((item) =>
      sameId(item.id, productId)
    );

    nextMovements.push({
      id: nextId(nextMovements),
      productId: product.id,
      type: direction,
      quantity: change.quantity,
      reason,
      referenceId: returnId,
      createdAt: date,
    });
  }

  return {
    nextProducts,
    nextInventory,
    nextMovements,
  };
}

module.exports = function createReturnsRouter({ db, dataPath }) {
  // مشاهده همه برگشت‌ها
  router.get("/", (req, res) => {
    res.json({
      success: true,
      data: {
        salesReturns: db.salesReturns,
        purchaseReturns: db.purchaseReturns,
      },
    });
  });

  router.get("/sales", (req, res) => {
    res.json({
      success: true,
      count: db.salesReturns.length,
      data: db.salesReturns,
    });
  });

  router.get("/purchases", (req, res) => {
    res.json({
      success: true,
      count: db.purchaseReturns.length,
      data: db.purchaseReturns,
    });
  });
function applyReturnToInvoice(invoice, returnAmount) {
  const oldTotal = Number(
    invoice.totalAmount ?? invoice.total ?? 0
  );

  const oldPaid = Number(invoice.paidAmount ?? 0);
  const oldRemaining = Math.max(0, oldTotal - oldPaid);

  const amount = Math.min(
    Math.max(0, Number(returnAmount) || 0),
    oldTotal
  );

  // مبلغ فاکتور پس از برگشت
  const newTotal = Math.max(0, oldTotal - amount);

  /*
   * ابتدا مبلغ برگشت از بدهی/طلب باز فاکتور کم می‌شود.
   * فقط مبلغی که از مانده بیشتر باشد، بازپرداخت نقدی است.
   */
  const refundAmount = Math.max(0, amount - oldRemaining);
  const newPaid = Math.max(0, oldPaid - refundAmount);

  invoice.totalAmount = newTotal;
  invoice.paidAmount = newPaid;
  invoice.remainingAmount = Math.max(0, newTotal - newPaid);

  if (invoice.remainingAmount === 0) {
    invoice.paymentStatus = "تسویه‌شده";
  } else if (newPaid === 0) {
    invoice.paymentStatus = "پرداخت‌نشده";
  } else {
    invoice.paymentStatus = "بدهکار";
  }

  return {
    returnAmount: amount,
    refundAmount,
  };
}function createReturnPayment({
  db,
  type,
  referenceId,
  amount,
  method,
  date,
  description,
}) {
  // وقتی برگشت فقط بدهی فاکتور را کاهش می‌دهد،
  // تراکنش نقدی جدیدی ایجاد نمی‌شود.
  if (amount <= 0) return null;

  const payment = {
    id: Date.now(),
    type,
    referenceId,
    amount: -amount,
    method: method || "نامشخص",
    date: date || new Date().toISOString(),
    description,
  };

  db.payments.push(payment);

  return payment;
}
  // ثبت برگشت فروش
  router.post("/sales/:saleId", (req, res) => {
    const sale = db.sales.find((item) =>
      sameId(item.id, req.params.saleId)
    );

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "فاکتور فروش پیدا نشد.",
      });
    }

    const requestedItems = req.body?.items;

    if (!Array.isArray(requestedItems) || !requestedItems.length) {
      return res.status(400).json({
        success: false,
        message: "حداقل یک قلم کالا برای برگشت لازم است.",
      });
    }

    const grouped = new Map();

    for (const row of requestedItems) {
      const quantity = Number(row.quantity);

      if (
        row.productId === undefined ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "شناسه محصول یا تعداد برگشتی معتبر نیست.",
        });
      }

      const key = String(row.productId);
      grouped.set(key, (grouped.get(key) || 0) + quantity);
    }

    const returnItems = [];
    let refundAmount = 0;

    for (const [productId, quantity] of grouped) {
      const soldItem = (sale.items || []).find((item) =>
        sameId(item.productId, productId)
      );

      if (!soldItem) {
        return res.status(400).json({
          success: false,
          message: `محصول ${productId} در فاکتور فروش وجود ندارد.`,
        });
      }

      const previouslyReturned = getPreviouslyReturned(
        db.salesReturns,
        sale.id,
        productId
      );

      const availableToReturn =
        Number(soldItem.quantity) - previouslyReturned;

      if (quantity > availableToReturn) {
        return res.status(400).json({
          success: false,
          message: "تعداد برگشتی از تعداد باقی‌مانده فاکتور بیشتر است.",
          productId,
          availableToReturn,
        });
      }

      const product = db.products.find((item) =>
        sameId(item.id, productId)
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصول ${productId} پیدا نشد.`,
        });
      }

      const unitPrice = getItemPrice(soldItem);

      // تخفیف فاکتور به نسبت مبلغ اقلام توزیع می‌شود.
      const grossSubtotal = (sale.items || []).reduce(
        (sum, item) =>
          sum + getItemPrice(item) * Number(item.quantity || 0),
        0
      );

      const discount = Number(sale.discount ?? 0);
      const discountPerUnit =
        grossSubtotal > 0
          ? (discount * unitPrice) / grossSubtotal
          : 0;

      const netUnitPrice = Math.max(
        0,
        unitPrice - discountPerUnit
      );

      const amount = round(netUnitPrice * quantity);

      returnItems.push({
        productId: soldItem.productId,
        productName: soldItem.name ?? soldItem.productName ?? product.name,
        quantity,
        unitPrice: round(netUnitPrice),
        totalPrice: amount,
      });

      refundAmount += amount;
    }

    refundAmount = round(refundAmount);

    const returnId = nextId(db.salesReturns);
    const date = new Date().toISOString();

    const record = {
      id: returnId,
      referenceId: sale.id,
      invoiceNumber: sale.invoiceNumber ?? null,
      customerId: sale.customerId ?? null,
      date,
      type: "sales-return",
      reason: req.body.reason || "برگشت کالا",
      refundMethod: req.body.refundMethod || "ثبت‌نشده",
      items: returnItems,
      totalAmount: refundAmount,
      status: "ثبت‌شده",
    };

    const stockChanges = prepareStock(
      db,
      new Map(
        returnItems.map((item) => [
          String(item.productId),
          { quantity: item.quantity },
        ])
      ),
      "in",
      returnId,
      "sales-return",
      date
    );

    const nextReturns = [...db.salesReturns, record];

    const error = saveChanges(dataPath, [
      ["salesReturns.json", nextReturns],
      ["products.json", stockChanges.nextProducts],
      ["inventory.json", stockChanges.nextInventory],
      ["stockMovements.json", stockChanges.nextMovements],
    ]);

    if (error) {
      console.error("Sales return save failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "ثبت برگشت فروش انجام نشد.",
      });
    }

    db.salesReturns = nextReturns;
    db.products = stockChanges.nextProducts;
    db.inventory = stockChanges.nextInventory;
    db.stockMovements = stockChanges.nextMovements;

    return res.status(201).json({
      success: true,
      message: "برگشت فروش ثبت شد و کالا به موجودی اضافه شد.",
      data: record,
    });
  });

  // ثبت برگشت خرید
  router.post("/purchases/:purchaseId", (req, res) => {
    const purchase = db.purchases.find((item) =>
      sameId(item.id, req.params.purchaseId)
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "سفارش خرید پیدا نشد.",
      });
    }

    if (
      !["تکمیل‌شده", "تکمیل شده", "دریافت‌شده", "دریافت شده",
        "completed", "received"].includes(String(purchase.status))
    ) {
      return res.status(409).json({
        success: false,
        message: "برگشت کالا فقط پس از دریافت خرید مجاز است.",
      });
    }

    const requestedItems = req.body?.items;

    if (!Array.isArray(requestedItems) || !requestedItems.length) {
      return res.status(400).json({
        success: false,
        message: "حداقل یک قلم کالا برای برگشت لازم است.",
      });
    }

    const grouped = new Map();

    for (const row of requestedItems) {
      const quantity = Number(row.quantity);

      if (
        row.productId === undefined ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "شناسه محصول یا تعداد برگشتی معتبر نیست.",
        });
      }

      const key = String(row.productId);
      grouped.set(key, (grouped.get(key) || 0) + quantity);
    }

    const returnItems = [];
    let refundAmount = 0;

    for (const [productId, quantity] of grouped) {
      const purchasedItem = (purchase.items || []).find((item) =>
        sameId(item.productId, productId)
      );

      if (!purchasedItem) {
        return res.status(400).json({
          success: false,
          message: `محصول ${productId} در سفارش خرید وجود ندارد.`,
        });
      }

      const previouslyReturned = getPreviouslyReturned(
        db.purchaseReturns,
        purchase.id,
        productId
      );

      const availableToReturn =
        Number(purchasedItem.quantity) - previouslyReturned;

      if (quantity > availableToReturn) {
        return res.status(400).json({
          success: false,
          message: "تعداد برگشتی از مقدار خریداری‌شده بیشتر است.",
          productId,
          availableToReturn,
        });
      }

      const product = db.products.find((item) =>
        sameId(item.id, productId)
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `محصول ${productId} پیدا نشد.`,
        });
      }

      if (getProductStock(product) < quantity) {
        return res.status(409).json({
          success: false,
          message: `موجودی «${product.name}» برای برگشت کافی نیست.`,
          availableStock: getProductStock(product),
          requestedQuantity: quantity,
        });
      }

      const unitPrice = getItemPrice(purchasedItem);
      const amount = round(unitPrice * quantity);

      returnItems.push({
        productId: purchasedItem.productId,
        productName:
          purchasedItem.productName ?? product.name,
        quantity,
        unitPrice: round(unitPrice),
        totalPrice: amount,
      });

      refundAmount += amount;
    }

    refundAmount = round(refundAmount);

    const returnId = nextId(db.purchaseReturns);
    const date = new Date().toISOString();

    const record = {
      id: returnId,
      referenceId: purchase.id,
      supplierId: purchase.supplierId ?? null,
      date,
      type: "purchase-return",
      reason: req.body.reason || "برگشت به تأمین‌کننده",
      refundMethod: req.body.refundMethod || "ثبت‌نشده",
      items: returnItems,
      totalAmount: refundAmount,
      status: "ثبت‌شده",
    };

    const stockChanges = prepareStock(
      db,
      new Map(
        returnItems.map((item) => [
          String(item.productId),
          { quantity: item.quantity },
        ])
      ),
      "out",
      returnId,
      "purchase-return",
      date
    );

    const nextReturns = [...db.purchaseReturns, record];

    const error = saveChanges(dataPath, [
      ["purchaseReturns.json", nextReturns],
      ["products.json", stockChanges.nextProducts],
      ["inventory.json", stockChanges.nextInventory],
      ["stockMovements.json", stockChanges.nextMovements],
    ]);

    if (error) {
      console.error("Purchase return save failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "ثبت برگشت خرید انجام نشد.",
      });
    }

    db.purchaseReturns = nextReturns;
    db.products = stockChanges.nextProducts;
    db.inventory = stockChanges.nextInventory;
    db.stockMovements = stockChanges.nextMovements;

    return res.status(201).json({
      success: true,
      message: "برگشت خرید ثبت شد و کالا از موجودی کم شد.",
      data: record,
    });
  });

  return router;
};
