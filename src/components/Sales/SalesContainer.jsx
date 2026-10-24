import React from "react";
import CategorySalesChart from "../report/components/CategorySalesChart";
import LineChartReports from "../report/components/LineChartReports";
import FilterReportItem from "../report/components/FilterReportItem";
import { salesInvoices } from "../../data/salesInvoices";
import SalesItem from "./SalesItem";
import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import { categorySales } from "../../data/reportData";

function SalesContainer() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <CategorySalesChart
          data={categorySales}
          info={" فروش بر اساس دسته‌بندی"}
          description={" سهم هر دسته از مجموع فروش"}
        />
        <LineChartReports />
      </div>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
        <FilterReportItem />
        <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
          <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl ">
                <th className="py-3"> شماره فاکتور</th>
                <th>تاریخ</th>
                <th>مشتری</th>
                <th>مبلغ کل</th>
                <th>تخفیف</th>
                <th>روش پرداخت</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {salesInvoices.map((item) => (
                <SalesItem key={item.id} {...item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4 px-4">
          <InfoCounter first={1} second={5} third={25} />
          <Counter />
        </div>
      </div>
    </div>
  );
}

export default SalesContainer;
