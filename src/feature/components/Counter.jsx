import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Counter() {
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200">
          <FaAngleRight />
        </div>
        <div className="flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200 font-bold active">
          1
        </div>
        <div className="flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200 font-bold">
          2
        </div>
        <div className="flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200 font-bold">
          3
        </div>
        <div className="flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200">
          <FaAngleLeft />
        </div>
      </div>
    </div>
  );
}

export default Counter;
