import clsx from "clsx";
import React from "react";
import { Link } from "react-router";

function ShortcutItems({ title, icon: Icon, path, color, bgColor }) {
  return (
    <Link to={path}>
      <div
        className={clsx(
          bgColor,
          color,
          "flex items-center justify-center rounded-3xl py-8 ",
          `border border-${color}`,
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <Icon className={"size-10"} />
          <span>{title}</span>
        </div>
      </div>
    </Link>
  );
}

export default ShortcutItems;
