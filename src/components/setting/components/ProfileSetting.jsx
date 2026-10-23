import React from "react";

function ProfileSetting() {
  return (
    <div className="border border-gray-300 shadow-sm py-4 px-6 rounded-lg">
      <div>
        <h4 className="font-bold text-xl">حساب کاربری</h4>
        <span className="text-sm text-gray-400 pr-3">
          اطلاعات شخصی و امنیت حساب
        </span>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 py-6">
        <img
          className="w-[90px] h-[90px] rounded-full border border-white dark:border-gray-400"
          src="/topbar/prof.jpg"
          alt=""
        />
        <button className="text-accent border border-accent px-8 py-1.5 rounded-lg pb-2 cursor-pointer">
          تغییر تصویر
        </button>
      </div>
      <div>
        <span className="text-gray-400 text-sm font-bold pr-2 ">
          نام و نام خانوادگی
        </span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"محمد جواد"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">
          نام کاربری
        </span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"mohammad"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">رمز عبور</span>
        <input
          type="password"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"2345845"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">ایمیل</span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"mohammad@gmail.com"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">
          شماره تلفن
        </span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"09131231234"}
        />
        <button className="w-full py-1.5 pb-2 text-center text-accent border border-accent rounded-lg cursor-pointer mt-2 font-bold">
          تغییر رمز عبور
        </button>
      </div>
    </div>
  );
}

export default ProfileSetting;
