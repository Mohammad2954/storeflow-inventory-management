import React from "react";
import { BrowserRouter, RouterProvider } from "react-router";
import roter from "./router/router";

function App() {
  return <RouterProvider router={roter} />;
}

export default App;
