import { FaBoxOpen, FaTruck, FaExclamationTriangle } from "react-icons/fa";

export const dashboardCards = [
  {
    id: 1,
    title: "محصولات رو به اتمام",
    value: 12,
    link: "مشاهده لیست",
    path: "/inventory",
    icon: FaBoxOpen,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    id: 2,
    title: "تعداد تأمین‌کنندگان",
    value: 6,
    link: "مشاهده لیست",
    path: "/suppliers",
    icon: FaTruck,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: 3,
    title: "محصولات کمبود موجودی",
    value: 7,
    link: "مشاهده لیست",
    path: "/inventory",
    icon: FaExclamationTriangle,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];