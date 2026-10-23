import clsx from "clsx";
import React from "react";
import { BsThreeDots } from "react-icons/bs";

function SalesReportItem({
  id,
  name,
  sku,
  image,
  category,
  unitPrice,
  quantitySold,
  totalSales,
  salesShare,
  profit,
  status,
}) {
  console.log(image);

  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      <td className="px-2">{id}</td>
      <td className="py-2 flex items-center gap-1 pr-5">
        <img
          src={image}
          alt={`${name}`}
          className="w-[60px] h-[60px] rounded-sm shadow-sm"
        />
        <div className="flex flex-col text-right">
          <span>{name}</span>
          <span className="pr-2 text-sm">{sku}</span>
        </div>
      </td>
      <td>{category}</td>
      <td>{unitPrice.toLocaleString()}</td>
      <td>{quantitySold}</td>
      <td>{totalSales.toLocaleString()}</td>
      <td>{salesShare}%</td>
      <td>{profit.toLocaleString()}</td>

      <td>
        <span
          className={clsx(
            status === "best"
              ? "bg-success-bg text-success"
              : status === "medium"
                ? "bg-warning-bg text-warning"
                : status === "low"
                  ? "bg-danger-bg text-danger"
                  : "",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {status === "best"
            ? "پرفروش"
            : status === "medium"
              ? "متوسط"
              : status === "low"
                ? "کم فروش"
                : "اطلاعات در دسترس نیست"}
        </span>
      </td>
      <td>
        <div className="flex items-center justify-center gap-3">
          <BsThreeDots className="text-gray-400 size-5" />
        </div>
      </td>
    </tr>
  );
}

export default SalesReportItem;
