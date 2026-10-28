import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Counter from "../../feature/components/Counter";
import InfoCounter from "../../feature/components/InfoCounter";
import FilterEnventoryItem from "../Storeroom/FilterEnventoryItem";
import { data } from "react-router";
import useFetch from "../../hooks/useFetch.js";

function ProductContainer() {
  const { data: products, loading, error } = useFetch("products");
  if (loading) return <div>در حال دریافت اطلاعات</div>;
  if (error) return <div>مشکلی پیش امد</div>;

  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
        <FilterEnventoryItem />
        <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
          <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                <th className=" px-2">تصویر</th>
                <th className="py-3">نام محصول</th>
                <th>کد کالا</th>
                <th>دسته بندی</th>
                <th>قیمت فروش</th>
                <th>موجودی</th>
                <th>وضعیت</th>
                <th>تاریخ افزودن</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <ProductItem key={item.id} {...item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4 px-4">
          <InfoCounter first={1} second={5} third={25} />
          <Counter />
        </div>
      </div>
    </>
  );
}

export default ProductContainer;
