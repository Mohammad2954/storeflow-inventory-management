import React from "react";
import Profile from "./components/Profile";
import SearchBar from "./components/SearchBar";

function TopBar() {
  return (
    <div className="border h-16 p-2 flex items-center justify-center">
      <Profile name={"محمد جواد"} owner={"مدیر فروشگاه"} />
      <SearchBar />
    </div>
  );
}

export default TopBar;
