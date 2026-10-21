import React from "react";
import TopPage from "../feature/components/TopPage";
import ProductContainer from "../components/Product/ProductContainer";

function Products() {
  return (
    <div className="">
      <TopPage name={"محصولات"} btn={"افزودن محصول"} />
      <ProductContainer />
    </div>
  );
}

export default Products;
