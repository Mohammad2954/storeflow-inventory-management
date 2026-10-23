import React from "react";

function StoreInfo() {
  return (
    <div className="border border-gray-300 shadow-sm py-4 px-6 rounded-lg h-fit">
      <div>
        <h4 className="font-bold text-xl">اطلاعات فروشگاه</h4>
      </div>
      <div>
        <span className="text-gray-400 text-sm font-bold pr-2 ">
          نام فروشگاه
        </span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"فروشگاه"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">
          شماره تماس
        </span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"0913465254"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">ایمیل</span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"mohammad@gmail.com"}
        />
        <span className="text-gray-400 text-sm font-bold pr-2 ">ادرس</span>
        <input
          type="text"
          className="w-full outline-none border border-gray-400 rounded-lg pr-3 py-1.5 mt-2 mb-3"
          value={"xxxxxxxxxxxxxxxxx-xxxxxxxxxxx"}
        />
        <button className="w-full py-1.5 pb-2 text-center bg-accent border text-white rounded-lg cursor-pointer mt-2 font-bold">
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default StoreInfo;
