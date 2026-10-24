import React from "react";
import TopPage from "../feature/components/TopPage";
import { TbReportSearch } from "react-icons/tb";
import ReportContainer from "../components/report/ReportContainer";
import CardSection from "../feature/Cards/CardSection";

function Reports() {
  return (
    <>
      <CardSection />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <TbReportSearch className="size-8" />
          <TopPage name={"گزارش ها"} />
        </div>
        <ReportContainer />
      </div>
    </>
  );
}

export default Reports;
