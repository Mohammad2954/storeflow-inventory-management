import React from "react";

function TopSlide({ name, btn }) {
  return (
    <div className="flex w-full items-center justify-between">
      <span>{name}</span>
      <div className="bg-accent px-10 py-2 flex items-center justify-center text-white text-sm font-bold">
        {btn}
      </div>
    </div>
  );
}

export default TopSlide;
