import {
  SlBasketLoaded,
} from "react-icons/sl";
import { VscDiffAdded } from "react-icons/vsc";
import { FaRegFileAlt } from "react-icons/fa";
import { BsFillBarChartFill } from "react-icons/bs";

export const quickActions = [
  {
    id: 1,
    title: "ثبت فروش جدید",
    path: "/sales/new",
    icon: SlBasketLoaded,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 2,
    title: "ثبت خرید جدید",
    path: "/purchases/new",
    icon: FaRegFileAlt,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "افزودن محصول",
    path: "/products/new",
    icon: VscDiffAdded,
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    id: 4,
    title: "گزارش فروش",
    path: "/reports/sales",
    icon: BsFillBarChartFill,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];