import React from "react";
import ProductItem from "./ProductItem";
import { products } from "../../data/products";
import Counter from "../../feature/components/Counter";
import InfoCounter from "../../feature/components/InfoCounter";

function ProductContainer() {
  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8">
        <table className="w-full shadow-sm ">
          <tr className="text-gray-600 bg-gray-300 rounded-t-2xl text-center">
            <th className="border border-gray-200 px-2">#</th>
            <th className="py-6 border border-gray-200">تصویر</th>
            <th className="border border-gray-200">نام محصول</th>
            <th className="border border-gray-200">تاریخ</th>
            <th className="border border-gray-200">قیمت</th>
            <th className="border border-gray-200">موجودی</th>
            <th className="border border-gray-200">وضعیت</th>
            <th className="border border-gray-200">عملیات</th>
          </tr>
          {products.map((item) => (
            <ProductItem key={item.id} {...item} />
          ))}
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <InfoCounter first={1} second={5} third={25} />
        <Counter />
      </div>
    </>
  );
}

export default ProductContainer;
