import React from "react";
import ToggleButton from "../../../feature/components/ToggleButton";

function NotificationSetting() {
  return (
    <div className="border border-gray-300 shadow-sm py-4 px-6 rounded-lg h-fit">
      <div className="pb-3 border-b border-gray-300">
        <h4 className="font-bold text-xl">اطلاع رسانی ها</h4>
        <span className="text-sm text-gray-400 pr-3">
          مدیریت اعلان ها و هشدار های سیستم
        </span>
      </div>
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div>
          <h4 className=" text-lg">اعلان فروش جدید</h4>
          <span className="text-sm text-gray-400 pr-3">
            دریافت اعلان هنگام ثبت فروش جدید
          </span>
        </div>
        <ToggleButton />
      </div>
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div>
          <h4 className=" text-lg">هشدار مومجودی پایین</h4>
          <span className="text-sm text-gray-400 pr-3">
            اعلان هنگام کاهش موجودی کالا ها
          </span>
        </div>
        <ToggleButton />
      </div>
      <div className="flex items-center justify-between py-3 border-b border-gray-300">
        <div>
          <h4 className=" text-lg">یاد اوری تاریخ های مهم</h4>
          <span className="text-sm text-gray-400 pr-3">
            یاد اوری تاریخ انقضا و رویداد های مهم
          </span>
        </div>
        <ToggleButton />
      </div>
      <div className="flex items-center justify-between py-3 ">
        <div>
          <h4 className=" text-lg">بروزرسانی سیستم</h4>
          <span className="text-sm text-gray-400 pr-3">
            دریافت اطلاعیه های نسخه های جدید
          </span>
        </div>
        <ToggleButton />
      </div>
    </div>
  );
}

export default NotificationSetting;
