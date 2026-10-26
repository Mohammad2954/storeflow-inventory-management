
require("dotenv").config();

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

async function main() {
  const products = await prisma.product.findMany();

  console.log("تعداد محصولات:", products.length);
  console.log(products);
}

main()
  .catch((error) => {
    console.error("خطا در خواندن محصولات:");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  