import { createBrowserRouter } from "react-router";
import Login from "./Features/Auth/Pages/Login.jsx";
import Register from "./Features/Auth/Pages/Register.jsx";
import Home from "./Features/Auth/Pages/Home.jsx";
import Dashboard from "./Features/Dashboard/Pages/Dashboard.jsx";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element : <Register/>

    },
    {
        path:"/",
        element:<Dashboard/>
    }
])