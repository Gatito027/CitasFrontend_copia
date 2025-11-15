import { fetchFactory } from "../utils/FetchFactory";

export async function GetCitasProfecionista( idProf, token ) {
    const url = import.meta.env.VITE_AGENDACitas_API + "/api/Cita/profesional/" + idProf;
    const request = await fetchFactory({
        url: url,
        contentType: "json",
        method: "GET",
        token: token,
    });

    const response = await request.json();
    //console.log(response);
    if (!request.ok) {
        const errorData = await response;
        return errorData;
    }

    return await response;
}
