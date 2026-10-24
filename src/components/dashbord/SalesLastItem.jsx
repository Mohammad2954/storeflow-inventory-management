import clsx from "clsx";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

function SalesLastItem({
  id,
  invoiceNumber,
  customer,
  date,
  time,
  totalAmount,
  discount,
  paymentMethod,
  status,
}) {
  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      <td className="py-4">{invoiceNumber}</td>
      <td className="">
        <span>{date}</span>
        <span className="ml-3">{time}</span>
      </td>
      <td className="px-2">{customer}</td>
      <td>{totalAmount.toLocaleString()}</td>
      <td className="px-2">{paymentMethod}</td>
      <td>
        <span
          className={clsx(
            status === "در حال پردازش"
              ? "bg-success-bg text-success"
              : status === "تکمیل شده"
                ? "bg-warning-bg text-warning"
                : status === "لغو شده"
                  ? "bg-danger-bg text-danger"
                  : "",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {status}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-3">
          <BsThreeDotsVertical className="text-gray-400 size-5" />
        </div>
      </td>
    </tr>
  );
}

export default SalesLastItem;
