import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FiCalendar,
  FiTrendingUp,
  FiShoppingCart,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";

const salesData = [
  { day: "شنبه", sales: 1.8 },
  { day: "یکشنبه", sales: 3.2 },
  { day: "دوشنبه", sales: 5.4 },
  { day: "سه‌شنبه", sales: 6.1 },
  { day: "چهارشنبه", sales: 6.7 },
  { day: "پنجشنبه", sales: 8.9 },
  { day: "جمعه", sales: 7.5 },
  { day: "شنبه", sales: 9.8 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
      <p className="mb-1 text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-green-700">{payload[0].value}M</p>
      <p className="text-sm text-gray-500">فروش</p>
    </div>
  );
}
function LineChart() {
  return (
    <section className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
          فروش ۷ روز اخیر
        </h2>

        <button
          type="button"
          className=" cursor-pointer flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 transition hover:border-green-300 hover:bg-green-50"
        >
          <FiCalendar className="text-green-600" />
          هفته اخیر
        </button>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full sm:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={salesData}
            margin={{
              top: 15,
              right: 8,
              left: 8,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" vertical />

            <XAxis
              dataKey="day"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={false}
              interval={0}
              tickMargin={12}
            />

            <YAxis
              domain={[0, 15]}
              ticks={[0, 5, 10, 15]}
              tickFormatter={(value) => `${value}M`}
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={45}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#16a34a",
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#16a34a"
              strokeWidth={3}
              fill="url(#salesGradient)"
              activeDot={{
                r: 6,
                fill: "#16a34a",
                stroke: "#ffffff",
                strokeWidth: 3,
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
    </section>
  );
}

export default LineChart;
