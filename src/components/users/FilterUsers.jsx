import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { TbFilterMinus } from "react-icons/tb";

function FilterUsers({
  filterData,
  setFilterData,
  inputVal,
  setInputVal,
  clearFilter,
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center p-4">
      <div className="flex items-center relative w-xl">
        <CiSearch className=" absolute right-0 z-10 size-5" />
        <input
          value={inputVal}
          onChange={(event) => {
            setInputVal(event.target.value);
          }}
          className=" border border-gray-300 outline-none py-2 px-4 rounded-xl text-sm pr-6 w-full"
          type="text"
          placeholder="جستجو نام کد یا شماره تماس  ..."
        />
      </div>
      <div className="flex items-center gap-4 w-full pr-4">
        <div
          onClick={() => {
            setShow(!show);
          }}
          className="flex items-center gap-1 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg cursor-pointer relative "
        >
          <span>مرتب سازی بر اساس</span>
          <span>{filterData}</span>
          <FaAngleDown />
          {show ? (
            <ul className="bg-white rounded-sm border border-gray-400 shadow-sm absolute right-0 top-10 w-32 overflow-hidden">
              <li
                onClick={() => {
                  setFilterData("بیشترین خرید");
                  setShow(!show);
                }}
                className="py-1 hover:bg-accent-hover hover:text-white pr-2 transition duration-300 cursor-pointer"
              >
                بیشترین خرید
              </li>
              <li
                onClick={() => {
                  setFilterData("کمترین خرید");
                  setShow(!show);
                }}
                className="py-1 hover:bg-accent-hover hover:text-white pr-2 transition duration-300 cursor-pointer"
              >
                کمترین خرید
              </li>
              <li
                onClick={() => {
                  setFilterData("بیشترین بدهی");
                  setShow(!show);
                }}
                className="py-1 hover:bg-accent-hover hover:text-white pr-2 transition duration-300 cursor-pointer"
              >
                بیشترین بدهی
              </li>
              <li
                onClick={() => {
                  setFilterData("نوع مشتری");
                  setShow(!show);
                }}
                className="py-1 hover:bg-accent-hover hover:text-white pr-2 transition duration-300 cursor-pointer"
              >
                نوع مشتری
              </li>
            </ul>
          ) : null}
        </div>
      </div>
      <button
        onClick={() => {
          clearFilter();
        }}
        className=" cursor-pointer flex items-center gap-4 text-sm border bg-gray-200 border-gray-300 dark:bg-gray-800 shadow-sm px-4 py-2 rounded-lg w-72 "
      >
        <TbFilterMinus />
        پاک کردن فیلتر ها
      </button>
    </div>
  );
}

export default FilterUsers;
