import React from "react";
import { FaArrowLeft, FaRegClock } from "react-icons/fa6";
import { purchases } from "../../data/purchases";
import LastBuyItem from "./LastBuyItem";

function LastBuy() {
  return (
    <div className="shadow-sm rounded-lg border border-gray-300 p-4 mt-4 w-2xl">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-300">
        <FaRegClock className="size-5" />
        <span className="font-bold text-lg text-gray-500">خرید های اخیر</span>
      </div>
      {purchases.map((e) => {
        return <LastBuyItem key={e.id} {...e} />;
      })}
      <div className="text-accent-hover underline flex items-center justify-end gap-3 pt-3 pl-4 pb-2">
        <span className="text-sm pb-1">مشاهده همه</span>
        <FaArrowLeft />
      </div>
    </div>
  );
}

export default LastBuy;
