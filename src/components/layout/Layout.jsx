import React from "react";
import { Outlet } from "react-router";
import SideBar from "../../feacher/SideBar/SideBar";

function Layout() {
  return (
    <div>
      <SideBar />
      {/* <TopBar/> */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
