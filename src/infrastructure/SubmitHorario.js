import { fetchFactory } from "../utils/FetchFactory";

export async function SubmitHorario({ FormRequest }) {
  const url = import.meta.env.VITE_PROFECIONISTA_API + `/api/Profesional/Horario/${FormRequest.idProfesionista}`;
  
  const payload = FormRequest.schedule.map((item) => ({
    idHorario: item.idHorario,
    idProfesional: FormRequest.idProfesionista,
    diaSemana: item.day,
    horaInicio: item.start,
    horaFinal: item.end,
    isActivate: item.active,
  }));

  //console.log(payload);
  try {
    //console.log(payload);
    const response = await fetchFactory({
      url: url, // reemplaza con tu endpoint real
      data: payload,
      contentType: "json",
      method: FormRequest.metod,
      token: FormRequest.token,
    });
    
    const result =await response.json();
    console.log(result);

    if (!result.success) {
      //console.log(result.data);
      return {
        success: false,
        message: `El dia ${FormRequest.item.day} no se guardo correctamente`,
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
    console.error("Error en submitHorario:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
