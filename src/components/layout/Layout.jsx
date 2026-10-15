import React from "react";
import { Outlet } from "react-router";
import SideBar from "../../feature/SideBar/SideBar";
import TopBar from "../../feature/TopBar/TopBar";

function Layout() {
  return (
    <>
      <div className="flex ">
        <SideBar />
        <div className="w-full">
          <TopBar />
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
