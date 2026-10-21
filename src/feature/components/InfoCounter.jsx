import React from "react";

function InfoCounter({ first, second, third }) {
  return (
    <div>
      <span className="flex items-center gap-1 text-gray-400 ">
        <span>نمایش</span>
        <span>{first}</span>
        <span>تا</span>
        <span>{second}</span>
        <span>از</span>
        <span>{third}</span>
        <span>مورد</span>
      </span>
    </div>
  );
}

export default InfoCounter;
