import React, { useEffect, useState } from "react";
import TopPage from "../feature/components/TopPage";
import { FaTruck } from "react-icons/fa6";
import PurchasesContainer from "../components/PurchasesContainer/PurchasesContainer";
import CardSection from "../feature/Cards/CardSection";
import useFetch from "../hooks/useFetch";
import { findDataCards } from "../feature/GetDataCard/findDataCards";
import {
  FaClipboardList,
  FaMoneyBillWave,
  FaShoppingCart,
} from "react-icons/fa";
import { getTodayDate } from "../feature/GetToday/getToday";

function Purchases() {
  const { data: purchases } = useFetch("purchases");
  const { data: suppliers } = useFetch("suppliers");
  const [dataCard, setDataCard] = useState([]);

  useEffect(() => {
    if (suppliers.length > 0) {
      let Card = findDataCards(
        purchases,
        suppliers,
        firstCard,
        "مجموع خرید امروز",
        FaMoneyBillWave,
        "text-blue-600",
        "bg-blue-50",
        secondCard,
        "تعداد فاکتورهای خرید",
        FaClipboardList,
        "text-purple-600",
        "bg-purple-50",
        thirdCard,
        "خریدهای تسویه‌نشده",
        FaShoppingCart,
        "text-amber-600",
        "bg-amber-50",
        forthCard,
        "تأمین‌کنندگان",
        FaTruck,
        "text-green-600",
        "bg-green-50",
      );
      setDataCard(Card);
    }
  }, [suppliers]);
  const firstCard = (items) => {
    let today = getTodayDate();
    let findtodayTotalAmount = items.reduce((prev, next) => {
      // date test
      if (next.orderDate == "1405/07/23") {
        return prev + next?.totalAmount;
      } else {
        return prev;
      }
    }, 0);
    return findtodayTotalAmount.toLocaleString();
  };
  const secondCard = (items) => {
    let purchaseCount = items.reduce((prev, next) => {
      if (next.status === "لغوشده") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return purchaseCount;
  };
  const thirdCard = (items) => {
    let findBeenSettledPurcheses = items.reduce((prev, next) => {
      if (next.remainingAmount > 0 && items.status !== "لغوشده") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findBeenSettledPurcheses;
  };
  const forthCard = (items) => {
    return items.length;
  };

  return (
    <>
      <CardSection card={dataCard} />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <FaTruck className="size-8" />
          <TopPage name={"خرید و تامین کالا"} btn={"ثبت خرید جدید"} />
        </div>
        <PurchasesContainer />
      </div>
    </>
  );
}

export default Purchases;
