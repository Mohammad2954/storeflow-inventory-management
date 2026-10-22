import React from "react";
import TopPage from "../feature/components/TopPage";
import SuppliserContainer from "../components/suppliser/SuppliserContainer";
import { FaUsers } from "react-icons/fa";

function Suppliers() {
  return (
    <div className="">
      <div className="flex items-center px-8 gap-2">
        <FaUsers className="size-8" />
        <TopPage name={"تامین کنندگان"} btn={"افزودن تامین کننده"} />
      </div>
      <SuppliserContainer />
    </div>
  );
}

export default Suppliers;
