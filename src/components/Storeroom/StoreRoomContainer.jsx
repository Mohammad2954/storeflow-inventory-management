import React from "react";

import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import { inventoryData } from "../../data/inventoryData";
import ProductItem from "../Product/ProductItem";
import EnventoryItem from "./EnventoryItem";

function StoreRoomContainer({
  productName,
  category,
  quantity,
  minQuantity,
  maxQuantity,
  warehouse,
  lastUpdated,
  status,
  sku,
  unit,
}) {
  return (
    <div>
      <>
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8">
          <table className="w-full shadow-sm ">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                <th className="border border-gray-200 px-2">محصول</th>
                <th className="py-3 border border-gray-200">کد کالا</th>
                <th className="border border-gray-200">دسته بندی</th>
                <th className="border border-gray-200">موجودی</th>
                <th className="border border-gray-200">حداقل موجودی</th>
                <th className="border border-gray-200">حداکثر موجودی</th>
                <th className="border border-gray-200">واحد </th>
                <th className="border border-gray-200">انبار</th>
                <th className="border border-gray-200">اخرین بروزرسانی</th>
                <th className="border border-gray-200">وضعیت</th>
                <th className="border border-gray-200">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <EnventoryItem key={item.id} {...item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4 px-2">
          <InfoCounter first={1} second={5} third={25} />
          <Counter />
        </div>
      </>
    </div>
  );
}

export default StoreRoomContainer;
