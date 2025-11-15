import { fetchFactory } from "../utils/FetchFactory";

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

  try {
    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "POST",
    });

    const result = await response.json();
    //console.log(result);
    if (!result.success) {
      return {
        success: false,
        message: "Correo no válido",
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

    const errorData = await response.json();
    console.error(errorData.message || "Error en el registro");

    return {
      success: false,
      message: "Error al registrar",
      data: errorData,
    };
  } catch (error) {
    console.error("Error en submitRegister:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}