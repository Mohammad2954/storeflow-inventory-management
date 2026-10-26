
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL در فایل .env تعریف نشده است."
  );
}

let databaseUrl;

try {
  databaseUrl = new URL(connectionString);
} catch {
  throw new Error(
    "فرمت DATABASE_URL معتبر نیست."
  );
}

const databaseName = databaseUrl.pathname.replace(/^\/+/, "");

if (!databaseName) {
  throw new Error(
    "نام دیتابیس در DATABASE_URL مشخص نشده است."
  );
}

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseName,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
