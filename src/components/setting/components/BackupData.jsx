import React from "react";
import ToggleButton from "../../../feature/components/ToggleButton";

function BackupData() {
  return (
    <div className="border border-gray-300 shadow-sm py-4 px-6 rounded-lg h-fit -mt-[326px]">
      <div className="pb-3 ">
        <h4 className="font-bold text-xl">پشتیبان گیری از داده ها</h4>
        <span className="text-sm text-gray-400 pr-3">
          نگهداری امن اطلاعات فروشگاه و انبار
        </span>
      </div>
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div>
          <h4 className=" text-lg">پشتیبان گیری خودکار</h4>
          <span className="text-sm text-gray-400 pr-3">هر شب ساعت 02:00</span>
        </div>
        <ToggleButton />
      </div>
      <div className="flex items-center justify-between py-4">
        <span className="text-sm text-gray-400">اخرین نسخه پشتیبان</span>
        <span className="text-sm text-gray-400">1402/07/20</span>
      </div>
      <button class="w-full py-1.5 pb-2 text-center text-accent border border-accent rounded-lg cursor-pointer mt-2 font-bold">
        دریافت نسخه پشتیبان
      </button>
    </div>
  );
}

export default BackupData;
