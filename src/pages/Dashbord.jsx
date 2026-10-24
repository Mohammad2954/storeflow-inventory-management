import React from "react";
import Shortcut from "../components/dashbord/Shortcut";
import Summery from "../components/dashbord/Summery";
import CategorySalesChart from "../components/report/components/CategorySalesChart";
import LineChartReports from "../components/report/components/LineChartReports";
import { paymentMethods } from "../data/paymentMethods.js";
import Counter from "../feature/components/Counter.jsx";
import InfoCounter from "../feature/components/InfoCounter.jsx";
import SalesItem from "../components/Sales/SalesItem.jsx";
import { salesInvoices } from "../data/salesInvoices.js";
import { FaArrowLeft } from "react-icons/fa";
import { IoDocumentsOutline } from "react-icons/io5";
import SalesLastItem from "../components/dashbord/SalesLastItem.jsx";

function Dashbord() {
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-5">
          <CategorySalesChart data={paymentMethods} info={"روش های پرداخت"} />
        </div>
        <div className="col-span-7 ">
          <LineChartReports />
        </div>
      </div>
      <div className="grid grid-cols-12 mt-4 gap-6">
        <div className="col-span-4">
          <Shortcut />
        </div>
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden  shadow-sm bg-white dark:bg-gray-800 col-span-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <IoDocumentsOutline className="text-accent size-5" />
              <span>اخرین فاکتور های فروش</span>
            </div>
            <div className="text-accent-hover underline flex items-center gap-3 pt-3  pb-2">
              <span className="text-sm pb-1">مشاهده همه</span>
              <FaArrowLeft />
            </div>
          </div>
          <div className="px-4 rounded-t-xl overflow-hidden border-gray-200 pb-4">
            <table className="w-full shadow-sm  rounded-t-xl overflow-hidden">
              <thead>
                <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-xl ">
                  <th className="py-3"> شماره فاکتور</th>
                  <th>تاریخ</th>
                  <th>مشتری</th>
                  <th>مبلغ کل</th>
                  <th>روش پرداخت</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {salesInvoices.map((item) => (
                  <SalesLastItem key={item.id} {...item} />
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
    </>
  );
}

export default Dashbord;
