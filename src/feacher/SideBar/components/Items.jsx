import React from "react";
import { NavLink } from "react-router";
import clsx from "clsx";
import { HiHome } from "react-icons/hi";

function Items({}) {
  return (
    <NavLink
      to={"product"}
      className={({ isActive }) => {
        return clsx(
          isActive ? "bg-accent" : "",
          "text-lg text-white w-full py-2 flex items-center gap-4 pr-3 rounded-lg",
        );
      }}
    >
      <HiHome />
      داشبرد
    </NavLink>
  );
}

export default Items;
