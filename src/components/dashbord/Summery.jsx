import React from "react";
import {
  FiShoppingCart,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

const summaryItems = [
  {
    title: "بیشترین فروش",
    value: "9.8M",
    description: "شنبه",
    icon: FiShoppingCart,
  },
  {
    title: "میانگین فروش روزانه",
    value: "6.2M",
    icon: FiCalendar,
  },
  {
    title: "مجموع فروش هفته",
    value: "43.5M",
    icon: FiDollarSign,
  },
  {
    title: "درصد رشد فروش",
    value: "+45%",
    icon: FiTrendingUp,
  },
];

function Summery() {
  return (
    <div>
      {" "}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 border border-gray-100 bg-white p-4 shadow-sm ">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50/70 p-4 transition hover:bg-green-50"
            >
              <div className="flex  shrink-0 items-center justify-center rounded-xl bg-white text-xl text-green-600 shadow-sm">
                <Icon />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">{item.title}</p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    item.value.startsWith("+")
                      ? "text-green-600"
                      : "text-gray-900"
                  }`}
                >
                  {item.value}
                </p>

                {item.description && (
                  <p className="mt-0.5 text-xs text-gray-500">
                    ({item.description})
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Summery;
