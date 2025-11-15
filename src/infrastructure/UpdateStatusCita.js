import { fetchFactory } from "../utils/FetchFactory";

export async function UpdateStatusCita(token, status, idCita) {
  const url = `${import.meta.env.VITE_AGENDACitas_API}/api/Cita/approve/${idCita}`;
  const payload = { estado: status };

  try {
    const response = await fetchFactory({
      url,
      data: payload,
      contentType: "json",
      method: "PUT",
      token,
    });

    if (!response.ok) {
      console.error("Error HTTP:", response.status, response.statusText);
      return {
        success: false,
        message: "Error del servidor al actualizar el estado",
        data: null,
      };
    }

    const result = await response.json();
    console.log(result);

    if (result.success) {
      return {
        success: true,
        message: result.message,
        data: null,
      };
    }

    return {
      success: false,
      message: result.message || "No se pudo cambiar el estado",
      data: null,
    };
  } catch (error) {
    console.error("Error en UpdateStatus:", error);
    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}