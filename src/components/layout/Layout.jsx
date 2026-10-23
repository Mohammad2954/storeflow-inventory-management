import React from "react";
import { Outlet, ScrollRestoration } from "react-router";
import SideBar from "../../feature/SideBar/SideBar";
import TopBar from "../../feature/TopBar/TopBar";

function Layout() {
  return (
    <>
      <div className="flex ">
        <ScrollRestoration />
        <SideBar />
        <div className="w-full mr-60">
          <TopBar />
          <div className="p-4 dark:bg-gray-900 dark:text-white">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
