import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { salesTrend } from "../../../data/salesTrend.js";

function LineChartReports() {
  const formatPrice = (value) => new Intl.NumberFormat("fa-IR").format(value);

  return (
    <div className="w-full rounded-2xl border border-gray-200 dark:text-white p-5 shadow-sm">
      {/* عنوان نمودار */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            روند فروش
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-white">
            میزان فروش در ۷ روز گذشته
          </p>
        </div>

        <span className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium  text-green-700">
          هفتگی
        </span>
      </div>

      {/* نمودار خطی */}
      <div className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesTrend}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />

                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#616161" }}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
            />

            <YAxis
              orientation="left"
              tickFormatter={(value) => `${value / 1000000}M`}
              tick={{ fontSize: 11, fill: "#616161" }}
              tickLine={false}
              axisLine={false}
              width={45}
              domain={[0, "auto"]}
            />

            <Tooltip
              formatter={(value) => [
                `${formatPrice(value)} تومان`,
                "مبلغ فروش",
              ]}
              labelFormatter={(label) => `تاریخ: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
                direction: "rtl",
                color: "black",
              }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#16a34a"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              activeDot={{
                r: 6,
                fill: "#16a34a",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              dot={{
                r: 4,
                fill: "#16a34a",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default LineChartReports;
