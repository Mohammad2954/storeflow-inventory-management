import clsx from "clsx";
import React from "react";
import { Link } from "react-router";

function ShortcutItems({ title, icon: Icon, path, color, bgColor }) {
  return (
    <Link to={path}>
      <div
        className={clsx(
          "flex items-center justify-center rounded-lg py-4 bg-gray-100 dark:bg-gray-700 border border-gray-200 shadow-sm",
        )}
      >
        <div className="flex flex-col items-center ">
          <Icon className={"size-5 text-accent-hover"} />
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default ShortcutItems;
