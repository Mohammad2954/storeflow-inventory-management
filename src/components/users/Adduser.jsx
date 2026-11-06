import React from "react";
import { AiFillProduct } from "react-icons/ai";
import { CiSaveDown2 } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import useMutation from "../../hooks/useMutation";
import toast from "react-hot-toast";

function Adduser({ func, dispatch, state, sendForm }) {
  return (
    <div className="bg-black/15 backdrop-blur-sm w-full h-full fixed left-0 right-0 bottom-0 top-0">
      <div className="w-2xl bg-white dark:bg-gray-800 z-1000 py-4 rounded-xl shadow-sm m-8 absolute left-1/5 top-6 backdrop-blur-2xl ">
        <div className="flex items-center justify-between border-b px-4 pb-3 border-gray-200">
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
        <div className="grid grid-cols-2">
          <div className="flex flex-col justify-around pb-4">
            <div className="flex flex-col gap-1.5 px-3">
              <label className="text-sm font-bold" htmlFor="">
                نام مشتری
              </label>
              <input
                value={state.name}
                onChange={(event) => {
                  dispatch({ type: "name", value: event.target.value });
                }}
                className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
                type="text"
                placeholder="نام مشتری را وارد کنید"
              />
            </div>
            <div className="flex flex-col gap-1.5 px-3">
              <label className="text-sm font-bold" htmlFor="">
                شماره تلفن
              </label>
              <input
                value={state.phone}
                onChange={(event) => {
                  dispatch({ type: "phone", value: event.target.value });
                }}
                className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
                type="text"
                placeholder=" شماره تلفن مشتری را وارد کنید"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              ایمیل
            </label>
            <input
              value={state.email}
              onChange={(event) => {
                dispatch({ type: "email", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="ایمیل مشتری را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              کد مشتری
            </label>
            <input
              value={state.code}
              onChange={(event) => {
                dispatch({ type: "code", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="نوع مشتری را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              نوع مشتری
            </label>
            <input
              value={state.type}
              onChange={(event) => {
                dispatch({ type: "type", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="نوع مشتری را وارد کنید"
            />
          </div>

          {/* <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              توضیحات
            </label>
            <input
              //   value={state.minimumbalance}
              //   onChange={(event) => {
              //     dispatch({ type: "minimumbalance", value: event.target.value });
              //   }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="توضیحات ..."
            />
          </div> */}
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              شهر
            </label>
            <input
              value={state.city}
              onChange={(event) => {
                dispatch({ type: "city", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="شهر مشتری ..."
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4 h-full">
            <label className="text-sm font-bold" htmlFor="">
              ادرس
            </label>
            <textarea
              value={state.address}
              onChange={(event) => {
                dispatch({
                  type: "address",
                  value: event.target.value,
                });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm h-full mb-4"
              type="text"
              placeholder="ادرس مشتری"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          <button
            onClick={() => {
              sendForm();
            }}
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

export default Adduser;
