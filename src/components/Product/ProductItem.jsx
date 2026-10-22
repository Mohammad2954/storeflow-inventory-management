import clsx from "clsx";
import { MdOutlineEditNote, MdOutlineModeEditOutline } from "react-icons/md";
import { TbTrash } from "react-icons/tb";

function ProductItem({
  id,
  name,
  sku,
  category,
  image,
  date,
  price,
  stock,
  Status,
  isActive,
  unit,
}) {
  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      <td className="py-2">
        <img
          src={image}
          alt={`${name}`}
          className="w-[60px] h-[60px] m-auto  rounded-sm shadow-sm"
        />
      </td>
      <td>{name}</td>
      <td>{sku}</td>
      <td>{category}</td>
      <td>{price.toLocaleString()}</td>
      <td>{`${stock} ${unit}`}</td>
      <td>
        <span
          className={clsx(
            Status === "موجود"
              ? "bg-success-bg text-success"
              : Status === "رو به اتمام"
                ? "bg-warning-bg text-warning"
                : Status === "ناموجود"
                  ? "bg-danger-bg text-danger"
                  : "",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {Status}
        </span>
      </td>
      <td>{date}</td>
      <td>
        <div className="flex items-center justify-center gap-3">
          <TbTrash className="text-gray-400 size-5" />
          <MdOutlineModeEditOutline className="text-gray-400 size-5" />
          {/* <MdOutlineEditNote className="text-blue-600 size-6" /> */}
        </div>
      </td>
    </tr>
  );
}

export default ProductItem;
