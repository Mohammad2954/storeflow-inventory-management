import clsx from "clsx";
import { MdOutlineEditNote, MdOutlineModeEditOutline } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import { getData } from "../../feature/Getdata/getData";
import toast from "react-hot-toast";
import AddProduct from "./AddProduct";
import { useState } from "react";

function ProductItem({
  id,
  name,
  sku,
  category,
  image,
  date,
  price,
  stock,
  status,
  isActive,
  unit,
  GetDataElemnt,
}) {
  const DeletItem = async () => {
    try {
      await getData(`products/${id}`, "DELETE");
      toast.success("محصول با موفقیت حذف شد");
    } catch (error) {
      toast.error(error.message || "حذف با شکست مواجه شد");
    }
  };

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
            stock > 10
              ? "bg-success-bg text-success"
              : stock >= 1
                ? "bg-warning-bg text-warning"
                : "bg-danger-bg text-danger",
            "rounded-full py-2 px-4 text-sm",
          )}
        >
          {stock > 10 ? "موجود" : stock >= 1 ? "رو به اتمام" : "ناموجود"}
        </span>
      </td>
      <td>{date.split("T")[0]}</td>
      <td>
        <div className="flex items-center justify-center gap-3">
          <TbTrash
            className="text-gray-400 size-5 hover:text-red-600 cursor-pointer"
            onClick={() => {
              DeletItem();
            }}
          />
          <MdOutlineModeEditOutline
            className="text-gray-400 size-5 hover:text-blue-800 cursor-pointer"
            onClick={() => {
              GetDataElemnt(id);
            }}
          />
          {/* <MdOutlineEditNote className="text-blue-600 size-6" /> */}
        </div>
      </td>
    </tr>
  );
}

export default ProductItem;
