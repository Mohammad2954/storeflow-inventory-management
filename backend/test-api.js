
require("dotenv").config();

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const app = express();
const PORT = 3001;

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

app.get("/api/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { id: "asc" },
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "خطا در دریافت محصولات",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Test API running at http://localhost:${PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
