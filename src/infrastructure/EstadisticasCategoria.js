import { GetAllProfecionistas } from "./GetAllProfecionistas";

export async function EstadisticasCategoria(token) {
  const response = await GetAllProfecionistas(token);

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error("No se pudieron obtener los profesionistas correctamente.");
  }

  const conteoCategorias = {};

  for (const profesional of response.data) {
    const categoria = profesional.categoria?.trim() || "Sin categoría";

    if (conteoCategorias[categoria]) {
      conteoCategorias[categoria]++;
    } else {
      conteoCategorias[categoria] = 1;
    }
  }

  return conteoCategorias;
}