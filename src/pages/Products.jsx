import React from "react";
import TopPage from "../feature/components/TopPage";
import ProductContainer from "../components/Product/ProductContainer";

function Products() {
  return (
    <div>
      <TopPage name={"محصولات"} btn={"افزودن محصول"} />
      <ProductContainer />
    </div>
  );
}

export default Products;
