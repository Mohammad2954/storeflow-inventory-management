import React from "react";
import TopPage from "../feature/components/TopPage";
import { FaTruck } from "react-icons/fa6";
import PurchasesContainer from "../components/PurchasesContainer/PurchasesContainer";
import CardSection from "../feature/Cards/CardSection";

function Purchases() {
  return (
    <>
      <CardSection />
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
