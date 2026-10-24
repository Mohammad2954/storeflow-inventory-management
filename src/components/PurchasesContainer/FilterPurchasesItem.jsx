import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";
import { TbFilterMinus } from "react-icons/tb";
import DateOfReport from "../report/components/DateOfReport";
import FindDate from "../../feature/components/FindDate";

function FilterPurchasesItem() {
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center relative w-xl">
        <CiSearch className=" absolute right-0 z-10 size-5" />
        <input
          className=" border border-gray-300 outline-none py-2 px-4 rounded-xl text-sm pr-6 w-full"
          type="text"
          placeholder="جستجو نام یا کد ..."
        />
      </div>
      <div className="flex items-center gap-4 w-full pr-4">
        <div className="flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span>همه وضعیت ها</span>
          <FaAngleDown />
        </div>
        <div className="flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span>تامین کننده</span>
          <FaAngleDown />
        </div>
        <div>{/* <FindDate /> */}</div>
      </div>
      <button className="flex items-center gap-4 text-sm border bg-gray-200 border-gray-300 dark:bg-gray-800 shadow-sm px-4 py-2 rounded-lg w-72">
        <TbFilterMinus />
        پاک کردن فیلتر ها
      </button>
    </div>
  );
}

export default FilterPurchasesItem;
