import { fetchFactory } from "../utils/FetchFactory";

export async function UpdateCita(token, idCita) {
  const url = `${import.meta.env.VITE_AGENDACitas_API}/api/Cita/actualizar-cita?idCita=${idCita}`;

  try {
    const response = await fetchFactory({
      url,
      contentType: "json",
      method: "PUT",
      token,
    });

    if (!response.ok) {
      console.error("Error HTTP:", response.status, response.statusText);
      return {
        success: false,
        message: "Error del servidor al actualizar la cita",
        data: null,
      };
    }

    const result = await response.json();
    console.log(result);

    // Verifica si la estructura esperada está presente
    if (result.mensaje && result.nuevoDia && result.nuevaHora) {
      return {
        success: true,
        message: result.mensaje,
        data: {
          dia: result.nuevoDia,
          hora: result.nuevaHora,
        },
      };
    }

    return {
      success: false,
      message: result.mensaje || "No se pudo actualizar la cita",
      data: null,
    };
  } catch (error) {
    console.error("Error en UpdateCita:", error);
    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}