import { fetchFactory } from "../utils/FetchFactory";

export async function UpdateProfile({ FormRequest }) {
  const url = import.meta.env.VITE_AUTH_API + "/api/Users/"+ FormRequest.userSub;

  const payload = {
    id: FormRequest.userSub,
    userName: FormRequest.user,
    email: FormRequest.userEmail,
    age: FormRequest.edad,
    phoneNumber: FormRequest.telefono,
    role: FormRequest.userRol,
  };

  //console.log(FormRequest.token);

  try {
    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "PUT",
      token: FormRequest.token,
    });

    const result = await response.json();
    //console.log(result);
    if (!result.success) {
      return {
        success: false,
        message: "No se pudo actualizar",
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