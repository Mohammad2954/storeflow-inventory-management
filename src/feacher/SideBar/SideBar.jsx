import React from "react";
import TopSideBare from "./components/TopSideBar";

import Items from "./components/Items";
function SideBar() {
  return (
    <div className="bg-primary w-60 h-screen">
      <TopSideBare />
      <div className="flex items-center justify-center px-4">
        <Items />
      </div>
    </div>
  );
}

export default SideBar;
