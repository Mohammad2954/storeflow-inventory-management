import React from "react";

function VolumeOperations({
  text,
  val,
  setVal,
  changeValueProductInInventory,
}) {
  return (
    <div className=" w-72 flex items-center gap-2 bg-white shadow-sm rounded-lg  border border-gray-300 py-2 px-1 absolute left-33">
      <span className="text-[12px] pb-1">چه مقدار {text} :</span>
      <input
        value={val}
        onChange={(event) => {
          setVal(event.target.value);
        }}
        type="text"
        className="outline-none border border-gray-300 rounded-sm py-1 px-2 text-[10px] "
        placeholder="مقدار مورد نظر ..."
      />
      <button
        onClick={() => {
          changeValueProductInInventory(text === "افزایش" ? "in" : "out");
        }}
        className="bg-accent-hover text-white rounded-sm cursor-pointer text-[13px] font-bold px-2 py-1"
      >
        ثبت
      </button>
    </div>
  );
}

export default VolumeOperations;
