import React from "react";
import { CiSearch } from "react-icons/ci";

function SearchBar() {
  return (
    <div className="relative">
      <CiSearch className=" absolute top-1.5 left-2" />
      <input
        type="text"
        className="outline-none border border-gray-400 rounded-full text-[12px] pr-2 py-1 w-74"
        placeholder="دنبال چی میگردید ؟"
      />
    </div>
  );
}

export default SearchBar;
