import { MdOutlineElectricBolt } from "react-icons/md";
import { quickActions } from "../../data/quickActions";
import ShortcutItems from "./ShortcutItems";

function Shortcut() {
  return (
    <div className="w-full border border-gray-300  p-4 shadow-sm rounded-lg">
      <div className="flex items-center gap-0.5 mb-3">
        <MdOutlineElectricBolt className="text-accent-hover size-5" />
        <h2 className=" text-xl font-bold pr-1 pb-2">عملیات سریع</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((item) => {
          return <ShortcutItems key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
}

export default Shortcut;
