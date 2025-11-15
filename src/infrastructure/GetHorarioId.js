import { fetchFactory } from "../utils/FetchFactory";


export async function GetHorarioId( idProfesionista, token ) {
    const url = import.meta.env.VITE_PROFECIONISTA_API + "/api/Profesional/Horario/" + idProfesionista;

    const request = await fetchFactory({
        url: url,
        contentType: "json",
        method: "GET",
        token: token,
    });

    const response = await request.json();
    //console.log(response);
    if (!request.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en al obtener");
    }

    return await response;
}
