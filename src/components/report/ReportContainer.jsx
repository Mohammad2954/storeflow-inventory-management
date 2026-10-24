import React from "react";
import DateOfReport from "./components/DateOfReport";
import LineChartReports from "./components/LineChartReports";
import CategorySalesChart from "./components/CategorySalesChart";
import Counter from "../../feature/components/Counter";
import InfoCounter from "../../feature/components/InfoCounter";
import { productSalesReport } from "../../data/productSalesReport ";
import SalesReportItem from "./components/SalesReportItem";
import FilterReportItem from "./components/FilterReportItem";
import { categorySales } from "../../data/reportData";

function ReportContainer() {
  return (
    <div>
      <div>
        <DateOfReport />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <CategorySalesChart
          data={categorySales}
          info={" فروش بر اساس دسته‌بندی"}
          description={" سهم هر دسته از مجموع فروش"}
        />
        <LineChartReports />
      </div>
      <div>
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
          <FilterReportItem />
          <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
            <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
              <thead>
                <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                  <th>#</th>
                  <th className="py-3"> محصول</th>
                  <th>دسته بندی</th>
                  <th>قیمت واحد</th>
                  <th>تعداد فروش</th>
                  <th>مبلغ فروش</th>
                  <th>درصد از کل فروش</th>
                  <th>سود حاصل از فروش</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {productSalesReport.map((item) => (
                  <SalesReportItem key={item.id} {...item} />
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
    </div>
  );
}

export default ReportContainer;
