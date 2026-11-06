import React, { useEffect, useState } from "react";
import TopPage from "../feature/components/TopPage";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import UsersContainer from "../components/users/UsersContainer";
import CardSection from "../feature/Cards/CardSection";
import useFetch from "../hooks/useFetch";
import { findDataCards } from "../feature/GetDataCard/findDataCards";
import Adduser from "../components/users/Adduser";

function Users() {
  const { data: customers } = useFetch("customers");
  const [dataCard, setDataCard] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (customers.length > 0) {
      let Card = findDataCards(
        customers,
        "without helperdata",
        firstCard,
        "کل مشتریان",
        FaUsers,
        "text-blue-600",
        "bg-blue-50",
        secondCard,
        "مشتریان جدید این ماه",
        FaUsers,
        "text-green-600",
        "bg-green-50",
        thirdCard,
        "مشتریان فعال",
        FaShoppingCart,
        "text-purple-600",
        "bg-purple-50",
        forthCard,
        "فروش این ماه",
        FaMoneyBillWave,
        "text-teal-600",
        "bg-teal-50",
      );
      setDataCard(Card);
    }
  }, [customers]);
  const firstCard = (items) => {
    return items.length;
  };
  const secondCard = (items) => {
    const today = new Date();

    const newCustomers = items.filter((item) => {
      const registerDate = new Date(item.registerDate);

      return (
        registerDate.getMonth() === today.getMonth() &&
        registerDate.getFullYear() === today.getFullYear()
      );
    });

    const newCustomersCount = newCustomers.length;
    return newCustomersCount;
  };
  const thirdCard = (items) => {
    let customersWithPurchase = items.reduce((prev, next) => {
      if (next.status === "active") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return customersWithPurchase;
  };
  const forthCard = (items) => {
    const today = new Date();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const last30DaysSales = items.filter((item) => {
      const saleDate = new Date(item.date);

      return saleDate >= thirtyDaysAgo && saleDate <= today;
    });

    const totalSalesLast30Days = last30DaysSales.reduce(
      (total, item) => total + item.totalAmount,
      0,
    );
    return totalSalesLast30Days;
  };

  return (
    <>
      <CardSection card={dataCard} />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <FaUser className="size-8" />
          <TopPage
            name={"مشتریان"}
            btn={"افزودن مشتری"}
            func={() => {
              setShowModal(!showModal);
            }}
          />
        </div>
        <UsersContainer />
      </div>
      {showModal ? (
        <Adduser
          func={() => {
            setShowModal(!showModal);
          }}
        />
      ) : null}
    </>
  );
}

export default Users;
