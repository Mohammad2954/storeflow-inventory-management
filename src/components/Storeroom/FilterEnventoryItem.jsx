import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { TbFilterMinus } from "react-icons/tb";

function FilterEnventoryItem() {
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center relative w-xl">
        <CiSearch className=" absolute right-0 z-10 size-5" />
        <input
          className=" border border-gray-300 outline-none py-2 px-4 rounded-xl text-sm pr-6 w-full"
          type="text"
          placeholder="جستجو در محصولات ..."
        />
      </div>
      <div className="flex items-center gap-4 w-full pr-4">
        <div className="flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span>همه وضعیت ها</span>
          <FaAngleDown />
        </div>
        <div className="flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span>همه انبار ها</span>
          <FaAngleDown />
        </div>
        <div className="flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span>دسته بندی ها</span>
          <FaAngleDown />
        </div>
      </div>
      <button className="flex items-center gap-4 text-sm border bg-gray-200 border-gray-300 shadow-sm px-4 py-2 rounded-lg w-72">
        <TbFilterMinus />
        پاک کردن فیلتر ها
      </button>
    </div>
  );
}

export default FilterEnventoryItem;
