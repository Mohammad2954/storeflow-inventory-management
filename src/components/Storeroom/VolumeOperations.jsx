import React from "react";

function VolumeOperations({ text, val, setVal }) {
  return (
    <div className="flex items-center gap-2 bg-white shadow-sm rounded-lg  border border-gray-300 py-2 px-1">
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
    </div>
  );
}

export default VolumeOperations;
