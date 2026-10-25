
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const sameId = (a, b) => String(a) === String(b);

const round = (number) =>
  Math.round(number * 100) / 100;

function nextId(items) {
  const ids = items
    .map((item) => Number(item.id))
    .filter(Number.isFinite);

  return ids.length ? Math.max(...ids) + 1 : 1;
}

function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function getStatus(status) {
  const value = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    ["تکمیل‌شده", "تکمیل شده", "دریافت‌شده",
      "دریافت شده", "completed", "received"].includes(value)
  ) {
    return "received";
  }

  if (
    ["لغوشده", "لغو شده", "cancelled", "canceled"].includes(value)
  ) {
    return "cancelled";
  }

  return "pending";
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
        console.error(
          "Rollback failed:",
          rollbackError.message
        );
      }
    }

    return error;
  }
}

// ساخت اقلام خرید و بررسی داده‌های ارسالی
function buildItems(items, db) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "خرید باید حداقل یک محصول داشته باشد." };
  }

  const grouped = new Map();

  for (const row of items) {
    const product = db.products.find((item) =>
      sameId(item.id, row.productId)
    );

    if (!product) {
      return {
        error: `محصول ${row.productId} پیدا نشد.`,
        status: 404,
      };
    }

    const quantity = Number(row.quantity);
    const unitPrice = Number(row.unitPrice);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { error: "تعداد خرید باید عدد صحیح مثبت باشد." };
    }

    if (
      row.unitPrice === undefined ||
      row.unitPrice === "" ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0
    ) {
      return { error: "قیمت خرید معتبر نیست." };
    }

    const key = String(product.id);

    const current = grouped.get(key) || {
      product,
      quantity: 0,
      totalCost: 0,
    };

    current.quantity += quantity;
    current.totalCost += quantity * unitPrice;

    grouped.set(key, current);
  }

  const result = [...grouped.values()].map((entry) => ({
    productId: entry.product.id,
    productName: entry.product.name,
    quantity: entry.quantity,
    unitPrice: round(
      entry.totalCost / entry.quantity
    ),
    totalPrice: round(entry.totalCost),
  }));

  return { items: result, grouped };
}

// محاسبه موجودی و بهای میانگین پس از دریافت خرید
function prepareStockChanges(db, grouped, purchaseId, date) {
  const nextProducts = db.products.map((product) => {
    const entry = grouped.get(String(product.id));

    if (!entry) return product;

    const oldStock = Number(product.stock ?? 0);
    const incomingQty = entry.quantity;
    const newStock = oldStock + incomingQty;

    const oldCostValue =
      product.averageCost ?? product.costPrice;

    const oldCost =
      oldCostValue === undefined ||
      oldCostValue === null ||
      oldCostValue === ""
        ? null
        : Number(oldCostValue);

    // اگر بهای قبلی مشخص نیست، بهای قبلی را حدس نمی‌زنیم.
    const averageCost =
      oldStock === 0
        ? entry.totalCost / incomingQty
        : Number.isFinite(oldCost) && oldCost >= 0
          ? (
              oldStock * oldCost + entry.totalCost
            ) / newStock
          : null;

    const updated = {
      ...product,
      stock: newStock,
      Status:
        newStock <= 0
          ? "ناموجود"
          : newStock <= Number(product.minStock ?? 0)
            ? "رو به اتمام"
            : "موجود",
    };

    if (averageCost !== null) {
      updated.averageCost = round(averageCost);
      updated.costPrice = round(averageCost);
    }

    return updated;
  });

  const nextInventory = db.inventory.map((row) => {
    const productId = row.productId ?? row.product_id;
    const entry = grouped.get(String(productId));

    if (!entry) return row;

    const field =
      row.quantity !== undefined ? "quantity" : "stock";

    const quantity = Number(row[field] ?? 0) + entry.quantity;
    const minimum = Number(
      row.minQuantity ?? row.minStock ?? 0
    );

    return {
      ...row,
      [field]: quantity,
      lastUpdated: date,
      status:
        quantity <= 0
          ? "ناموجود"
          : quantity <= minimum
            ? "کمبود موجودی"
            : "موجود",
    };
  });

  // برای محصولی که رکورد انبار ندارد، رکورد جدید ایجاد می‌کنیم.
  const knownIds = new Set(
    nextInventory.map((row) =>
      String(row.productId ?? row.product_id)
    )
  );

  for (const [productId] of grouped) {
    if (knownIds.has(productId)) continue;

    const product = nextProducts.find((item) =>
      sameId(item.id, productId)
    );

    nextInventory.push({
      id: nextId(nextInventory),
      productId: product.id,
      productName: product.name,
      sku: product.sku ?? "",
      quantity: Number(product.stock ?? 0),
      minQuantity: Number(product.minStock ?? 0),
      unit: product.unit ?? "عدد",
      warehouse: "انبار اصلی",
      lastUpdated: date,
      status:
        Number(product.stock ?? 0) <=
        Number(product.minStock ?? 0)
          ? "کمبود موجودی"
          : "موجود",
    });

    knownIds.add(productId);
  }

  const nextMovements = [...db.stockMovements];

  for (const [productId, entry] of grouped) {
    nextMovements.push({
      id: nextId(nextMovements),
      productId: entry.product.id,
      type: "in",
      quantity: entry.quantity,
      reason: "purchase",
      referenceId: purchaseId,
      createdAt: date,
    });
  }

  return {
    nextProducts,
    nextInventory,
    nextMovements,
  };
}

