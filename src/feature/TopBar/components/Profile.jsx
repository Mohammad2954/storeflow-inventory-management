import React from "react";

function Profile({ name, owner }) {
  return (
    <div className="flex items-center gap-4">
      <img src="/topbar/prof.jpg" alt="" className=" rounded-full w-10" />
      <div className="flex flex-col">
        <span className="dark:text-white">{name}</span>
        <span className="text-[12px] text-gray-500 font-bold pr-2">
          {owner}
        </span>
      </div>
    </div>
  );
}

export default Profile;
