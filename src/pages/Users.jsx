import React from "react";
import TopPage from "../feature/components/TopPage";
import { FaUser } from "react-icons/fa";
import UsersContainer from "../components/users/UsersContainer";
import CardSection from "../feature/Cards/CardSection";

function Users() {
  return (
    <>
      <CardSection />
      <div className="">
        <div className="flex items-center px-8 gap-2">
          <FaUser className="size-8" />
          <TopPage name={"مشتریان"} btn={"افزودن مشتری"} />
        </div>
        <UsersContainer />
      </div>
    </>
  );
}

export default Users;
