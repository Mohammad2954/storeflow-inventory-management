import React, { useEffect, useReducer, useState } from "react";
import ProductItem from "./ProductItem";
import Counter from "../../feature/components/Counter";
import InfoCounter from "../../feature/components/InfoCounter";
import FilterEnventoryItem from "../Storeroom/FilterEnventoryItem";
import { data, useNavigate, useParams } from "react-router";
import useFetch from "../../hooks/useFetch.js";
import AddProduct from "./AddProduct.jsx";
import { getData } from "../../feature/Getdata/getData.js";
import { paiginationFunc } from "../../feature/Pagination/pagination.js";

function ProductContainer() {
  let param = useParams();
  param = Number(param.page);
  let navpage = useNavigate();

  const changePage = (page) => {
    navpage(`/products/${page}`);
  };

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
          filterStatus: "همه وضعیت ها",
          filterCategory: "همه دسته بندی ها",
          searchInput: "",
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
    status = Object.keys(findStatus).splice(0, 3);
    category = products
      .map((item) => item.category)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    category = Object.keys(category);
  };
  sendData();

  const filterSearchFunc = (pro) => {
    return state.searchInput
      ? pro.filter((item) => {
          return (
            item.name.includes(state.searchInput) ||
            item.sku.includes(state.searchInput.toUpperCase())
          );
        })
      : pro;
  };
  const filterStatusFunc = (pro) => {
    return state.filterStatus === "همه وضعیت ها"
      ? pro
      : pro.filter((item) => {
          return item.status === state.filterStatus;
        });
  };
  const filterCategoryFunc = (pro) => {
    return state.filterCategory === "همه دسته بندی ها"
      ? pro
      : pro.filter((item) => {
          return item.category === state.filterCategory;
        });
  };

  let filterProdct = filterSearchFunc(products);
  filterProdct = filterStatusFunc(filterProdct);
  filterProdct = filterCategoryFunc(filterProdct);

  let { finalData, countPage, firstIndex, lastIndex } = paiginationFunc(
    filterProdct.filter((item) => item.isActive == 1),
    10,
    param,
  );

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
              {finalData.map((item) => (
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
          <InfoCounter
            first={firstIndex + 1}
            second={lastIndex}
            third={filterProdct.filter((item) => item.isActive == 1).length}
          />
          <Counter
            countPage={countPage}
            param={param}
            changePage={changePage}
          />
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
