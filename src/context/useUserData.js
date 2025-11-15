import { useContext } from "react";
import { UserContext } from "./UserContext";

export const useEmail = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useEmail debe usarse dentro de UserContextProvider");
  }
  return { userEmail: context.email, setUserEmail: context.setEmail };
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserContextProvider");
  }
  return { userUser: context.user, setUser: context.setUser };
};

export const useTelefono = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useTelefono debe usarse dentro de UserContextProvider");
  }
  return { userTelefono: context.telefono, setTelefono: context.setTelefono };
};

export const useEdad = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useEdad debe usarse dentro de UserContextProvider");
  }
  return { userEdad: context.edad, setEdad: context.setEdad };
};

export const useRol = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useRol debe usarse dentro de UserContextProvider");
  }
  return { userRol: context.rol, setRol: context.setRol };
};