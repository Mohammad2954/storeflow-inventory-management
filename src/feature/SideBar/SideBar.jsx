import React from "react";
import TopSideBare from "./components/TopSideBar";
import { sidebarItems } from "./../../data/sidebarItems.js";
import Items from "./components/Items";
function SideBar() {
  return (
    <div className="bg-primary w-60 h-screen fixed right-0 border-l border-gray-700">
      <TopSideBare />
      <div className="flex-col items-center justify-center px-4">
        {sidebarItems.map((item) => {
          return <Items key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
}

export default SideBar;
