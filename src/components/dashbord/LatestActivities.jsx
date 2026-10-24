import React from "react";
import { Link } from "react-router";
import clsx from "clsx";
import { recentActivities } from "../../data/recentActivities .js";

function LatestActivities() {
  return (
    <div className="rounded-lg border border-gray-300 shadow-sm p-4 h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          آخرین فعالیت‌ها
        </h2>

        <span className="text-xs text-gray-400">فعالیت‌های اخیر</span>
      </div>

      <div className="flex flex-col">
        {recentActivities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b border-gray-100 py-3 last:border-b-0"
            >
              <div
                className={clsx(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  item.bg,
                  item.color,
                )}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-700">
                  {item.title}
                </p>

                <p className="mt-1 truncate text-xs text-gray-400">
                  {item.description}
                </p>
              </div>

              <span className="shrink-0 text-xs text-gray-400">
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LatestActivities;
