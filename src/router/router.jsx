import { createBrowserRouter } from "react-router";
import Layout from "../components/layout/Layout.jsx";
import Dashbord from "../pages/Dashbord.jsx";
import Products from "../pages/Products.jsx";

const roter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashbord /> },
      { path: "Products", element: <Products /> },
    ],
  },
]);

export default roter;
