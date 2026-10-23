import React from "react";
import TopPage from "../feature/components/TopPage";
import { IoIosSettings } from "react-icons/io";
import SettingContainer from "../components/setting/SettingContainer";

function Setting() {
  return (
    <div className="">
      <div className="flex items-center px-8 gap-2">
        <IoIosSettings className="size-8" />
        <TopPage name={"تنظیمات"} />
      </div>
      <SettingContainer />
    </div>
  );
}

export default Setting;
