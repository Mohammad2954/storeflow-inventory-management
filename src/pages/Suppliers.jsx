import React, { useEffect, useState } from "react";
import TopPage from "../feature/components/TopPage";
import SuppliserContainer from "../components/suppliser/SuppliserContainer";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import CardSection from "../feature/Cards/CardSection";
import { findDataCards } from "../feature/GetDataCard/findDataCards";
import useFetch from "../hooks/useFetch";

function Suppliers() {
  const { data: suppliers } = useFetch("suppliers");
  const [dataCard, setDataCard] = useState([]);

  useEffect(() => {
    if (suppliers.length > 0) {
      let Card = findDataCards(
        suppliers,
        "without helperdata",
        firstCard,
        "کل تأمین‌کنندگان",
        FaTruck,
        "text-blue-600",
        "bg-blue-50",
        secondCard,
        "تأمین‌کنندگان فعال",
        FaUsers,
        "text-green-600",
        "bg-green-50",
        thirdCard,
        "خرید از تأمین کنندگان ",
        FaShoppingCart,
        "text-purple-600",
        "bg-purple-50",
        forthCard,
        "بدهی به تأمین‌کنندگان",
        FaMoneyBillWave,
        "text-red-600",
        "bg-red-50",
      );
      setDataCard(Card);
    }
  }, [suppliers]);
  const firstCard = (items) => {
    return items.length;
  };
  const secondCard = (items) => {
    let ActiveSuppliers = items.reduce((prev, next) => {
      if (next.status === "active") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return ActiveSuppliers;
  };
  const thirdCard = (items) => {
    let findTotalPurchases = items.reduce((prev, next) => {
      if (next.totalPurchases) {
        return prev + next.totalPurchases;
      } else {
        return prev;
      }
    }, 0);
    return findTotalPurchases.toLocaleString();
  };
  const forthCard = (items) => {
    let debtToSuppliser = items.reduce((prev, next) => {
      if (next.debt) {
        return prev + next.debt;
      } else {
        return prev;
      }
    }, 0);
    return debtToSuppliser.toLocaleString();
  };
  return (
    <>
      <CardSection card={dataCard} />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <FaUsers className="size-8" />
          <TopPage name={"تامین کنندگان"} btn={"افزودن تامین کننده"} />
        </div>
        <SuppliserContainer />
      </div>
    </>
  );
}

export default Suppliers;
