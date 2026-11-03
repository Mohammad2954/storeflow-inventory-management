import React, { useEffect, useState } from "react";
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
import { findDataCards } from "../feature/GetDataCard/findDataCards";
import { useParams } from "react-router";
import { paiginationFunc } from "../feature/Pagination/pagination";

function Products() {
  const [show, setShow] = useState(false);

  const { data } = useFetch("products");

  const [dataCard, setDataCard] = useState([]);
  useEffect(() => {
    if (data.length > 0) {
      let Card = findDataCards(
        data,
        "without helperdata",
        firstCard,
        "کل محصولات",
        FaBoxOpen,
        "text-blue-600",
        "bg-blue-50",
        secondCard,
        "محصولات فعال",
        FaShoppingCart,
        "text-green-600",
        "bg-green-50",
        thirdCard,
        "محصولات ناموجود",
        FaExclamationTriangle,
        "text-red-600",
        "bg-red-50",
        forthCard,
        "دسته‌بندی‌ها",
        FaClipboardList,
        "text-purple-600",
        "bg-purple-50",
      );
      setDataCard(Card);
    }
  }, [data]);
  const firstCard = (items) => {
    return items.length;
  };
  const secondCard = (items) => {
    let findActiveProduct = items.reduce((prev, next) => {
      if (next.isActive == 1) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findActiveProduct;
  };
  const thirdCard = (items) => {
    let findActiveProduct = items.reduce((prev, next) => {
      if (next.isActive == 1) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return items.length - findActiveProduct;
  };
  const forthCard = (items) => {
    let categoryname = items
      .map((item) => item.category)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    return Object.values(categoryname).length;
  };

  return (
    <>
      <CardSection card={dataCard} />
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
