import { fetchFactory } from "../utils/FetchFactory";


export async function GetProfesionistaId( userSub, token ) {
    const url = import.meta.env.VITE_PROFECIONISTA_API + "/api/Profesional/user/" + userSub;
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
