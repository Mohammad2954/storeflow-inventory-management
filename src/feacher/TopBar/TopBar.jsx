import React from "react";
import Profile from "./components/Profile";
import SearchBar from "./components/SearchBar";
import { BsBell } from "react-icons/bs";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegMoon } from "react-icons/fa";

function TopBar() {
  return (
    <div className="border h-16 px-10 py-2 flex items-center justify-between w-full">
      <Profile name={"محمد جواد"} owner={"مدیر فروشگاه"} />
      <SearchBar />
      <div className="flex items-center gap-2">
        <div className="bg-gray-100 rounded-full p-2">
          <FaRegMoon />
        </div>
        <div className="bg-gray-100 rounded-full p-2">
          <BiCommentDetail />
        </div>
        <div className="bg-gray-100 rounded-full p-2 relative">
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
