import React, { useState } from "react";
import { users } from "../../data/users.js";
import FilterUsers from "./FilterUsers";
import UsersItem from "./UsersItem";
import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";

function UsersContainer({ customers }) {
  const [filterData, setFilterData] = useState("همه مشتری ها");
  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
      <FilterUsers filterData={filterData} setFilterData={setFilterData} />
      <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
        <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
          <thead>
            <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
              <th className=" px-2">مشتری</th>
              <th>اطلاعات تماس</th>
              <th className="py-3">ایمیل</th>
              <th>نوع مشتری</th>
              <th>شهر مشتری</th>
              <th>بدهی</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((item) => (
              <UsersItem key={item.id} {...item} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mb-4 px-4">
        {/* <InfoCounter first={1} second={5} third={25} />
        <Counter /> */}
      </div>
    </div>
  );
}

export default UsersContainer;
