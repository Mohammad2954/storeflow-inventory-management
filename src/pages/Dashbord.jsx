import React from "react";
import Shortcut from "../components/dashbord/Shortcut";
import LineChart from "../components/dashbord/LineChart";

function Dashbord() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3">
        <Shortcut />
      </div>
      <div className="col-span-9 grid grid-cols-12">
        <div className="col-span-5">d</div>
        <div className="col-span-7">
          <LineChart />
        </div>
      </div>
    </div>
  );
}

export default Dashbord;
