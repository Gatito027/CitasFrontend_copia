import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const {
    setUser,
    setEdad,
    setEmail,
    setTelefono,
    setRol,
    setSub,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const logout = () => {
    // 1. Eliminar token
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("sub");
    sessionStorage.removeItem("token_expires");

    // 2. Limpiar contexto
    setUser(null);
    setEdad(null);
    setEmail(null);
    setTelefono(null);
    setRol(null);
    setSub(null);

    // 3. Redirigir
    navigate("/login");
  };

  return logout;
}