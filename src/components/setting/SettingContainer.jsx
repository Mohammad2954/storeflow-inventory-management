import React from "react";
import ProfileSetting from "./components/ProfileSetting";
import NotificationSetting from "./components/NotificationSetting";
import StoreInfo from "./components/StoreInfo";

function SettingContainer() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      <ProfileSetting />
      <NotificationSetting />
      <StoreInfo />
    </div>
  );
}

export default SettingContainer;
