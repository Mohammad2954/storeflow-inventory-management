import React from "react";
import DateOfReport from "./components/DateOfReport";
import LineChartReports from "./components/LineChartReports";
import CategorySalesChart from "./components/CategorySalesChart";

function ReportContainer() {
  return (
    <div>
      <div>
        <DateOfReport />
      </div>
      <div className="grid grid-cols-2 gap-6 mt-8">
        <CategorySalesChart />
        <LineChartReports />
      </div>
    </div>
  );
}

export default ReportContainer;
