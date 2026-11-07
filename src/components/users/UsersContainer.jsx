import React, { useEffect, useState } from "react";
import { users } from "../../data/users.js";
import FilterUsers from "./FilterUsers";
import UsersItem from "./UsersItem";
import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import useFetch from "../../hooks/useFetch.js";

function UsersContainer() {
  const { data: customers } = useFetch("customers");

  const [filterData, setFilterData] = useState("همه مشتری ها");
  useEffect(() => {
    if (customers.length > 1) {
      FilterDataFunc(customers);
    }
  }, [customers, filterData]);

  const [inputVal, setInputVal] = useState("");
  const [filterItems, setFilterItems] = useState([]);
  const clearFilter = () => {
    setFilterData("همه مشتری ها");
    setInputVal("");
  };

  const FilterDataFunc = (items) => {
    let sortedItems = [...items];

    switch (filterData) {
      case "بیشترین خرید":
        sortedItems.sort((a, b) => b.totalPurchases - a.totalPurchases);
        break;

      case "کمترین خرید":
        sortedItems.sort((a, b) => a.totalPurchases - b.totalPurchases);
        break;

      case "بیشترین بدهی":
        sortedItems.sort((a, b) => b.debt - a.debt);
        break;

      case "نوع مشتری":
        sortedItems.sort((a, b) => {
          const priority = {
            new: 1,
            regular: 2,
          };

          return (priority[a.type] ?? 3) - (priority[b.type] ?? 3);
        });
        break;

      default:
        sortedItems = [...items];
        break;
    }

    setFilterItems(sortedItems);
  };

  return (
    <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
      <FilterUsers
        clearFilter={clearFilter}
        filterData={filterData}
        setFilterData={setFilterData}
        inputVal={inputVal}
        setInputVal={setInputVal}
      />
      <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
        <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
          <thead>
            <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
              <th className=" px-2">مشتری</th>
              <th>اطلاعات تماس</th>
              <th className="py-3">ایمیل</th>
              <th>نوع مشتری</th>
              <th>شهر مشتری</th>
              <th>خرید مشتری</th>
              <th>بدهی</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filterItems.map((item) => (
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
