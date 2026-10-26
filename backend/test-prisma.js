
require("dotenv").config();

const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

async function main() {
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

  try {
    await prisma.$connect();

    const count = await prisma.product.count();

    console.log("اتصال به MySQL موفق بود!");
    console.log("تعداد محصولات:", count);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("خطا در اتصال به دیتابیس:");
  console.error(error);
  process.exitCode = 1;
});
