import Shortcut from "../components/dashbord/Shortcut";
import CategorySalesChart from "../components/report/components/CategorySalesChart";
import LineChartReports from "../components/report/components/LineChartReports";
import { paymentMethods } from "../data/paymentMethods.js";
import Counter from "../feature/components/Counter.jsx";
import InfoCounter from "../feature/components/InfoCounter.jsx";
import { salesInvoices } from "../data/salesInvoices.js";
import {
  FaArrowLeft,
  FaBoxOpen,
  FaClipboardList,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";
import { IoDocumentsOutline } from "react-icons/io5";
import SalesLastItem from "../components/dashbord/SalesLastItem.jsx";
import LatestActivities from "../components/dashbord/LatestActivities.jsx";
import { dashboardCards } from "../data/dashboardCards.js";
import Card from "../components/dashbord/Card.jsx";
import CardSection from "../feature/Cards/CardSection.jsx";
import { data } from "react-router";
import { getData } from "../feature/Getdata/getData.js";
import useFetch from "../hooks/useFetch.js";
import { useEffect, useState } from "react";
import { findDataCards } from "../feature/GetDataCard/findDataCards.js";
import { getTodayDate } from "../feature/GetToday/getToday.js";

function Dashbord() {
  const { data: products } = useFetch("products");

  const { data: customers } = useFetch("customers");
  const { data } = useFetch("sales");
  const [dataCard, setDataCard] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      let Card = findDataCards(
        data,
        customers,
        firstCard,
        "مجموع فروش امروز",
        FaMoneyBillWave,
        "text-green-600",
        "bg-green-50",
        secondCard,
        "تعداد فاکتور امروز",
        FaClipboardList,
        "text-blue-600",
        "bg-blue-50",
        thirdCard,
        "موجودی کل کالاها",
        FaBoxOpen,
        "text-purple-600",
        "bg-purple-50",
        forthCard,
        "تعداد مشتریان امروز",
        FaUsers,
        "text-teal-600",
        "bg-teal-50",
      );
      setDataCard(Card);
    }
  }, [data]);
  const firstCard = (items) => {
    let findtodayTotalAmount = items.reduce((prev, next) => {
      // date test
      if (next.date == "1405/07/23") {
        return prev + next.totalAmount;
      } else {
        return prev;
      }
    }, 0);

    return findtodayTotalAmount.toLocaleString();
  };
  const secondCard = (items) => {
    let today = getTodayDate();
    let findtodaySalesCount = items.reduce((prev, next) => {
      // date test
      if (next.date == "1405/07/23") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findtodaySalesCount;
  };
  const thirdCard = () => {
    return products.length;
  };
  const forthCard = (items) => {
    let today = getTodayDate();
    let findtodaycoustomerCount = items.reduce((prev, next) => {
      // date test
      if (next.registerDate == "1405/01/12") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findtodaycoustomerCount;
  };
  return (
    <>
      <CardSection card={dataCard} />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5">
          <CategorySalesChart data={paymentMethods} info={"روش های پرداخت"} />
        </div>
        <div className="col-span-7 ">
          <LineChartReports />
        </div>
      </div>
      <div className="grid grid-cols-12 mt-4 gap-4">
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
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 -mt-[363px]">
          <LatestActivities />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-4">
        {dashboardCards.map((item) => {
          return <Card key={item.id} {...item} />;
        })}
      </div>
    </>
  );
}

export default Dashbord;
