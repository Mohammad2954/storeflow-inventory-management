import React, { useState } from "react";
import TopPage from "../feature/components/TopPage";
import ProductContainer from "../components/Product/ProductContainer";
import { AiFillProduct } from "react-icons/ai";
import CardSection from "../feature/Cards/CardSection";
import AddProduct from "../components/Product/AddProduct";
import useFetch from "../hooks/useFetch";
import {
  FaBoxOpen,
  FaClipboardList,
  FaExclamationTriangle,
  FaShoppingCart,
} from "react-icons/fa";

function Products() {
  const [show, setShow] = useState(false);
  const [card, setCard] = useState({});

  const { data } = useFetch("products");
  const findDataCard = () => {
    let AllCard = [];
    const firstData = data.length;
    let secondData = 0;
    data.map((item) => {
      if (item.isActive == 1) {
        secondData += 1;
      }
    });
    const thirdData = data.length - secondData;
    let forthData = data
      .map((item) => item.category)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

    forthData = Object.values(forthData).length;
    AllCard = [
      {
        id: 1,
        title: "کل محصولات",
        value: firstData,
        icon: FaBoxOpen,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        id: 2,
        title: "محصولات فعال",
        value: secondData,
        icon: FaShoppingCart,
        color: "text-green-600",
        bg: "bg-green-50",
      },
      {
        id: 3,
        title: "کل محصولات ناموجود",
        value: thirdData,
        icon: FaExclamationTriangle,
        color: "text-red-600",
        bg: "bg-red-50",
      },
      {
        id: 4,
        title: "دسته‌بندی‌ها",
        value: forthData,
        icon: FaClipboardList,
        color: "text-purple-600",
        bg: "bg-purple-50",
      },
    ];

    return AllCard;
  };
  findDataCard();

  return (
    <>
      <CardSection card={findDataCard()} />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <AiFillProduct className="size-8" />
          <TopPage
            name={"محصولات"}
            btn={"افزودن محصول"}
            func={() => {
              setShow(!show);
            }}
          />
        </div>
        <ProductContainer
          func={() => {
            setShow(!show);
          }}
        />
      </div>
      <div>
        {show ? (
          <AddProduct
            message={"ذخیره محصول"}
            method={"POST"}
            func={() => {
              setShow(!show);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export default Products;
