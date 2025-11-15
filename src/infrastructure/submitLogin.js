import { fetchFactory } from "./fetchFactory"; 

const url = import.meta.env.VITE_AUTH_API + "/api/Users/Login";
//const url = "/api/Users/Login";

export async function submitLogin({ loginEmail, password }) {
  

  const payload = {
    email: loginEmail,
    password: password,
  };

  const response = await fetchFactory({
    url: url, // reemplaza con tu endpoint real
    data: payload,
    contentType: "json",
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en el login");
  }

  return await response.json();
}
