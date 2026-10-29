import React, { useEffect, useReducer, useState } from "react";
import { AiFillProduct } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import ProductImageInput from "../Product/ProductImageInput";
import { CiSaveDown2 } from "react-icons/ci";
function AddProduct({ func }) {
  const formData = new FormData();

  const funceducer = (state, action) => {
    switch (action.type) {
      case "name":
        return { ...state, name: action.value };
      case "unit":
        return { ...state, unit: action.value };
      case "sku":
        return { ...state, sku: action.value };
      case "category":
        return { ...state, category: action.value };
      case "price":
        return { ...state, price: action.value };
      case "currentinventory":
        return { ...state, currentinventory: action.value };
      case "minimumbalance":
        return { ...state, minimumbalance: action.value };
      case "file":
        return { ...state, file: action.value };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(funceducer, {
    name: "",
    sku: "",
    file: null,
    category: "",
    price: "",
    currentinventory: "",
    minimumbalance: "",
    unit: "",
  });

  const addToForm = () => {
    formData.append("name", state.name);
    formData.append("sku", state.sku);
    formData.append("category", state.file);
    formData.append("price", state.category);
    formData.append("stock", state.price);
    formData.append("minstock", state.currentinventory);
    formData.append("unit", state.minimumbalance);
    if (state.file) {
      formData.append("image", state.unit);
    }
  };

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
            onClick={() => func()}
          />
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col justify-around pb-4">
            <div className="flex flex-col gap-1.5 px-3">
              <label className="text-sm font-bold" htmlFor="">
                نام محصول
              </label>
              <input
                value={state.name}
                onChange={(event) => {
                  dispatch({ type: "name", value: event.target.value });
                }}
                className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
                type="text"
                placeholder="نام محصول را وارد کنید"
              />
            </div>
            <div className="flex flex-col gap-1.5 px-3">
              <label className="text-sm font-bold" htmlFor="">
                SKU
              </label>
              <input
                value={state.sku}
                onChange={(event) => {
                  dispatch({ type: "sku", value: event.target.value });
                }}
                className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
                type="text"
                placeholder="کد محصول را وارد کنید"
              />
            </div>
          </div>
          <div>
            <ProductImageInput
              onImageChange={(file) =>
                dispatch({
                  type: "file",
                  value: file,
                })
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              دسته بندی
            </label>
            <input
              value={state.category}
              onChange={(event) => {
                dispatch({ type: "category", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="دسته بندی محصول را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              قیمت
            </label>
            <input
              value={state.price}
              onChange={(event) => {
                dispatch({ type: "price", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="قیمت محصول را وارد کنید"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              موجودی فعلی
            </label>
            <input
              value={state.currentinventory}
              onChange={(event) => {
                dispatch({
                  type: "currentinventory",
                  value: event.target.value,
                });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="تعداد موجود در انبار"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              حداقل موجودی
            </label>
            <input
              value={state.minimumbalance}
              onChange={(event) => {
                dispatch({ type: "minimumbalance", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="حداقل موجودی مورد نیاز"
            />
          </div>
          <div className="flex flex-col gap-1.5 px-3 mb-4">
            <label className="text-sm font-bold" htmlFor="">
              واحد اندازه گیری
            </label>
            <input
              value={state.unit}
              onChange={(event) => {
                dispatch({ type: "unit", value: event.target.value });
              }}
              className="outline-none border border-gray-300 rounded-lg py-1.5 pr-2 text-sm"
              type="text"
              placeholder="واحد اندازه گیری"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-4">
          <button
            onClick={() => {
              console.log(state);
            }}
            className="w-full py-3 border border-gray-300 shadow-sm rounded-lg cursor-pointer hover:bg-accent-hover font-bold hover:text-white transition duration-300 flex items-center justify-center gap-2"
          >
            ذخیره محصول
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

export default AddProduct;
