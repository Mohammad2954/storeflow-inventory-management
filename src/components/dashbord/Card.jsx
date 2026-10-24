import clsx from "clsx";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";

function Card({ title, value, link, path, icon, color, bg }) {
  const Icon = icon;

  return (
    <div className="p-2 col-span-4 border border-gray-300 rounded-lg shadow-sm ">
      <div className={clsx(bg, "w-full rounded-lg p-4 ")}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className={color} size={20} />}
          <span className={clsx("text-sm", color)}>{title}</span>
        </div>

        <span className={clsx("mt-2 block text-xl font-bold", color)}>
          {value}
        </span>

        <Link
          to={path}
          className={clsx(
            "mt-2 text-xs flex items-center gap-2 underline",
            color,
          )}
        >
          {link}
          <FaArrowLeft className="mt-1" />
        </Link>
      </div>
    </div>
  );
}

export default Card;
