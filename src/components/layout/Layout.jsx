import React from "react";
import { Outlet } from "react-router";

function Layout() {
  return (
    <div>
      <div>mmmmmmmmmmmm</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
