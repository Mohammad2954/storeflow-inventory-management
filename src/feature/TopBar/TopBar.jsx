import React, { useState } from "react";
import Profile from "./components/Profile";
import SearchBar from "./components/SearchBar";
import { BsBell } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegMoon, FaSun } from "react-icons/fa";

function TopBar() {
  const [them, setThem] = useState("sun");
  const ChangeThem = () => {
    if (them === "sun") {
      setThem("dark");
      document.documentElement.classList.add("dark");
    } else {
      setThem("sun");
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <div className="border-b-2 border-gray-300 h-16 px-10 py-2 flex items-center justify-between w-full dark:bg-gray-900 dark:border-gray-700">
      <Profile name={"محمد جواد"} owner={"مدیر فروشگاه"} />
      <SearchBar />
      <div className="flex items-center gap-2">
        <div
          className="bg-gray-100 dark:bg-gray-600 rounded-full p-2 cursor-pointer"
          onClick={() => {
            ChangeThem();
          }}
        >
          {them === "sun" ? <FaRegMoon /> : <FaSun />}
        </div>
        <div className="bg-gray-100 dark:bg-gray-600 rounded-full p-2">
          <BiCommentDetail />
        </div>
        <div className="bg-gray-100 dark:bg-gray-600 rounded-full p-2 relative">
          <div className="bg-green-300 text-center rounded-full w-4 h-4 text-[10px] flex items-center justify-center text-white absolute -right-0.5 -top-0.5">
            3
          </div>
          <BsBell />
        </div>
      </div>
    </div>
  );
}

export default TopBar;
