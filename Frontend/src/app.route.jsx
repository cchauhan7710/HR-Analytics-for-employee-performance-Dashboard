import { createBrowserRouter, Navigate } from "react-router";
import Login from "./Features/Auth/Pages/Login.jsx";
import Register from "./Features/Auth/Pages/Register.jsx";
import Dashboard from "./Features/Dashboard/Pages/Dashboard.jsx";
import PrivateRoute from "./Features/Auth/Components/PrivateRoute.jsx";
import PublicOnlyRoute from "./Features/Auth/Components/PublicOnlyRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  // Catch-all redirect
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);