import React, { useEffect, useReducer, useState } from "react";

import InfoCounter from "../../feature/components/InfoCounter";
import Counter from "../../feature/components/Counter";
import { inventoryData } from "../../data/inventoryData";
import ProductItem from "../Product/ProductItem";
import EnventoryItem from "./EnventoryItem";
import FilterEnventoryItem from "./FilterEnventoryItem";
import { useNavigate, useParams } from "react-router";
import useFetch from "../../hooks/useFetch";
import FilterStoreroomItem from "./FilterStoreroomItem";
import { paiginationFunc } from "../../feature/Pagination/pagination";

function StoreRoomContainer() {
  let param = useParams();
  param = Number(param.page);
  let navpage = useNavigate();

  const changePage = (page) => {
    navpage(`/inventory/${page}`);
  };

  const { data: inventory, loading, error } = useFetch("inventory");

  const [show, setShow] = useState(false);
  const [element, setElemnt] = useState([]);

  let status;
  let category;
  let inven;

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
      case "change inventory":
        return { ...state, filterInventory: action.value };
      case "clear":
        return {
          ...state,
          filterStatus: "همه وضعیت ها",
          filterCategory: "همه دسته بندی ها",
          filterInventory: "همه انبار ها",
          searchInput: "",
        };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reduser, {
    filterStatus: "همه وضعیت ها",
    filterCategory: "همه دسته بندی ها",
    filterInventory: "همه انبار ها",
    searchInput: "",
  });
  if (loading) return <div>در حال دریافت اطلاعات</div>;
  if (error) return <div>مشکلی پیش امد</div>;

  const GetDataElemnt = async (id) => {
    const x = await getData(`inventory/${id}`);
    setElemnt(x);
  };

  const sendData = () => {
    let findStatus = inventory
      .map((item) => item.status)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    status = Object.keys(findStatus).splice(0, 3);
    category = inventory
      .map((item) => item.category)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    category = Object.keys(category);
    inven = inventory
      .map((item) => item.warehouse)
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});
    inven = Object.keys(inven);
  };
  sendData();

  const filterSearchFunc = (pro) => {
    return state.searchInput
      ? pro.filter((item) => {
          return (
            item.productName.includes(state.searchInput) ||
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
  const filterInventoryFunc = (pro) => {
    return state.filterInventory === "همه انبار ها"
      ? pro
      : pro.filter((item) => {
          return item.warehouse === state.filterInventory;
        });
  };

  let filterProdct = filterSearchFunc(inventory);
  filterProdct = filterStatusFunc(filterProdct);
  filterProdct = filterCategoryFunc(filterProdct);
  filterProdct = filterInventoryFunc(filterProdct);

  let { finalData, countPage, firstIndex, lastIndex } = paiginationFunc(
    filterProdct,
    10,
    param,
  );

  return (
    <div>
      <>
        <div className="w-full border border-gray-200 rounded-2xl overflow-hidden mt-8 shadow-sm bg-white dark:bg-gray-800">
          <FilterStoreroomItem
            status={status}
            category={category}
            inven={inven}
            state={state}
            dispatch={dispatch}
          />
          <div className="px-4 rounded-t-2xl overflow-hidden border-gray-200 pb-4">
            <table className="w-full shadow-sm  rounded-t-2xl overflow-hidden">
              <thead className="">
                <tr className="text-gray-600 bg-gray-300 dark:bg-gray-800 dark:text-white rounded-t-2xl text-center">
                  <th className=" px-2">محصول</th>
                  <th className="py-3 ">کد کالا</th>
                  <th>دسته بندی</th>
                  <th>موجودی</th>
                  <th>حداقل موجودی</th>
                  <th>حداکثر موجودی</th>
                  <th>انبار</th>
                  <th>واحد </th>
                  <th>اخرین بروزرسانی</th>
                  <th>وضعیت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {finalData.map((item) => (
                  <EnventoryItem
                    GetDataElemnt={GetDataElemnt}
                    key={item.id}
                    {...item}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mb-4 px-2">
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
    </div>
  );
}

export default StoreRoomContainer;
