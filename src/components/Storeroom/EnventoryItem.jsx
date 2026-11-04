import clsx from "clsx";
import { useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";
import { MdOutlineEditNote, MdOutlineModeEditOutline } from "react-icons/md";
import { TbTrash } from "react-icons/tb";
import VolumeOperations from "./VolumeOperations";
import useFetch from "../../hooks/useFetch";
import { getData } from "../../feature/Getdata/getData";
import toast from "react-hot-toast";

function EnventoryItem({
  id,
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
  productId,
}) {
  const [show, setShow] = useState(false);
  const [increasShow, setincreasShow] = useState(false);
  const [decriseShow, setdecriseShow] = useState(false);
  const [val, setVal] = useState("");

  const changeValueProductInInventory = async (type) => {
    const x = await getData(`inventory/${id}/adjust`, "POST", {
      quantity: val,
      direction: `${type}`,
    });
    if (x.message === "موجودی اصلاح شد.") {
      toast.success("موجودی اصلاح شد.");
      setShow(false);
      setincreasShow(false);
      setdecriseShow(false);
      setVal("");
    }
  };

  return (
    <tr className="text-center mt-2 border-t border-gray-200">
      {/* <td className="">{id}</td> */}
      <td className="py-2 flex items-center gap-2 pr-3">
        <img
          src={`enventory/${productId}.jpg`}
          alt={`${productName}`}
          className="w-[60px] h-[60px]  rounded-sm shadow-sm"
        />
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
              : status === "کم‌موجود"
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
        <div className="flex items-center justify-center gap-3 relative">
          {/* <MdOutlineModeEditOutline className="text-gray-400 size-5" /> */}
          <BiDotsVerticalRounded
            className="text-gray-400 size-5 cursor-pointer hover:text-blue-400"
            onClick={() => {
              setShow(!show);
            }}
          />
          {show ? (
            <div className="w-32 flex items-center flex-col  bg-white shadow-sm rounded-lg  border border-gray-300 absolute left-12 ">
              <div
                onClick={() => {
                  setincreasShow(!increasShow);
                  if (decriseShow) {
                    setdecriseShow(!decriseShow);
                  }
                }}
                className="flex items-center gap-3  hover:text-accent-hover cursor-pointer p-1 justify-between"
              >
                <FaAngleDoubleUp className="size-4 text-green-400" />
                <span className="text-[12px] font-bold">افزایش موجودی</span>
              </div>
              {increasShow ? (
                <VolumeOperations
                  changeValueProductInInventory={changeValueProductInInventory}
                  text={"افزایش"}
                  val={val}
                  setVal={setVal}
                />
              ) : null}
              <div
                onClick={() => {
                  setdecriseShow(!decriseShow);
                  if (increasShow) {
                    setincreasShow(!increasShow);
                  }
                }}
                className="flex items-center gap-3  hover:text-red-400 cursor-pointer p-1 justify-between"
              >
                <FaAngleDoubleDown className="size-4 text-red-400" />
                <span className="text-[12px] font-bold">کاهش موجودی</span>
              </div>
              {decriseShow ? (
                <VolumeOperations
                  changeValueProductInInventory={changeValueProductInInventory}
                  text={"کاهش"}
                  val={val}
                  setVal={setVal}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

export default EnventoryItem;
