import React, { useEffect, useReducer, useState } from "react";
import ProductItem from "./ProductItem";
import Counter from "../../feature/components/Counter";
import InfoCounter from "../../feature/components/InfoCounter";
import FilterEnventoryItem from "../Storeroom/FilterEnventoryItem";
import { data } from "react-router";
import useFetch from "../../hooks/useFetch.js";
import AddProduct from "./AddProduct.jsx";
import { getData } from "../../feature/Getdata/getData.js";

function ProductContainer() {
  const { data: products, loading, error } = useFetch("products");

  const [show, setShow] = useState(false);
  const [element, setElemnt] = useState([]);

  let status;
  let category;

  useEffect(() => {
    if (element.length !== 0) {
      setShow(true);
    }
  }, [element]);

  const reduser = (state, action) => {
    switch (action.type) {
      case "change category":
        return { ...state, filterCategory: action.value };
      case "change status":
        return { ...state, filterStatus: action.value };
      case "change search":
        return { ...state, searchInput: action.value };
      case "clear":
        return {
          ...state,
          filterStatus: " همه وضعیت ها",
          filterCategory: "همه دسته بندی ها",
        };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reduser, {
    filterStatus: "همه وضعیت ها",
    filterCategory: "همه دسته بندی ها",
    searchInput: "",
  });
  if (loading) return <div>در حال دریافت اطلاعات</div>;
  if (error) return <div>مشکلی پیش امد</div>;

  const GetDataElemnt = async (id) => {
    const x = await getData(`products/${id}`);
    setElemnt(x);
  };

  const sendData = () => {
    let findStatus = products
      .map((item) => item.status)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    status = Object.keys(findStatus);
    category = products
      .map((item) => item.category)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    category = Object.keys(category);
  };
  sendData();
  let filterProdct = state.searchInput
    ? products.filter((item) => {
        return (
          item.name.includes(state.searchInput) ||
          item.sku.includes(state.searchInput.toUpperCase())
        );
      })
    : products;
  filterProdct = filterProdct
    .filter((item) => {
      if (state.filterStatus === "همه وضعیت ها") {
        return products;
      } else {
        return item.status === state.filterStatus;
      }
    })
    .filter((item) => {
      if (state.filterCategory === "همه دسته بندی ها") {
        return products;
      } else {
        return item.category === state.filterCategory;
      }
    });

  return (
    <>
      <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
        <FilterEnventoryItem
          status={status}
          category={category}
          state={state}
          dispatch={dispatch}
        />
        <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
          <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
            <thead>
              <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                <th className=" px-2">تصویر</th>
                <th className="py-3">نام محصول</th>
                <th>کد کالا</th>
                <th>دسته بندی</th>
                <th>قیمت فروش</th>
                <th>موجودی</th>
                <th>وضعیت</th>
                <th>تاریخ افزودن</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filterProdct
                .filter((item) => item.isActive == 1)
                .map((item) => (
                  <ProductItem
                    GetDataElemnt={GetDataElemnt}
                    key={item.id}
                    {...item}
                  />
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mb-4 px-4">
          <InfoCounter first={1} second={5} third={25} />
          <Counter />
        </div>
      </div>

      {show ? (
        <AddProduct
          message={"ویرایش محصول"}
          method={"PATCH"}
          {...element}
          func={() => {
            setShow(!show);
          }}
        />
      ) : null}
    </>
  );
}

export default ProductContainer;
