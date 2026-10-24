import clsx from "clsx";
import React from "react";

function LastBuyItem({
  orderNumber,
  description,
  supplierName,
  orderDate,
  receivedDate,
  status,
  itemsCount,
  totalAmount,
  shippingCost,
  expectedDate,
}) {
  return (
    <div className="border-b border-gray-300 flex items-center justify-between py-2">
      <div className="flex gap-4  flex-col">
        <span>{supplierName}</span>
        <div className="flex items-center  gap-4">
          <span className="text-sm text-gray-400">{expectedDate}</span>
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
        </div>
      </div>
      <div className="flex items-end flex-col gap-1">
        <span>{orderNumber}</span>
        <span>{description}</span>
        <span>{totalAmount.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default LastBuyItem;
