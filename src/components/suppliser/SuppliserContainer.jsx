import React, { useEffect, useReducer, useState } from "react";
import FilterEnventoryItem from "../Storeroom/FilterEnventoryItem";
import FilterSupplier from "./FilterSupplier.jsx";
import SupplierItem from "./SupplierItem.jsx";
import InfoCounter from "../../feature/components/InfoCounter.jsx";
import Counter from "../../feature/components/Counter.jsx";
import SupplierDetails from "./SupplierDetails.jsx";
import useFetch from "../../hooks/useFetch.js";
import useMutation from "../../hooks/useMutation.js";
import SupplierEditModal from "./SupplierEditModal.jsx";
import SupplierEdit from "./SupplierEditModal.jsx";

function SuppliserContainer({ suppliers }) {
  const [supplier, setSupplier] = useState(null);
  const [supplierEdit, setSupplierEdit] = useState(null);
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(false);

  const reduce = (state, action) => {
    switch (key) {
      case "address":
        return { ...state, address: action.value };
      case "category":
        return { ...state, category: action.value };
      case "city":
        return { ...state, city: action.value };
      case "code":
        return { ...state, code: action.value };
      case "contactPerson":
        return { ...state, contactPerson: action.value };
      case "debt":
        return { ...state, debt: action.value };
      case "description":
        return { ...state, description: action.value };
      case "email":
        return { ...state, email: action.value };
      case "lastPurchaseDate":
        return { ...state, lastPurchaseDate: action.value };
      case "mobile":
        return { ...state, mobile: action.value };
      case "name":
        return { ...state, name: action.value };
      case "paidAmount":
        return { ...state, paidAmount: action.value };
      case "paymentTerm":
        return { ...state, paymentTerm: action.value };
      case "phone":
        return { ...state, phone: action.value };
      case "postalCode":
        return { ...state, postalCode: action.value };
      case "productsCount":
        return { ...state, productsCount: action.value };
      case "province":
        return { ...state, province: action.value };
      case "rating":
        return { ...state, rating: action.value };
      case "startDate":
        return { ...state, startDate: action.value };
      case "status":
        return { ...state, status: action.value };
      case "totalPurchases":
        return { ...state, totalPurchases: action.value };

      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reduce, {
    address: "اصفهان، خیابان جی، خیابان شهیدان",
    category: "مواد غذایی",
    city: "اصفهان",
    code: "SUP-001",
    contactPerson: "علی رضایی",
    debt: 35000000,
    description: "تأمین‌کننده مواد غذایی و کالاهای مصرفی فروشگاه",
    email: "sales@behngostar.example",
    lastPurchaseDate: "1405/07/28",
    mobile: "09131234561",
    name: "شرکت پخش بهین‌گستر",
    paidAmount: 150000000,
    paymentTerm: "30 روزه",
    phone: "03136621001",
    postalCode: "8156789123",
    productsCount: 24,
    province: "اصفهان",
    rating: 4.8,
    startDate: "1404/02/15",
    status: "active",
    totalPurchases: 185000000,
  });

  const getSuppliser = async (id) => {
    const data = suppliers.find((e) => e.id == id);

    setSupplier(data);
    setShow(!show);
  };

  const getSuppliserEdit = async (id) => {
    const data = suppliers.find((e) => e.id == id);
    // await useFetch(`suppliers/${id}`,"PATCH",state)
    setSupplierEdit(data);
    setEdit(!edit);
  };

  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
        <FilterSupplier />
        <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
          <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                <th className=" px-2">تامین کننده</th>
                <th className="py-3">دسته بندی</th>
                <th>اطلاعات تماس</th>
                <th>مجموع خرید</th>
                <th>بدهی</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((item) => (
                <SupplierItem
                  key={item.id}
                  {...item}
                  getSuppliser={getSuppliser}
                  getSuppliserEdit={getSuppliserEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4 px-4">
          {/* <InfoCounter first={1} second={5} third={25} />
        <Counter /> */}
        </div>
      </div>
      {show ? (
        <SupplierDetails show={show} setShow={setShow} supplier={supplier} />
      ) : null}
      {edit ? (
        <SupplierEdit
          state={state}
          dispatch={dispatch}
          supplierEdit={supplierEdit}
          changeShoeEdit={() => {
            setEdit(!edit);
          }}
        />
      ) : null}
    </>
  );
}

export default SuppliserContainer;
