import React from "react";
import ProductItem from "./ProductItem";

function ProductContainer() {
  return (
    <div className="w-full rounded-2xl overflow-hidden">
      <table className="w-full shadow-sm rounded-2xl">
        <tr className="text-gray-600 bg-gray-300 rounded-t-2xl text-center">
          <th className="py-6">تصویر</th>
          <th>نام محصول</th>
          <th>تاریخ</th>
          <th>قیمت</th>
          <th>موجودی</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
        <ProductItem
          img={"/product/headphone.jpg"}
          name={"هدفون"}
          date={"1402/01/24"}
          price={"2500000"}
          Inventory={"20"}
          Status={"موجود"}
        />
      </table>
    </div>
  );
}

export default ProductContainer;
