import { fetchFactory } from "../utils/FetchFactory";

const url = import.meta.env.VITE_AGENDACitas_API + `/api/Cita/crear-cita`;

export async function SubmitCita({ userSub, idProf, token }) {
    const payload = {
        IdCliente: userSub,
        IdProfesional: idProf,
    };

    try {
        const response = await fetchFactory({
            url,
            data: payload,
            contentType: "json",
            method: "POST",
            token,
        });

        // Verifica si la respuesta HTTP fue exitosa
        if (!response.ok) {
            console.error("Error HTTP:", response.status, response.statusText);
            return {
                success: false,
                message: "Error del servidor al agendar la cita",
                data: null,
            };
        }

        const result = await response.json();

        // Manejo de estructura esperada en respuesta exitosa
        if (result.mensaje && result.dia && result.hora) {
            return {
                success: true,
                message: result.mensaje,
                data: {
                    dia: result.dia,
                    hora: result.hora,
                },
            };
        }

        // Si no cumple con la estructura esperada
        return {
            success: false,
            message: "Respuesta inesperada del servidor",
            data: result,
        };
    } catch (error) {
        console.error("Error en SubmitCita:", error);

        return {
            success: false,
            message: "Servicio no disponible",
            data: null,
        };
    }
}