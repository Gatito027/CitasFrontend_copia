import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_AUTH_API + "/api/Users/Login";

export async function SubmitLogin({ loginEmail, password }) {
  const payload = {
    Email: loginEmail,
    Password: password,
  };

  try {
    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "POST",
    });

    const result = await response.json();
    //console.log(result.data);

    if (!result.success || result.data === null) {
      return {
        success: false,
        message: "Correo o contraseña no válida",
        data: result.data || null,
      };
    }

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: result.data,
      };
    }

    console.error(result.message || "Error en el servidor");

    return {
      success: false,
      message: result.message || "Correo o contraseña no válida",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error en SubmitLogin:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}