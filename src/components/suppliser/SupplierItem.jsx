import clsx from "clsx";
import React from "react";
import { FaEye } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineModeEditOutline, MdOutlinePayment } from "react-icons/md";
import { RiShoppingBasket2Fill } from "react-icons/ri";

function SupplierItem({
  code,
  name,
  category,
  phone,
  totalPurchases,
  debt,
  status,
  contactPerson,
  getSuppliser,
  id,
  getSuppliserEdit,
}) {
  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      <td className="py-2">
        <div className="flex items-center flex-col text-right">
          <span className=" w-full pr-2">{name}</span>
          <span className="text-sm text-gray-400 w-full pr-3">{code}</span>
        </div>
      </td>
      <td>{category}</td>
      <td className="flex flex-col">
        <span>{phone}</span>
        <span className="text-[13px] font-bold">{contactPerson}</span>
      </td>
      <td>{totalPurchases ? totalPurchases.toLocaleString() : "Nan"}</td>
      <td>{debt ? debt.toLocaleString() : "Nan"}</td>
      <td>
        <span
          className={clsx(
            status === "active"
              ? "bg-success-bg text-success"
              : "bg-danger-bg text-danger",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {status}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-3">
          <FaEye
            className="text-gray-400 size-5 cursor-pointer hover:text-blue-500 transition duration-300 ease-in"
            onClick={() => {
              getSuppliser(id);
            }}
          />
          <MdOutlineModeEditOutline
            className="text-gray-400 size-5 cursor-pointer hover:text-blue-500 transition duration-300 ease-in"
            onClick={() => {
              getSuppliserEdit(id);
            }}
          />
          <RiShoppingBasket2Fill className="text-gray-400 size-5 cursor-pointer hover:text-blue-500 transition duration-300 ease-in" />
          <MdOutlinePayment className="text-gray-400 size-5 cursor-pointer hover:text-blue-500 transition duration-300 ease-in" />
        </div>
      </td>
    </tr>
  );
}

export default SupplierItem;
