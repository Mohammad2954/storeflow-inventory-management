import clsx from "clsx";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

function CardItems({ title, value, link, path, icon: Icon, color, bg }) {
  return (
    <div className="p-2 rounded-lg border- border-gray-300 shadow-sm">
      <div className={clsx("flex justify-between rounded-lg p-2", bg, color)}>
        <div className="flex flex-col gap-1">
          <span className="font-bold">{title}</span>
          <span className="text-black font-bold">{value}</span>
          <div className="flex items-center gap-2">
            <span className="pb-1">{link}</span>
            <FaArrowLeftLong />
          </div>
        </div>
        <div className="p-2 pl-0 rounded-lg ">
          <Icon className="size-5 w-16" />
        </div>
      </div>
    </div>
  );
}

export default CardItems;
