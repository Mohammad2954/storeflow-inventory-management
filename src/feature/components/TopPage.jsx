import React from "react";
import { IoMdAdd } from "react-icons/io";

function TopPage({ name, btn, func }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-2xl font-bold">{name}</span>
      {btn ? (
        <div
          className="cursor-pointer bg-green-700 transition duration-300 hover:bg-green-600 px-10 py-2 flex items-center justify-center text-white  font-bold gap-2 rounded-sm"
          onClick={() => {
            func();
          }}
        >
          <IoMdAdd className="size-6" />
          <span className="mb-[5px] text-sm">{btn}</span>
        </div>
      ) : null}
    </div>
  );
}

export default TopPage;
