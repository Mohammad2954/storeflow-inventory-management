import React, { useState } from "react";
import TopPage from "../feature/components/TopPage";
import ProductContainer from "../components/Product/ProductContainer";
import { AiFillProduct } from "react-icons/ai";
import CardSection from "../feature/Cards/CardSection";
import AddProduct from "../components/Product/AddProduct";

function Products() {
  const [show, setShow] = useState(false);
  return (
    <>
      <CardSection />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <AiFillProduct className="size-8" />
          <TopPage
            name={"محصولات"}
            btn={"افزودن محصول"}
            func={() => {
              setShow(!show);
              console.log(show);
            }}
          />
        </div>
        <ProductContainer />
      </div>
      <div>
        {show ? (
          <AddProduct
            func={() => {
              setShow(!show);
              console.log(show);
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export default Products;
