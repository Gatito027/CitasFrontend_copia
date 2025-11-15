import { fetchFactory } from "./fetchFactory"; 
const url = import.meta.env.VITE_AUTH_API + "/api/Users/AddNewUser";
//const url = "/api/Users/AddNewUser";


export async function submitRegister({ user, email, password, repetedPassword, edad, telefono, rol }) {
  if (password !== repetedPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  const payload = {
    Username: user,
    Email: email,
    Password: password,
    Age: edad,
    PhoneNumber: telefono,
    Role: rol,
  };

  const response = await fetchFactory({
    url: url, // reemplaza con tu endpoint real
    data: payload,
    contentType: "json",
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en el registro");
  }

  return await response.json();
}
