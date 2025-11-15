import { fetchFactory } from "../utils/FetchFactory";

export async function ApprovateProfecionista(token, isValid, id) {
  const url = import.meta.env.VITE_PROFECIONISTA_API + `/api/Profesional/approve/${id}`;
  
  const payload = {
    IsApprovated: isValid,
  }

  try {
    const response = await fetchFactory({
      url: url, // reemplaza con tu endpoint real
      data: payload,
      contentType: "json",
      method: "PUT",
      token: token,
    });
    
    const result =await response.json();
    console.log(result);

    if (!result.success) {
      //console.log(result.data);
      return {
        success: false,
        message: `No se pudo validar`,
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
      message: result.message || "Error al actualizar",
      data: result.data || null,
    };
    //return true;

  } catch (error) {
    console.error("Error en ApprovateProfecionista:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
