import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const {
    setUser,
    setReady,
    setEdad,
    setEmail,
    setTelefono,
    setRol,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const logout = () => {
    // 1. Eliminar token
    localStorage.removeItem("token");

    // 2. Limpiar contexto
    setUser(null);
    setReady(false);
    setEdad(null);
    setEmail(null);
    setTelefono(null);
    setRol(null);

    // 3. Redirigir
    navigate("/login");
  };

  return logout;
}