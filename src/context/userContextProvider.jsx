import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [edad, setEdad] = useState(null);
  const [email, setEmail] = useState(null);
  const [telefono, setTelefono] = useState(null); // corregido
  const [rol, setRol] = useState(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        ready,
        setReady,
        edad,
        setEdad,
        email,
        setEmail,
        telefono,
        setTelefono,
        rol,
        setRol,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}