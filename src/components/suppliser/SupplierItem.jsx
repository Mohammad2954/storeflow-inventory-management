import clsx from "clsx";
import React from "react";
import { FaEye } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineModeEditOutline } from "react-icons/md";

function SupplierItem({
  code,
  name,
  category,
  phone,
  totalPurchases,
  debt,
  status,
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
      <td>{phone}</td>
      <td>{totalPurchases.toLocaleString()}</td>
      <td>{debt.toLocaleString()}</td>
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
          <FaEye className="text-gray-400 size-5" />
          <MdOutlineModeEditOutline className="text-gray-400 size-5" />
          <HiDotsVertical className="text-gray-400 size-5" />
        </div>
      </td>
    </tr>
  );
}

export default SupplierItem;
