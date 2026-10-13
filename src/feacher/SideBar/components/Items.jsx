import React from "react";
import { NavLink } from "react-router";
import clsx from "clsx";
import { MdSpaceDashboard } from "react-icons/md";
import { AiFillProduct } from "react-icons/ai";
import { FaWarehouse } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";

const icons = {
  MdSpaceDashboard,
  AiFillProduct,
  FaWarehouse,
  FaShoppingBasket,
  FaTruck,
  FaUsers,
  FaUser,
  TbReportSearch,
  IoIosSettings,
};

function Items({ title, path, icon }) {
  const Icon = icons[icon];
  return (
    <NavLink
      to={path}
      className={({ isActive }) => {
        return clsx(
          isActive
            ? "bg-gradient-to-br from-green-400 via-green-500 to-green-600"
            : "",
          " text-white w-full py-2 flex items-center gap-4 pr-3 rounded-lg mt-1 ",
        );
      }}
    >
      <Icon />
      <span className="text-sm">{title}</span>
    </NavLink>
  );
}

export default Items;
