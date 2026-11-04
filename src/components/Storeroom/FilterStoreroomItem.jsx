import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa6";
import { TbFilterMinus } from "react-icons/tb";

function FilterStoreroomItem({
  status,
  category,
  searchInput,
  setSearchInput,
  state,
  dispatch,
  inven,
}) {
  const [statusShow, setstatusShow] = useState(false);
  const [categoryShow, setcategoryShow] = useState(false);
  const [inventoryShow, setinventoryShow] = useState(false);

  return (
    <div className="flex items-center p-4">
      <div className="flex items-center relative w-xl">
        <CiSearch className=" absolute right-0 size-5" />
        <input
          value={state.searchInput}
          onChange={(event) => {
            dispatch({ type: "change search", value: event.target.value });
          }}
          className=" border border-gray-300 outline-none py-2 px-4 rounded-xl text-sm pr-6 w-full"
          type="text"
          placeholder="جستجو نام یا کد ..."
        />
      </div>
      <div className="flex items-center gap-4 w-full pr-4">
        <div className=" relative flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span
            onClick={() => {
              setstatusShow(!statusShow);
            }}
            className="cursor-pointer"
          >
            {state.filterStatus}
          </span>
          <FaAngleDown />
          {statusShow ? (
            <ul className=" overflow-hidden absolute border border-gray-300 top-10 z-100 bg-white rounded-sm right-0 shadow-sm">
              {status.map((element, index) => {
                return (
                  <li
                    onClick={() => {
                      dispatch({ type: "change status", value: element });
                      setstatusShow(!statusShow);
                    }}
                    key={index + 1}
                    className="w-26 truncate  py-2 border-b border-gray-300 pr-2 text-right cursor-pointer transition duration-300 hover:text-white hover:bg-accent-hover"
                  >
                    {element}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>

        <div className="cursor-pointer relative flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span
            onClick={() => {
              setcategoryShow(!categoryShow);
            }}
          >
            {state.filterCategory}
          </span>
          <FaAngleDown />
          {categoryShow ? (
            <ul className=" overflow-hidden absolute border border-gray-300 top-10 z-100 bg-white rounded-sm right-0 shadow-sm">
              {category.map((element, index) => {
                return (
                  <li
                    onClick={() => {
                      console.log(element);

                      dispatch({ type: "change category", value: element });
                      setcategoryShow(!categoryShow);
                    }}
                    key={index + 1}
                    className="w-26 truncate  py-2 border-b border-gray-300 pr-2 text-right cursor-pointer transition duration-300 hover:text-white hover:bg-accent-hover"
                  >
                    {element}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <div className="cursor-pointer relative flex items-center gap-4 text-sm border border-gray-300 shadow-sm px-4 py-2 rounded-lg">
          <span
            onClick={() => {
              setinventoryShow(!inventoryShow);
            }}
          >
            {state.filterInventory}
          </span>
          <FaAngleDown />
          {inventoryShow ? (
            <ul className=" overflow-hidden absolute border border-gray-300 top-10 z-100 bg-white rounded-sm right-0 shadow-sm">
              {inven.slice(0, -1).map((element, index) => {
                return (
                  <li
                    onClick={() => {
                      dispatch({ type: "change inventory", value: element });
                      setinventoryShow(!inventoryShow);
                    }}
                    key={index + 1}
                    className="w-26 truncate  py-2 border-b border-gray-300 pr-2 text-right cursor-pointer transition duration-300 hover:text-white hover:bg-accent-hover"
                  >
                    {element}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
      <button
        onClick={() => {
          dispatch({ type: "clear" });
        }}
        className=" cursor-pointer flex items-center gap-4 text-sm border bg-gray-200 border-gray-300 dark:bg-gray-800 shadow-sm px-4 py-2 rounded-lg w-72"
      >
        <TbFilterMinus />
        پاک کردن فیلتر ها
      </button>
    </div>
  );
}

export default FilterStoreroomItem;
