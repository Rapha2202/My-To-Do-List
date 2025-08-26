import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "./scrollbar.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profil from "./pages/Profil";
import Verify from "./pages/Auth/Verify";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetPasswordToken from "./pages/Auth/ResetPasswordToken";
import CGU from "./pages/CGU";
import List from "./pages/List";
import OneList from "./pages/OneList";
import DeleteAccount from "./pages/Auth/DeleteAccount";

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
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profil",
        element: <Profil />,
      },
      {
        path: "/verify/:token",
        element: <Verify />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPasswordToken />,
      },
      {
        path: "/cgu",
        element: <CGU />,
      },
      {
        path: "/list",
        element: <List />,
      },
      {
        path: "/list/:listId",
        element: <OneList />,
      },
      {
        path: "delete-account",
        element: <DeleteAccount />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);
