
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const round = (value) => Math.round(value * 100) / 100;

const sameId = (a, b) => String(a) === String(b);

function nextId(items) {
  const ids = items
    .map((item) => Number(item.id))
    .filter(Number.isFinite);

  return ids.length ? Math.max(...ids) + 1 : 1;
}

function inventoryProductId(item) {
  return item.productId ?? item.product_id;
}

function inventoryQuantityField(item) {
  if (item.stock !== undefined) return "stock";
  if (item.quantity !== undefined) return "quantity";
  return "stock";
}

// ذخیره چند فایل با تلاش برای بازگرداندن نسخه قبلی در صورت خطا
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
      const oldContent = previous.get(fileName);

      try {
        if (oldContent === null) {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } else {
          fs.writeFileSync(filePath, oldContent, "utf8");
        }
      } catch (rollbackError) {
        console.error(
          `Rollback failed for ${fileName}:`,
          rollbackError.message
        );
      }
    }

    return error;
  }
}

module.exports = function createSalesRouter({ db, dataPath }) {
  // دریافت فاکتورهای فروش
  router.get("/", (req, res) => {
    let sales = [...db.sales];

    if (req.query.customerId) {
      sales = sales.filter((sale) =>
        sameId(sale.customerId, req.query.customerId)
      );
    }

    if (req.query.status) {
      sales = sales.filter(
        (sale) => sale.status === req.query.status
      );
    }

    if (req.query.paymentStatus) {
      sales = sales.filter(
        (sale) => sale.paymentStatus === req.query.paymentStatus
      );
    }

    res.json({
      success: true,
      count: sales.length,
      data: sales,
    });
  });

  // دریافت یک فاکتور
  router.get("/:id", (req, res) => {
    const sale = db.sales.find((item) =>
      sameId(item.id, req.params.id)
    );

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "فاکتور فروش پیدا نشد.",
      });
    }

    res.json({ success: true, data: sale });
  });

  // ثبت فروش جدید
  router.post("/", (req, res) => {
    const body = req.body ?? {};
    const { customerId, paymentMethod } = body;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "فاکتور باید حداقل یک محصول داشته باشد.",
      });
    }

    if (
      customerId !== undefined &&
      customerId !== null &&
      !db.customers.some((customer) =>
        sameId(customer.id, customerId)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "مشتری انتخاب‌شده وجود ندارد.",
      });
    }

    // تجمیع ردیف‌های تکراری یک محصول
    const quantities = new Map();

    for (const row of body.items) {
      const productId = row.productId;
      const quantity = Number(row.quantity);

      if (
        productId === undefined ||
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "شناسه محصول یا تعداد معتبر نیست.",
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

      const key = String(product.id);

      quantities.set(
        key,
        (quantities.get(key) || 0) + quantity
      );
    }

    // بررسی موجودی محصولات
    for (const [productId, quantity] of quantities) {
      const product = db.products.find((item) =>
        sameId(item.id, productId)
      );

      const stock = Number(product.stock);

      if (!Number.isFinite(stock) || stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `موجودی «${product.name}» کافی نیست.`,
          availableStock: product.stock,
          requestedQuantity: quantity,
        });
      }

      // اگر رکورد متناظر در inventory وجود داشته باشد،
      // آن موجودی هم باید کافی باشد.
      const inventoryItem = db.inventory.find((item) =>
        sameId(inventoryProductId(item), productId)
      );

      if (inventoryItem) {
        const field = inventoryQuantityField(inventoryItem);
        const inventoryStock = Number(inventoryItem[field]);

        if (
          !Number.isFinite(inventoryStock) ||
          inventoryStock < quantity
        ) {
          return res.status(400).json({
            success: false,
            message: `موجودی انبار «${product.name}» کافی نیست.`,
          });
        }
      }
    }

    // ساخت اقلام فاکتور و محاسبات مالی
    const invoiceItems = [];

    for (const [productId, quantity] of quantities) {
      const product = db.products.find((item) =>
        sameId(item.id, productId)
      );

      const unitPrice = Number(product.price);

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `قیمت «${product.name}» معتبر نیست.`,
        });
      }

      const rawCost = product.averageCost ?? product.costPrice;
      const unitCost = Number(rawCost);

      const costKnown =
        rawCost !== undefined &&
        rawCost !== null &&
        rawCost !== "" &&
        Number.isFinite(unitCost) &&
        unitCost >= 0;

      invoiceItems.push({
        id: invoiceItems.length + 1,
        productId: product.id,
        name: product.name,
        sku: product.sku ?? null,
        quantity,
        price: unitPrice,
        totalPrice: round(unitPrice * quantity),
        unitCost: costKnown ? unitCost : null,
        costTotal: costKnown
          ? round(unitCost * quantity)
          : null,
        profit: costKnown
          ? round((unitPrice - unitCost) * quantity)
          : null,
      });
    }

    const subtotal = round(
      invoiceItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      )
    );

    const discount = Number(body.discount ?? 0);

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > subtotal
    ) {
      return res.status(400).json({
        success: false,
        message: "مبلغ تخفیف معتبر نیست.",
      });
    }

    const totalAmount = round(subtotal - discount);
    const paidAmount = Number(body.paidAmount ?? totalAmount);

    if (
      !Number.isFinite(paidAmount) ||
      paidAmount < 0 ||
      paidAmount > totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "مبلغ پرداختی باید بین صفر و مبلغ نهایی باشد.",
      });
    }

    const remainingAmount = round(totalAmount - paidAmount);

    const paymentStatus =
      remainingAmount === 0
        ? "تسویه‌شده"
        : paidAmount === 0
          ? "پرداخت‌نشده"
          : "بدهکار";

    const saleId = nextId(db.sales);
    const now = new Date();
    const date = now.toISOString();

    const customer =
      customerId == null
        ? null
        : db.customers.find((item) =>
            sameId(item.id, customerId)
          );

    const costKnown = invoiceItems.every(
      (item) => item.costTotal !== null
    );

    const costAmount = costKnown
      ? round(
          invoiceItems.reduce(
            (sum, item) => sum + item.costTotal,
            0
          )
        )
      : null;

    const sale = {
      id: saleId,
      invoiceNumber: `SF-${String(saleId).padStart(5, "0")}`,
      customerId: customer?.id ?? null,
      customer: customer?.name ?? "مشتری حضوری",
      date,
      items: invoiceItems,
      itemsCount: invoiceItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      subtotal,
      discount,
      totalAmount,
      costAmount,
      profitAmount: costKnown
        ? round(totalAmount - costAmount)
        : null,
      paidAmount,
      remainingAmount,
      paymentStatus,
      paymentMethod: paymentMethod || "نقدی",
      status: "تکمیل شده",
    };

    // آماده‌سازی کاهش موجودی
    const nextProducts = db.products.map((product) => {
      const quantity =
        quantities.get(String(product.id)) || 0;

      if (!quantity) return product;

      const stock = Number(product.stock) - quantity;

      return {
        ...product,
        stock,
        Status:
          stock <= 0
            ? "ناموجود"
            : stock <= Number(product.minStock ?? 0)
              ? "رو به اتمام"
              : "موجود",
      };
    });

    const nextInventory = db.inventory.map((item) => {
      const productId = inventoryProductId(item);
      const quantity =
        quantities.get(String(productId)) || 0;

      if (!quantity) return item;

      const field = inventoryQuantityField(item);
      const stock = Number(item[field]) - quantity;
      const minStock = Number(
        item.minStock ?? item.minQuantity ?? 0
      );

      return {
        ...item,
        [field]: stock,
        lastUpdated: date,
        status:
          stock <= 0
            ? "ناموجود"
            : stock <= minStock
              ? "کمبود موجودی"
              : "موجود",
      };
    });

    const nextMovements = [...db.stockMovements];

    for (const [productId, quantity] of quantities) {
      const product = db.products.find((item) =>
        sameId(item.id, productId)
      );

      nextMovements.push({
        id: nextId(nextMovements),
        productId: product.id,
        type: "out",
        quantity,
        reason: "sale",
        referenceId: saleId,
        createdAt: date,
      });
    }

    const nextSales = [...db.sales, sale];
    const nextPayments = [...db.payments];

    if (paidAmount > 0) {
      nextPayments.push({
        id: nextId(nextPayments),
        type: "sale",
        referenceId: saleId,
        customerId: customer?.id ?? null,
        amount: paidAmount,
        method: paymentMethod || "نقدی",
        date,
        description: `پرداخت فاکتور ${sale.invoiceNumber}`,
      });
    }

    // ذخیره هماهنگ فایل‌ها
    const changes = [
      ["salesInvoices.json", nextSales],
      ["products.json", nextProducts],
      ["inventory.json", nextInventory],
      ["stockMovements.json", nextMovements],
      ["payments.json", nextPayments],
    ];

    const error = saveChanges(dataPath, changes);

    if (error) {
      console.error("Failed to save sale:", error.message);

      return res.status(500).json({
        success: false,
        message: "ذخیره فروش انجام نشد.",
      });
    }

    // به‌روزرسانی حافظه پس از ذخیره موفق
    db.sales = nextSales;
    db.products = nextProducts;
    db.inventory = nextInventory;
    db.stockMovements = nextMovements;
    db.payments = nextPayments;

    return res.status(201).json({
      success: true,
      message: "فروش با موفقیت ثبت شد.",
      data: sale,
    });
  });

  // فاکتور ثبت‌شده مستقیم ویرایش یا حذف نمی‌شود.
  const immutableInvoice = (req, res) =>
    res.status(405).json({
      success: false,
      message:
        "برای اصلاح فاکتور ثبت‌شده باید از عملیات برگشت یا اصلاح استفاده کنید.",
    });

  router.put("/:id", immutableInvoice);
  router.patch("/:id", immutableInvoice);
  router.delete("/:id", immutableInvoice);

  return router;
};
