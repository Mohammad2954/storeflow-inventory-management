import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import { categorySales } from "../../../data/reportData.js";

function CategorySalesChart() {
  const totalSales = categorySales.reduce(
    (total, item) => total + item.sales,
    0,
  );

  const formatPrice = (value) => new Intl.NumberFormat("fa-IR").format(value);

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:text-white p-5 shadow-sm">
      {/* عنوان */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          فروش بر اساس دسته‌بندی
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-white">
          سهم هر دسته از مجموع فروش
        </p>
      </div>

      {/* نمودار و اطلاعات دسته‌ها */}
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {/* راهنمای دسته‌بندی‌ها */}
        <div className="w-full flex-1 space-y-4">
          {categorySales.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-700 dark:text-white">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400 dark:text-white">
                    {formatPrice(item.sales)} تومان
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-sm font-bold text-gray-700 dark:text-white">
                {new Intl.NumberFormat("fa-IR").format(item.percentage)}%
              </span>
            </div>
          ))}
        </div>

        {/* نمودار دوناتی */}
        <div className="relative h-64 w-full min-w-0 sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySales}
                dataKey="sales"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {categorySales.map((item) => (
                  <Cell key={item.id} fill={item.color} />
                ))}
              </Pie>

              <Tooltip
                wrapperStyle={{ zIndex: 10 }}
                formatter={(value) => [
                  `${formatPrice(value)} تومان`,
                  "مبلغ فروش",
                ]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "12px",
                  direction: "rtl",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* اطلاعات وسط دونات */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-white">
              مجموع فروش
            </span>

            <span className="mt-1 text-xl font-bold text-gray-800 dark:text-white">
              {formatPrice(totalSales)}
            </span>

            <span className="text-xs text-gray-400 dark:text-white">تومان</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySalesChart;
