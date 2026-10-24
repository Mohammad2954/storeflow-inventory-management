import clsx from "clsx";
import React from "react";
import { FaEye } from "react-icons/fa6";
import { HiDotsVertical } from "react-icons/hi";
import { MdOutlineEditNote, MdOutlineModeEditOutline } from "react-icons/md";
import { TbTrash } from "react-icons/tb";

function PurchasesItem({
  id,
  orderNumber,
  supplierId,
  supplierName,
  orderDate,
  expectedDate,
  receivedDate,
  status,
  itemsCount,
  totalAmount,
  shippingCost,
  description,
  items,
}) {
  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      <td className="py-4">{orderNumber}</td>
      <td>{supplierName}</td>
      <td>{orderDate}</td>
      <td>{itemsCount}</td>
      <td>{totalAmount.toLocaleString()}</td>
      <td>
        <span
          className={clsx(
            status === "تکمیل‌شده"
              ? "bg-success-bg text-success"
              : status === "در انتظار دریافت"
                ? "bg-warning-bg text-warning"
                : status === "لغوشده"
                  ? "bg-danger-bg text-danger"
                  : "",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {status}
        </span>
      </td>
      <td>{receivedDate ? receivedDate : "دریافت نشده"}</td>
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

export default PurchasesItem;
