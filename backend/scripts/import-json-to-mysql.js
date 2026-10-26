
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const dataPath = path.join(__dirname, "..", "data");

function readJson(fileName) {
  const filePath = path.join(dataPath, fileName);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (!Array.isArray(data)) {
    throw new Error(`${fileName} باید شامل یک آرایه باشد.`);
  }

  return data;
}

async function main() {
  // خواندن اطلاعات اصلی
  const categories = readJson("categories.json");
  const products = readJson("products.json");
  const suppliers = readJson("suppliers.json");
  const customers = readJson("customers.json");
  const inventory = readJson("inventory.json");
  const stockMovements = readJson("stockMovements.json");
  const purchases = readJson("purchases.json");
  const sales = readJson("salesInvoices.json");

  // جلوگیری از واردکردن دوباره اطلاعات
  const counts = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.supplier.count(),
    prisma.customer.count(),
    prisma.inventoryItem.count(),
    prisma.stockMovement.count(),
    prisma.purchase.count(),
    prisma.salesInvoice.count(),
  ]);

  if (counts.some((count) => count > 0)) {
    throw new Error(
      "حداقل یکی از جدول‌ها اطلاعات دارد؛ انتقال متوقف شد تا داده‌ها تکراری نشوند."
    );
  }

  // تبدیل نام فیلدهای JSON به مدل دیتابیس
const productData = products.map((item) => {
  const { Status, ...product } = item;

  return {
    ...product,
    status: Status ?? item.status ?? "موجود",
  };
});

  console.log("شروع انتقال اطلاعات...");

  await prisma.$transaction(async (tx) => {
    await tx.category.createMany({ data: categories });

    await tx.product.createMany({ data: productData });

    await tx.supplier.createMany({ data: suppliers });

    await tx.customer.createMany({ data: customers });

    await tx.inventoryItem.createMany({ data: inventory });

    await tx.stockMovement.createMany({
      data: stockMovements,
    });

    await tx.purchase.createMany({ data: purchases });

    await tx.salesInvoice.createMany({ data: sales });
  });

  console.log("انتقال اطلاعات با موفقیت انجام شد.");

  const results = await Promise.all([
    ["دسته‌بندی‌ها", prisma.category.count()],
    ["محصولات", prisma.product.count()],
    ["تأمین‌کنندگان", prisma.supplier.count()],
    ["مشتریان", prisma.customer.count()],
    ["موجودی انبار", prisma.inventoryItem.count()],
    ["گردش انبار", prisma.stockMovement.count()],
    ["خریدها", prisma.purchase.count()],
    ["فاکتورهای فروش", prisma.salesInvoice.count()],
  ].map(async ([name, countPromise]) => ({
    name,
    count: await countPromise,
  })));

  for (const result of results) {
    console.log(`${result.name}: ${result.count}`);
  }
}

main()
  .catch((error) => {
    console.error("انتقال انجام نشد:");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
