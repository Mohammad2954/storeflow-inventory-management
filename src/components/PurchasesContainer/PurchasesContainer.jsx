import React from "react";
import FilterPurchasesItem from "./FilterPurchasesItem";
import PurchasesItem from "./PurchasesItem";
import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import { purchases } from "../../data/purchases";
import LastBuy from "./LastBuy";

function PurchasesContainer() {
  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
        <FilterPurchasesItem />
        <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
          <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                <th className=" px-2">شماره سفارش</th>
                <th className="py-3">تأمین‌کننده</th>
                <th>تاریخ سفارش</th>
                <th>تعداد اقلام</th>
                <th>مبلغ کل</th>
                <th>وضعیت</th>
                <th>تاریخ دریافت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((item) => (
                <PurchasesItem key={item.id} {...item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4 px-4">
          <InfoCounter first={1} second={5} third={25} />
          <Counter />
        </div>
      </div>
      <LastBuy />
    </>
  );
}

export default PurchasesContainer;
