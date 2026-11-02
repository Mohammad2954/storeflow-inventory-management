import StoreRoomContainer from "../components/Storeroom/StoreRoomContainer";
import CardSection from "../feature/Cards/CardSection";
import TopPage from "../feature/components/TopPage";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaWarehouse,
} from "react-icons/fa";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { findDataCards } from "../feature/GetDataCard/findDataCards";

function StoreRoom() {
  const { data: store, loading, error } = useFetch("inventory");
  const { data: products } = useFetch("products");
  const [dataCard, setDataCard] = useState([]);
  useEffect(() => {
    if (store.length > 0) {
      let Card = findDataCards(
        store,
        products,
        firstCard,
        "کل موجودی انبار",
        FaBoxOpen,
        "text-blue-600",
        "bg-blue-50",
        secondCard,
        "محصولات کم‌موجود",
        FaExclamationTriangle,
        "text-amber-600",
        "bg-amber-50",
        thirdCard,
        "محصولات ناموجود",
        FaBoxOpen,
        "text-red-600",
        "bg-red-50",
        forthCard,
        "ارزش تقریبی موجودی",
        FaMoneyBillWave,
        "text-green-600",
        "bg-green-50",
      );
      setDataCard(Card);
    }
  }, [store]);
  const firstCard = (items) => {
    return store.reduce((prev, next) => prev + next.quantity, 0);
  };
  const secondCard = (items) => {
    let findquantityProduct = items.reduce((prev, next) => {
      if (next.quantity <= 10) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findquantityProduct;
  };
  const thirdCard = (items) => {
    let findUnActiveProduct = items.reduce((prev, next) => {
      if (next.status === "ناموجود") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    return findUnActiveProduct;
  };
  const forthCard = (items) => {
    let findAllProductPrice = items.reduce((prev, next) => {
      if (next.stock > 0) {
        return prev + next.stock * next.price;
      } else {
        return prev;
      }
    }, 0);
    return findAllProductPrice.toLocaleString();
  };

  return (
    <>
      <CardSection card={dataCard} />
      {/* <div className="flex items-center px-8 gap-2">
        <FaWarehouse className="size-8" />
        <TopPage name={"انبار و موجودی"} btn={"افزودن موجودی"} />
      </div>
      <div>
        <StoreRoomContainer />
      </div> */}
    </>
  );
}

export default StoreRoom;
