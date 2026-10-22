import React from "react";

import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import { inventoryData } from "../../data/inventoryData";
import ProductItem from "../Product/ProductItem";
import EnventoryItem from "./EnventoryItem";
import FilterEnventoryItem from "./FilterEnventoryItem";

function StoreRoomContainer() {
  return (
    <div>
      <>
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
          <FilterEnventoryItem />
          <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
            <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
              <thead className="">
                <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                  <th className=" px-2">محصول</th>
                  <th className="py-3 ">کد کالا</th>
                  <th>دسته بندی</th>
                  <th>موجودی</th>
                  <th>حداقل موجودی</th>
                  <th>حداکثر موجودی</th>
                  <th>انبار</th>
                  <th>واحد </th>
                  <th>اخرین بروزرسانی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData.map((item) => (
                  <EnventoryItem key={item.id} {...item} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mb-4 px-2">
            <InfoCounter first={1} second={5} third={25} />
            <Counter />
          </div>
        </div>
      </>
    </div>
  );
}

export default StoreRoomContainer;
