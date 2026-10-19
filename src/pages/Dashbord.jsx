import React from "react";
import Shortcut from "../components/dashbord/Shortcut";

function Dashbord() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4">
        <Shortcut />
      </div>
      <div className="col-span-8">x</div>
    </div>
  );
}

export default Dashbord;
