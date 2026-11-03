import { clsx } from "clsx";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Counter({ countPage, param, changePage }) {
  return (
    <div className="">
      <div className="flex items-center flex-row-reverse gap-2">
        <div
          onClick={() => {
            if (countPage.includes(param - 1)) {
              changePage(param - 1);
            }
          }}
          className=" hover:bg-accent-hover hover:text-white cursor-pointer hover:border-none transition duration-300 flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200"
        >
          <FaAngleLeft />
        </div>

        {countPage.map((item) => (
          <div
            onClick={() => {
              changePage(item);
            }}
            key={item}
            className={clsx(
              " hover:bg-accent-hover hover:text-white cursor-pointer hover:border-none transition duration-300 flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200 ",
              param === item ? "active" : null,
            )}
          >
            {item}
          </div>
        ))}
        <div
          onClick={() => {
            if (countPage.includes(param + 1)) {
              changePage(param + 1);
            }
          }}
          className=" hover:bg-accent-hover hover:text-white cursor-pointer hover:border-none transition duration-300 flex items-center justify-center p-2 shadow-sm w-8 h-8 text-gray-700 dark:text-white rounded-sm border border-gray-200"
        >
          <FaAngleRight />
        </div>
      </div>
    </div>
  );
}

export default Counter;
