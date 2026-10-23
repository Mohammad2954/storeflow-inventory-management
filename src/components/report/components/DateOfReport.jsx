import React, { useState } from "react";

function DateOfReport() {
  const [firstValINput, setFirstValINput] = useState("01");
  const [secondValINput, setSecondValINput] = useState("04");
  const [thirdValINput, setThirdValINput] = useState("1401");
  const [firstValINput2, setFirstValINput2] = useState("01");
  const [secondValINput2, setSecondValINput2] = useState("04");
  const [thirdValINput2, setThirdValINput2] = useState("1401");
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-300">
        مشاهده وتحلیل اطلاعات فروشگاه در بازه های زمانی مختلف
      </span>
      <div className="flex items-center gap-2 border border-gray-300 shadow-sm rounded-lg px-4 py-2">
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-5 outline-none"
            max="2"
            placeholder="21"
            value={firstValINput}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 31) {
                setFirstValINput(event.target.value);
              }
            }}
          />
          /
          <input
            type="number"
            className="w-5 outline-none"
            max="2"
            placeholder="05"
            value={secondValINput}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 13) {
                setSecondValINput(event.target.value);
              }
            }}
          />
          /
          <input
            type="number"
            className="w-8 outline-none"
            max="4"
            placeholder="1404"
            value={thirdValINput}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 9999) {
                setThirdValINput(event.target.value);
              }
            }}
          />
        </div>
        -
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-5 outline-none"
            max="2"
            placeholder="21"
            value={firstValINput2}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 31) {
                setFirstValINput2(event.target.value);
              }
            }}
          />
          /
          <input
            type="number"
            className="w-5 outline-none"
            max="2"
            placeholder="05"
            value={secondValINput2}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 13) {
                setSecondValINput2(event.target.value);
              }
            }}
          />
          /
          <input
            type="number"
            className="w-8 outline-none"
            max="4"
            placeholder="1404"
            value={thirdValINput2}
            onChange={(event) => {
              if (event.target.value >= 0 && event.target.value < 9999) {
                setThirdValINput2(event.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DateOfReport;