module.exports = function createPurchasesRouter({ db, dataPath }) {
  // دریافت فهرست خریدها
  router.get("/", (req, res) => {
    let purchases = [...db.purchases];

    if (req.query.supplierId) {
      purchases = purchases.filter((item) =>
        sameId(item.supplierId, req.query.supplierId)
      );
    }

    if (req.query.status) {
      purchases = purchases.filter((item) =>
        String(item.status) === String(req.query.status)
      );
    }

    res.json({
      success: true,
      count: purchases.length,
      data: purchases,
    });
  });

  // دریافت یک خرید
  router.get("/:id", (req, res) => {
    const purchase = db.purchases.find((item) =>
      sameId(item.id, req.params.id)
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "خرید پیدا نشد.",
      });
    }

    res.json({ success: true, data: purchase });
  });

  // ثبت سفارش خرید
  router.post("/", (req, res) => {
    const body = req.body;

    if (!isObject(body)) {
      return res.status(400).json({
        success: false,
        message: "اطلاعات ارسالی معتبر نیست.",
      });
    }

    const supplier = db.suppliers.find((item) =>
      sameId(item.id, body.supplierId)
    );

    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: "تأمین‌کننده انتخاب‌شده وجود ندارد.",
      });
    }

    const shippingCost = Number(body.shippingCost ?? 0);

    if (
      !Number.isFinite(shippingCost) ||
      shippingCost < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "هزینه ارسال معتبر نیست.",
      });
    }

    const built = buildItems(body.items, db);

    if (built.error) {
      return res.status(built.status || 400).json({
        success: false,
        message: built.error,
      });
    }

    const status = body.status || "در انتظار دریافت";

    if (getStatus(status) === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "سفارش جدید را با وضعیت لغوشده ثبت نکنید.",
      });
    }

    const id = nextId(db.purchases);
    const date = new Date().toISOString();
    const received = getStatus(status) === "received";

    const itemTotal = built.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const purchase = {
      id,
      orderNumber:
        body.orderNumber ||
        `PO-${String(id).padStart(4, "0")}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      orderDate: body.orderDate || date.slice(0, 10),
      expectedDate: body.expectedDate ?? null,
      receivedDate: received ? date.slice(0, 10) : null,
      status: received ? "تکمیل‌شده" : "در انتظار دریافت",
      itemsCount: built.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      items: built.items,
      shippingCost,
      totalAmount: round(itemTotal + shippingCost),
      description: body.description || "",
    };

    const nextPurchases = [...db.purchases, purchase];

    let changes = [
      ["purchases.json", nextPurchases],
    ];

    let stockChanges = null;

    if (received) {
      stockChanges = prepareStockChanges(
        db,
        built.grouped,
        id,
        date
      );

      changes = changes.concat([
        ["products.json", stockChanges.nextProducts],
        ["inventory.json", stockChanges.nextInventory],
        ["stockMovements.json", stockChanges.nextMovements],
      ]);
    }

    const error = saveChanges(dataPath, changes);

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "ذخیره خرید انجام نشد.",
      });
    }

    db.purchases = nextPurchases;

    if (stockChanges) {
      db.products = stockChanges.nextProducts;
      db.inventory = stockChanges.nextInventory;
      db.stockMovements = stockChanges.nextMovements;
    }

    return res.status(201).json({
      success: true,
      message: received
        ? "خرید ثبت شد و موجودی افزایش یافت."
        : "سفارش خرید ثبت شد و منتظر دریافت است.",
      data: purchase,
    });
  });

  // دریافت کالاهای سفارش خرید
  router.post("/:id/receive", (req, res) => {
    const purchase = db.purchases.find((item) =>
      sameId(item.id, req.params.id)
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "خرید پیدا نشد.",
      });
    }

    if (getStatus(purchase.status) === "received") {
      return res.status(409).json({
        success: false,
        message: "این خرید قبلاً دریافت شده است.",
      });
    }

    if (getStatus(purchase.status) === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "خرید لغوشده قابل دریافت نیست.",
      });
    }

    const built = buildItems(
      (purchase.items || []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      db
    );

    if (built.error) {
      return res.status(built.status || 400).json({
        success: false,
        message: built.error,
      });
    }

    const date = new Date().toISOString();

    const receivedPurchase = {
      ...purchase,
      status: "تکمیل‌شده",
      receivedDate: date.slice(0, 10),
    };

    const nextPurchases = db.purchases.map((item) =>
      sameId(item.id, purchase.id)
        ? receivedPurchase
        : item
    );

    const stockChanges = prepareStockChanges(
      db,
      built.grouped,
      purchase.id,
      date
    );

    const changes = [
      ["purchases.json", nextPurchases],
      ["products.json", stockChanges.nextProducts],
      ["inventory.json", stockChanges.nextInventory],
      ["stockMovements.json", stockChanges.nextMovements],
    ];

    const error = saveChanges(dataPath, changes);

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "دریافت خرید ذخیره نشد.",
      });
    }

    db.purchases = nextPurchases;
    db.products = stockChanges.nextProducts;
    db.inventory = stockChanges.nextInventory;
    db.stockMovements = stockChanges.nextMovements;

    return res.json({
      success: true,
      message: "خرید دریافت شد و موجودی به‌روزرسانی شد.",
      data: receivedPurchase,
    });
  });

  // ویرایش فقط اطلاعات جانبی سفارش
  router.patch("/:id", (req, res) => {
    const index = db.purchases.findIndex((item) =>
      sameId(item.id, req.params.id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "خرید پیدا نشد.",
      });
    }

    if (!isObject(req.body) || !Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        message: "اطلاعات ویرایش معتبر نیست.",
      });
    }

    const protectedFields = [
      "id",
      "items",
      "status",
      "totalAmount",
      "itemsCount",
      "supplierId",
      "supplierName",
      "shippingCost",
      "orderNumber",
    ];

    const blocked = protectedFields.filter((field) =>
      Object.prototype.hasOwnProperty.call(req.body, field)
    );

    if (blocked.length) {
      return res.status(400).json({
        success: false,
        message:
          `تغییر این فیلدها از این مسیر مجاز نیست: ${blocked.join(", ")}`,
      });
    }

    const updated = {
      ...db.purchases[index],
      ...req.body,
      id: db.purchases[index].id,
    };

    const nextPurchases = [...db.purchases];
    nextPurchases[index] = updated;

    const error = saveChanges(dataPath, [
      ["purchases.json", nextPurchases],
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "ذخیره تغییرات انجام نشد.",
      });
    }

    db.purchases = nextPurchases;

    res.json({
      success: true,
      message: "اطلاعات خرید به‌روزرسانی شد.",
      data: updated,
    });
  });

  router.put("/:id", (req, res) => {
    res.status(405).json({
      success: false,
      message: "جایگزینی کامل خرید غیرفعال است.",
    });
  });

  // سفارش دریافت‌شده حذف نمی‌شود تا سابقه و موجودی ناسازگار نشوند.
  router.delete("/:id", (req, res) => {
    const purchase = db.purchases.find((item) =>
      sameId(item.id, req.params.id)
    );

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "خرید پیدا نشد.",
      });
    }

    if (getStatus(purchase.status) === "received") {
      return res.status(409).json({
        success: false,
        message: "خرید دریافت‌شده بدون برگشت خرید حذف نمی‌شود.",
      });
    }

    const nextPurchases = db.purchases.filter(
      (item) => !sameId(item.id, req.params.id)
    );

    const error = saveChanges(dataPath, [
      ["purchases.json", nextPurchases],
    ]);

    if (error) {
      return res.status(500).json({
        success: false,
        message: "حذف خرید ذخیره نشد.",
      });
    }

    db.purchases = nextPurchases;

    res.json({
      success: true,
      message: "سفارش خرید حذف شد.",
      data: purchase,
    });
  });

  return router;
};
