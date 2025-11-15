import { GetAllProfecionistas } from "./GetAllProfecionistas";

export async function EstadisticasUbicacion(token) {
  const response = await GetAllProfecionistas(token);

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error("No se pudieron obtener los profesionistas correctamente.");
  }

  const conteoEstados = {};

  for (const profesional of response.data) {
    const ubicacion = profesional.ubicacion?.trim() || "";

    let estado = "Sin estado";

    if (ubicacion.toLowerCase() !== "string" && ubicacion.includes("México")) {
      const partes = ubicacion.split(",").map(p => p.trim());
      const indexMexico = partes.lastIndexOf("México");

      if (indexMexico >= 1) {
        estado = partes[indexMexico - 1];
      }
    }

    if (conteoEstados[estado]) {
      conteoEstados[estado]++;
    } else {
      conteoEstados[estado] = 1;
    }
  }

  return conteoEstados;
}