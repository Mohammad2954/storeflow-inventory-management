import React from "react";

function ProductItem({ img, name, date, price, Inventory, Status }) {
  return (
    <tr className="text-center">
      <td>
        <img src={img} alt={`${name}`} className="w-[50px] m-auto" />
      </td>
      <td>{name}</td>
      <td>{date}</td>
      <td>{price}</td>
      <td>{Inventory}</td>
      <td>{Status}</td>
      <td>xxx</td>
    </tr>
  );
}

export default ProductItem;
