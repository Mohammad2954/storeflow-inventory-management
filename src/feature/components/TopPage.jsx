import React from "react";
import { IoMdAdd } from "react-icons/io";

function TopPage({ name, btn }) {
  return (
    <div className="flex w-full items-center justify-between px-16 mt-4">
      <span className="text-2xl font-bold">{name}</span>
      {btn ? (
        <div className="cursor-pointer bg-green-700 transition duration-300 hover:bg-green-600 px-10 py-2 flex items-center justify-center text-white  font-bold gap-2 rounded-sm">
          <IoMdAdd className="size-6" />
          <span className="mb-1 text-sm">{btn}</span>
        </div>
      ) : null}
    </div>
  );
}

export default TopPage;
