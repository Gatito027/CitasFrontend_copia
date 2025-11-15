import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./HeaderComponent";
import { UseRestoreUserContext } from "../context/UseRestoreUserContext";

export default function Layout (){
    UseRestoreUserContext();
    return(
        <div>
            <Header />
            <Toaster position="top-right" />
            <Outlet />
        </div>
    );
}