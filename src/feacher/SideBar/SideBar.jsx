import React from "react";

function SideBar() {
  return (
    <div className="bg-primary w-60 h-screen">
      <div className="flex items-center mx-auto w-fit">
        <span className="text-white text-2xl font-bold">StoreFlow</span>
        <img src="/icon/header-icon.webp" alt="" className="size-16" />
      </div>
    </div>
  );
}

export default SideBar;
