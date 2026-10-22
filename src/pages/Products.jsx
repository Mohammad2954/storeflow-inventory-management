import React from "react";
import TopPage from "../feature/components/TopPage";
import ProductContainer from "../components/Product/ProductContainer";
import { AiFillProduct } from "react-icons/ai";

function Products() {
  return (
    <div className="">
      <div className="flex items-center px-8 gap-2">
        <AiFillProduct className="size-8" />
        <TopPage name={"محصولات"} btn={"افزودن محصول"} />
      </div>
      <ProductContainer />
    </div>
  );
}

export default Products;
