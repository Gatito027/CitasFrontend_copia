import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_AUTH_API + "/api/Users";

export async function GetAllUsers( token ) {
    
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