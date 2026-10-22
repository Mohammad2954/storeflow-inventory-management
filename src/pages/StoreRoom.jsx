import StoreRoomContainer from "../components/Storeroom/StoreRoomContainer";
import TopPage from "../feature/components/TopPage";

function StoreRoom() {
  return (
    <>
      <div>
        <TopPage name={"انبار و موجودی"} btn={"افزودن موجودی"} />
      </div>
      <div>
        <StoreRoomContainer />
      </div>
    </>
  );
}

export default StoreRoom;
