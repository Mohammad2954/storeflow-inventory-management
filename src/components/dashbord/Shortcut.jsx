import React from "react";
import ShortcutItems from "./ShortcutItems";

function Shortcut() {
  const quickActions = [
    {
      id: 1,
      title: "افزودن محصول",
      icon: MdAddBox,
      path: "/products/new",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      title: "ثبت فروش",
      icon: MdShoppingCart,
      path: "/sales/new",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      title: "خرید جدید",
      icon: MdInsertDriveFile,
      path: "/purchases/new",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 4,
      title: "گزارش فروش",
      icon: MdBarChart,
      path: "/reports/sales",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];
  return (
    <div className="w-full">
      <h2>میانبر</h2>
      <div>
        <ShortcutItems />
        <ShortcutItems />
        <ShortcutItems />
        <ShortcutItems />
      </div>
    </div>
  );
}

export default Shortcut;
