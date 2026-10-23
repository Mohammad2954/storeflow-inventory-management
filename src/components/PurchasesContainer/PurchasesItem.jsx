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
      <td>{status}</td>
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
