import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import FindDate from "../../../feature/components/FindDate";

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
      <FindDate />
    </div>
  );
}

export default DateOfReport;
