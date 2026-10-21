import React from "react";

function ProductContainer() {
  return (
    <div className="w-full rounded-2xl overflow-hidden">
      <table className="w-full shadow-sm rounded-2xl">
        <tr className="text-gray-600 bg-gray-300 rounded-t-2xl">
          <th className="py-6">تصویر</th>
          <th>نام محصول</th>
          <th>تاریخ</th>
          <th>قیمت</th>
          <th>موجودی</th>
          <th>وضعیت</th>
          <th>عملیات</th>
        </tr>
      </table>
    </div>
  );
}

export default ProductContainer;
