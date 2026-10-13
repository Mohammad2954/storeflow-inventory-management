import { createBrowserRouter } from "react-router";
import Layout from "../components/layout/Layout.jsx";
import Dashbord from "../pages/Dashbord.jsx";
import Products from "../pages/Products.jsx";
import Category from "../pages/Category.jsx";
import StoreRoom from "../pages/StoreRoom.jsx";
import Sales from "../pages/Sales.jsx";
import Purchases from "../pages/Purchases.jsx";
import Suppliers from "../pages/Suppliers.jsx";
import Reports from "../pages/Reports.jsx";
import Users from "../pages/Users.jsx";
import Setting from "../pages/Setting.jsx";
import Page404 from "../pages/Page404.jsx";

const roter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashbord /> },
      { path: "product", element: <Products /> },
      // { path: "category", element: <Category /> },
      { path: "storeroom", element: <StoreRoom /> },
      { path: "sales", element: <Sales /> },
      { path: "purchases", element: <Purchases /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "reports", element: <Reports /> },
      { path: "users", element: <Users /> },
      { path: "setting", element: <Setting /> },
      { path: "/*", element: <Page404 /> },
    ],
  },
]);

export default roter;
