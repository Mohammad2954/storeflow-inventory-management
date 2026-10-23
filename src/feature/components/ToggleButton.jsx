import { useState } from "react";

function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setIsOn((prev) => !prev)}
      aria-label="تغییر وضعیت"
      aria-pressed={isOn}
      className={` cursor-pointer relative w-14 h-7 rounded-full transition-colors duration-300 ease-in-out ${
        isOn ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 right-1 h-5 w-5 rounded-full bg-white shadow-md
        transition-transform duration-300 ease-in-out ${
          isOn ? "-translate-x-7" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default ToggleButton;
