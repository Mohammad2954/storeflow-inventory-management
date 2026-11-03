import { clsx } from "clsx";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Counter({ countPage, param, changePage }) {
  const getPagination = () => {
    if (countPage.length <= 7) {
      return countPage;
    }

    if (param <= 4) {
      return [1, 2, 3, 4, 5, "...", countPage.length];
    }

    if (param >= countPage.length - 3) {
      return [
        1,
        "...",
        countPage.length - 4,
        countPage.length - 3,
        countPage.length - 2,
        countPage.length - 1,
        countPage.length,
      ];
    }

    return [1, "...", param - 1, param, param + 1, "...", countPage.length];
  };
  console.log(getPagination());

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

        {getPagination().map((item) => {
          if (typeof item === "number") {
            return (
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
            );
          } else {
            return <div>{item}</div>;
          }
        })}
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
