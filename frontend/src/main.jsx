import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "./scroll.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import List from "./pages/List";
import OneList from "./pages/OneList";
import Profil from "./pages/Profil";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "list/:id",
        element: <OneList />,
      },
      {
        path: "profil",
        element: <Profil />,
      },
    ],
  },
  /* {
    path: "*",
    element: <Page404 />,
  }, */
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
