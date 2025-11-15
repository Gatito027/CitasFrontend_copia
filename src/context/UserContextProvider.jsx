import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserContextProvider({ children }) {
  const [sub, setSub] = useState(null);
  const [user, setUser] = useState(null);
  const [edad, setEdad] = useState(null);
  const [email, setEmail] = useState(null);
  const [telefono, setTelefono] = useState(null); // corregido
  const [rol, setRol] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        edad,
        setEdad,
        email,
        setEmail,
        telefono,
        setTelefono,
        rol,
        setRol,
        sub,
        setSub
      }}
    >
      {children}
    </UserContext.Provider>
  );
}