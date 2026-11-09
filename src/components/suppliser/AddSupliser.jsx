import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { CiSaveDown2 } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

function AddSupliser({ func }) {
  return (
    <div className="bg-black/15 backdrop-blur-sm w-full h-full fixed left-0 right-0 bottom-0 top-0">
      <div className="w-2xl bg-white dark:bg-gray-800 z-1000 py-4 rounded-xl shadow-sm m-8 absolute left-1/5 -top-6 backdrop-blur-2xl ">
        <div className="flex items-center justify-between border-b px-4 pb-3 mb-2 border-gray-200">
          <div className="flex items-center gap-2">
            <AiFillProduct className="text-accent-hover size-6" />
            <span className="font-bold">افزودن محصول</span>
          </div>
          <IoClose
            className="text-red-800 cursor-pointer size-5"
            onClick={() => {
              func();
            }}
          />
        </div>
        <span className="font-bold pr-3 ">اطلاعات اصلی</span>
        <div className="grid grid-cols-2 pt-4">
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              نام تامین کننده
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="نام تامین کننده را وارد کنید"
            />
          </div>

          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              تلفن ثابت
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="تلفن ثابت را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              شماره موبایل
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="شماره موبایل را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              نام شخص رابط
            </label>
            <input
              // value={state.phone}
              // onChange={(event) => {
              //   dispatch({ type: "phone", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="نام شخص رابط را وارد کنید "
            />
          </div>

          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              ایمیل
            </label>
            <input
              //   value={state.email}
              //   onChange={(event) => {
              //     dispatch({ type: "email", value: event.target.value });
              //   }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="ایمیل را وارد کنید"
            />
          </div>
        </div>
        <span className="font-bold pr-3 ">اطلاعات مکانی</span>
        <div className="grid grid-cols-2 pt-4">
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              استان
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="استان را وارد کنید"
            />
          </div>

          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              شهر
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="شهر را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              آدرس
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="آدرس را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              کد پستی
            </label>
            <input
              // value={state.phone}
              // onChange={(event) => {
              //   dispatch({ type: "phone", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="کد پستی را وارد کنید"
            />
          </div>
        </div>
        <span className="font-bold pr-3 ">اطلاعات تجاری</span>
        <div className="grid grid-cols-2 pt-4">
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              دسته بندی تامین کننده
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="دسته بندی تامین کننده را وارد کنید"
            />
          </div>

          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              مهلت پرداخت
            </label>
            <input
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="مهلت پرداخت را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3">
            <label className="text-sm font-bold" htmlFor="">
              توضیحات
            </label>
            <textarea
              // value={state.name}
              // onChange={(event) => {
              //   dispatch({ type: "name", value: event.target.value });
              // }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="توضیحات را وارد کنید"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4 pt-4">
          <button
            // onClick={() => {
            //   sendForm();
            // }}
            className="w-full py-3 border border-gray-300 shadow-sm rounded-lg cursor-pointer hover:bg-accent-hover font-bold hover:text-white transition duration-300 flex items-center justify-center gap-2"
          >
            اضافه کردن مشتری
            <CiSaveDown2 className=" hover:text-white font-bold mt-1 size-5" />
          </button>
          <button
            onClick={() => {
              func();
            }}
            className="w-full py-3 border border-gray-300 shadow-sm rounded-lg cursor-pointer hover:bg-red-700 font-bold hover:text-white transition duration-300"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSupliser;
