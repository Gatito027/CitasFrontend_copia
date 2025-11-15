//import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { useRol } from "../context/UseUserData";
import LoginPage from './LoginPage';
//import NoDisponibleComponent from "../components/NoDisponibleComponent";
import UserListComponent from "../components/UserListComponent";
import CitasListComponent from "../components/CitasListComponent";

export default function HomePage() {
  //const navigate = useNavigate();
  const { userRol } = useRol();
    if (!userRol) {
      return(
      <LoginPage />
      );
    }
    if (userRol === "Administrador"){
      return(<UserListComponent/>);
    }

  return (
    <CitasListComponent />
  );
}