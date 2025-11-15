import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "../components/headerComponent";

export default function Layout (){
    return(
        <div>
            <Header />
            <Toaster position="top-right" />
            <Outlet />
        </div>
    );
}