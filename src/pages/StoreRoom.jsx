import StoreRoomContainer from "../components/Storeroom/StoreRoomContainer";
import TopPage from "../feature/components/TopPage";
import { FaWarehouse } from "react-icons/fa";

function StoreRoom() {
  return (
    <>
      <div className="flex items-center px-8 gap-2">
        <FaWarehouse className="size-8" />
        <TopPage name={"انبار و موجودی"} btn={"افزودن موجودی"} />
      </div>
      <div>
        <StoreRoomContainer />
      </div>
    </>
  );
}

export default StoreRoom;
