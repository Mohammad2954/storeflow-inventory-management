import React from "react";

function SystemInfo() {
  return (
    <div className="border border-gray-300 shadow-sm py-4 px-6 rounded-lg h-fit -mt-[295px]">
      <div className="pb-3 ">
        <h4 className="font-bold text-xl">اطلاعات سیستم</h4>
      </div>
      <div className="flex items-center justify-between py-4 border-b border-gray-300">
        <span className="text-sm text-gray-400">نسخه نرم افزار</span>
        <span className="text-sm text-gray-400">1.0.0</span>
      </div>
      <div className="flex items-center justify-between py-4 border-b border-gray-300">
        <span className="text-sm text-gray-400">اخرین بروزرسانی</span>
        <span className="text-sm text-gray-400">1402/07/20</span>
      </div>
      <div className="flex items-center justify-between py-4 ">
        <span className="text-sm text-gray-400">وضعیت سرور</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-accent-hover rounded-full mt-3"></span>
          <span className="text-accent-hover text-sm pt-2">متصل</span>
        </div>
      </div>
      <button class="w-full py-1.5 pb-2 text-center text-accent border border-accent rounded-lg cursor-pointer mt-2 font-bold">
        بررسی بروزرسانی
      </button>
    </div>
  );
}

export default SystemInfo;
