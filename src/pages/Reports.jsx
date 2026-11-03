import React, { useEffect, useState } from "react";
import TopPage from "../feature/components/TopPage";
import ReportContainer from "../components/report/ReportContainer";
import {
  FaBoxOpen,
  FaChartLine,
  FaClipboardList,
  FaMoneyBillWave,
  FaShoppingBasket,
  FaShoppingCart,
} from "react-icons/fa";
import CardSection from "../feature/Cards/CardSection";
import useFetch from "../hooks/useFetch";
import { findDataCards } from "../feature/GetDataCard/findDataCards";
import { getTodayDate } from "../feature/GetToday/getToday";
import { TbReportSearch } from "react-icons/tb";
function Reports() {
  const { data } = useFetch("sales");
  const [dataCard, setDataCard] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      let Card = findDataCards(
        data,
        "without helperdata",
        firstCard,
        "مجموع فروش ماه",
        FaMoneyBillWave,
        "text-green-600",
        "bg-green-50",
        secondCard,
        "تعداد فاکتورهای فروش",
        FaClipboardList,
        "text-blue-600",
        "bg-blue-50",
        thirdCard,
        "تعداد محصولات",
        FaBoxOpen,
        "text-purple-600",
        "bg-purple-50",
        forthCard,
        "رشد فروش",
        FaChartLine,
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
  const thirdCard = (items) => {
    let findBeingProcessed = items.reduce((prev, next) => {
      if (next.status == "در حال پردازش") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findBeingProcessed;
  };
  const forthCard = (items) => {
    let AverageSales = items.reduce((prev, next) => {
      return prev + next?.totalAmount;
    }, 0);

    return (AverageSales / items.length).toLocaleString();
  };
  return (
    <>
      <CardSection card={dataCard} />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <TbReportSearch className="size-8" />
          <TopPage name={"گزارش ها"} />
        </div>
        <ReportContainer />
      </div>
    </>
  );
}

export default Reports;
