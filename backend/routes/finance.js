
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const sameId = (a, b) => String(a) === String(b);

const round = (value) =>
  Math.round(value * 100) / 100;

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
        console.error(
          `Rollback failed for ${fileName}:`,
          rollbackError.message
        );
      }
    }

    return error;
  }
}

function getPaymentStatus(paid, total) {
  if (paid >= total) return "تسویه‌شده";
  if (paid <= 0) return "پرداخت‌نشده";
  return "بدهکار";
}

function getTotals(records, type) {
  return records.reduce(
    (totals, record) => {
      const total = Number(
        record.totalAmount ?? record.total ?? 0
      );

      const paid = Number(record.paidAmount ?? 0);
      const remaining = Math.max(
        0,
        Number(
          record.remainingAmount ?? total - paid
        )
      );

      totals.total += total;
      totals.paid += paid;
      totals.remaining += remaining;

      return totals;
    },
    { type, total: 0, paid: 0, remaining: 0 }
  );
}

module.exports = function createFinanceRouter({ db, dataPath }) {
  // دریافت سوابق پرداخت
  router.get("/payments", (req, res) => {
    let payments = [...db.payments];

    if (req.query.type) {
      payments = payments.filter(
        (payment) => payment.type === req.query.type
      );
    }

    if (req.query.method) {
      payments = payments.filter(
        (payment) => payment.method === req.query.method
      );
    }

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  });

  // ثبت پرداخت برای فاکتور فروش یا خرید
  router.post("/payments", (req, res) => {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: false,
        message: "اطلاعات پرداخت معتبر نیست.",
      });
    }

    const type = body.type;
    const referenceId = body.referenceId;
    const amount = Number(body.amount);
    const method = body.method;

    if (!["sale", "purchase"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "نوع پرداخت باید sale یا purchase باشد.",
      });
    }

    if (
      referenceId === undefined ||
      referenceId === null ||
      referenceId === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "شناسه فاکتور الزامی است.",
      });
    }

    if (
      body.amount === undefined ||
      body.amount === "" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "مبلغ پرداخت باید عددی مثبت باشد.",
      });
    }

    if (
      typeof method !== "string" ||
      !method.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "روش پرداخت الزامی است.",
      });
    }

    const records =
      type === "sale" ? db.sales : db.purchases;

    const fileName =
      type === "sale"
        ? "salesInvoices.json"
        : "purchases.json";

    const record = records.find((item) =>
      sameId(item.id, referenceId)
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "فاکتور موردنظر پیدا نشد.",
      });
    }

    if (
      type === "purchase" &&
      ["لغوشده", "لغو شده", "cancelled", "canceled"].includes(
        String(record.status).toLowerCase()
      )
    ) {
      return res.status(409).json({
        success: false,
        message: "برای خرید لغوشده نمی‌توان پرداخت ثبت کرد.",
      });
    }

    const total = Number(
      record.totalAmount ?? record.total
    );

    if (!Number.isFinite(total) || total < 0) {
      return res.status(400).json({
        success: false,
        message: "مبلغ فاکتور معتبر نیست.",
      });
    }

    const paidBefore = Number(record.paidAmount ?? 0);
    const remainingBefore = round(
      Math.max(0, total - paidBefore)
    );

    if (amount > remainingBefore) {
      return res.status(400).json({
        success: false,
        message: "مبلغ پرداخت از مانده فاکتور بیشتر است.",
        remainingAmount: remainingBefore,
      });
    }

    const paidAmount = round(paidBefore + amount);
    const remainingAmount = round(total - paidAmount);
    const paymentStatus = getPaymentStatus(
      paidAmount,
      total
    );

    const updatedRecord = {
      ...record,
      paidAmount,
      remainingAmount,
      paymentStatus,
    };

    const nextRecords = records.map((item) =>
      sameId(item.id, record.id)
        ? updatedRecord
        : item
    );

    const payment = {
      id: nextId(db.payments),
      type,
      referenceId: record.id,
      amount: round(amount),
      method: method.trim(),
      date: new Date().toISOString(),
      description:
        body.description?.trim() ||
        `پرداخت ${type === "sale" ? "فاکتور فروش" : "سفارش خرید"} شماره ${record.id}`,
    };

    if (type === "sale") {
      payment.customerId = record.customerId ?? null;
    } else {
      payment.supplierId = record.supplierId ?? null;
    }

    const nextPayments = [...db.payments, payment];

    const error = saveChanges(dataPath, [
      [fileName, nextRecords],
      ["payments.json", nextPayments],
    ]);

    if (error) {
      console.error("Payment save failed:", error.message);

      return res.status(500).json({
        success: false,
        message: "ثبت پرداخت انجام نشد.",
      });
    }

    if (type === "sale") {
      db.sales = nextRecords;
    } else {
      db.purchases = nextRecords;
    }

    db.payments = nextPayments;

    return res.status(201).json({
      success: true,
      message: "پرداخت با موفقیت ثبت شد.",
      data: {
        payment,
        invoice: updatedRecord,
      },
    });
  });

  // خلاصه حساب‌های دریافتنی و پرداختنی
  router.get("/summary", (req, res) => {
    const receivables = getTotals(
      db.sales,
      "receivables"
    );

    const payables = getTotals(
      db.purchases.filter(
        (purchase) =>
          !["لغوشده", "لغو شده", "cancelled", "canceled"].includes(
            String(purchase.status).toLowerCase()
          )
      ),
      "payables"
    );

    res.json({
      success: true,
      data: {
        receivables: {
          total: round(receivables.total),
          paid: round(receivables.paid),
          remaining: round(receivables.remaining),
        },
        payables: {
          total: round(payables.total),
          paid: round(payables.paid),
          remaining: round(payables.remaining),
        },
      },
    });
  });

  return router;
};
