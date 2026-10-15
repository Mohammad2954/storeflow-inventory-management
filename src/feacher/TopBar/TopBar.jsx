import React from "react";
import Profile from "./components/Profile";

function TopBar() {
  return (
    <div className="border h-16 p-2">
      <Profile name={"محمد جواد"} owner={"مدیر فروشگاه"} />
    </div>
  );
}

export default TopBar;
