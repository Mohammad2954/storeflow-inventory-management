import React from "react";
import TopPage from "../feature/components/TopPage";
import SalesContainer from "../components/Sales/SalesContainer";
import { FaShoppingBasket } from "react-icons/fa";

function Sales() {
  return (
    <div className="">
      <div className="flex items-center px-8 gap-2">
        <FaShoppingBasket className="size-8" />
        <TopPage name={"فروش ها"} btn={"ثبت فروش جدید"} />
      </div>
      <SalesContainer />
    </div>
  );
}

export default Sales;
