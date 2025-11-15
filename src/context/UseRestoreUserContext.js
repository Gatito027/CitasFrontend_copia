import { useEffect } from "react";
import { useRol, useUser, useEmail, useEdad, useSub,useTelefono } from "./UseUserData";
import { RecuperarPerfil } from "../infrastructure/RecuperarPerfil";

export function UseRestoreUserContext() {
  const { setUser } = useUser();
  const { setUserEmail } = useEmail();
  const { setEdad } = useEdad();
  const { setTelefono } = useTelefono();
  const { setRol } = useRol();
  const { setSub } = useSub();

  useEffect(() => {
    //console.log("Restaurando");
    const restore = async () => {
      const token = sessionStorage.getItem("token");
      const sub = sessionStorage.getItem("sub");
      const expiresAt = parseInt(sessionStorage.getItem("token_expires"), 10);

      if (!token || !sub || !expiresAt) return;

      if (Date.now() > expiresAt) {
        sessionStorage.clear();
        return;
      }

      const result = await RecuperarPerfil({ userSub: sub, token });

      if (result.success && result.data) {
        const { username, email, age, phoneNumber, role, id } = result.data;
        setUser(username);
        setUserEmail(email);
        setEdad(age);
        setTelefono(phoneNumber);
        setRol(role);
        setSub(id);
      } else {
        sessionStorage.clear(); // Token inválido o expirado
      }
    };

    restore();
  }, [setUser, setUserEmail, setEdad, setTelefono, setRol, setSub]);
}