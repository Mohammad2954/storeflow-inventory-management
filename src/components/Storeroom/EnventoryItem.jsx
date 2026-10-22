import clsx from "clsx";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { MdOutlineEditNote, MdOutlineModeEditOutline } from "react-icons/md";
import { TbTrash } from "react-icons/tb";

function EnventoryItem({
  productName,
  category,
  quantity,
  minQuantity,
  maxQuantity,
  warehouse,
  lastUpdated,
  status,
  sku,
  unit,
}) {
  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      {/* <td className="">{id}</td> */}
      <td className="py-2">
        {/* <img
          src={image}
          alt={`${productName}`}
          className="w-[60px] h-[60px] m-auto  rounded-sm shadow-sm"
        /> */}
        <span>{productName}</span>
      </td>
      <td>{sku}</td>
      <td>{category}</td>
      <td>{quantity}</td>
      <td>{minQuantity}</td>
      <td>{maxQuantity}</td>
      <td>{warehouse}</td>
      <td>{unit}</td>
      <td>{lastUpdated}</td>
      <td>
        <span
          className={clsx(
            status === "موجود"
              ? "bg-success-bg text-success"
              : status === "کمبود موجودی"
                ? "bg-warning-bg text-warning"
                : status === "ناموجود"
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
          <MdOutlineModeEditOutline className="text-gray-400 size-5" />
          <BiDotsVerticalRounded className="text-gray-400 size-5" />
        </div>
      </td>
    </tr>
  );
}

export default EnventoryItem;
