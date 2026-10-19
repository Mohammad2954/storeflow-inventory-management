import React from "react";
import { BsFillBarChartFill } from "react-icons/bs";
import { FaRegFileAlt } from "react-icons/fa";
import { SlBasketLoaded } from "react-icons/sl";
import { VscDiffAdded } from "react-icons/vsc";
import ShortcutItems from "./ShortcutItems";

function Shortcut() {
  const quickActions = [
    {
      id: 1,
      title: "افزودن محصول",
      icon: VscDiffAdded,
      path: "/products/new",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 2,
      title: "ثبت فروش",
      icon: SlBasketLoaded,
      path: "/sales/new",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 3,
      title: "خرید جدید",
      icon: FaRegFileAlt,
      path: "/purchases/new",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: 4,
      title: "گزارش فروش",
      icon: BsFillBarChartFill,
      path: "/reports/sales",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
    },
  ];
  return (
    <div className="w-full">
      <h2>میانبر</h2>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((item) => {
          return <ShortcutItems key={item.id} {...item} />;
        })}
      </div>
    </div>
  );
}

export default Shortcut;
