import React, { useEffect, useReducer, useState } from "react";
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
import AddSupliser from "../components/suppliser/AddSupliser";
import toast from "react-hot-toast";
import useMutation from "../hooks/useMutation";

function Suppliers() {
  const [showModal, setShowModal] = useState(false);
  const { data: suppliers } = useFetch("suppliers");
  const [dataCard, setDataCard] = useState([]);
  const { data, loading, error, mutate } = useMutation("suppliers");
  const reducer = (state, action) => {
    switch (action.type) {
      case "nameSuppliser":
        return { ...state, nameSuppliser: action.value };
      case "phone":
        return { ...state, phone: action.value };
      case "telephoneNumber":
        return { ...state, telephoneNumber: action.value };
      case "namePersonalContact":
        return { ...state, namePersonalContact: action.value };
      case "email":
        return { ...state, email: action.value };
      case "province":
        return { ...state, province: action.value };
      case "city":
        return { ...state, city: action.value };
      case "address":
        return { ...state, address: action.value };
      case "codeAddress":
        return { ...state, codeAddress: action.value };
      case "category":
        return { ...state, category: action.value };
      case "paymentdeadline":
        return { ...state, paymentdeadline: action.value };
      case "description":
        return { ...state, description: action.value };
      case "code":
        return { ...state, code: action.value };

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    nameSuppliser: "",
    phone: "",
    telephoneNumber: "",
    namePersonalContact: "",
    email: "",
    province: "",
    city: "",
    address: "",
    codeAddress: "",
    category: "",
    paymentdeadline: "",
    description: "",
    code: "",
  });
  const addToForm = () => {
    return {
      name: state.nameSuppliser.trim(),
      contactPerson: state.namePersonalContact.trim(),
      phone: state.phone.trim(),
      mobile: state.telephoneNumber.trim(),
      province: state.province.trim(),
      city: state.city.trim(),
      address: state.address.trim(),
      postalCode: state.codeAddress.trim(),
      category: state.category.trim(),
      lastPurchaseDate: state.paymentdeadline.trim(),
      description: state.description.trim(),
      code: state.code.trim(),
    };
  };

  const sendForm = async () => {
    try {
      const customerData = addToForm();

      await mutate("POST", customerData);

      toast.success("مشتری با موفقیت اضافه شد");
      setShowModal(!showModal);
    } catch (error) {
      console.error("Customer API error:", error);
      toast.error(error.message || "ثبت مشتری ناموفق بود");
    }
  };

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
          <TopPage
            name={"تامین کنندگان"}
            btn={"افزودن تامین کننده"}
            func={() => {
              setShowModal(!showModal);
            }}
          />
        </div>
        <SuppliserContainer suppliers={suppliers} />
      </div>
      {showModal ? (
        <AddSupliser
          sendForm={sendForm}
          state={state}
          dispatch={dispatch}
          func={() => {
            setShowModal(!showModal);
          }}
        />
      ) : null}
    </>
  );
}

export default Suppliers;
