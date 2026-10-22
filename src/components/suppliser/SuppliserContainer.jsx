import React from "react";
import FilterEnventoryItem from "../Storeroom/FilterEnventoryItem";
import { suppliers } from "../../data/suppliers.js";
import FilterSupplier from "./FilterSupplier.jsx";
import SupplierItem from "./SupplierItem.jsx";
import InfoCounter from "../../feature/components/InfoCounter.jsx";
import Counter from "../../feature/components/Counter.jsx";

function SuppliserContainer() {
  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
      {/* <FilterSupplier /> */}
      <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
        <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
          <thead>
            <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
              <th className=" px-2">تامین کننده</th>
              <th className="py-3">دسته بندی</th>
              <th>اطلاعات تماس</th>
              <th>مجموع خرید</th>
              <th>بدهی</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item) => (
              <SupplierItem key={item.id} {...item} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mb-4 px-4">
        <InfoCounter first={1} second={5} third={25} />
        <Counter />
      </div>
    </div>
  );
}

export default SuppliserContainer;
