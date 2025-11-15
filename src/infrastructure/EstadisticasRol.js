import { GetAllUsers } from "./GetAllUsers";

export async function EstadisticasRol(token) {
  const response = await GetAllUsers(token);

  if (!response.success || !Array.isArray(response.data)) {
    throw new Error("No se pudieron obtener los usuarios correctamente.");
  }

  const conteoRoles = {
    Cliente: 0,
    Profesionista: 0,
    Administrador: 0,
    Otros: 0,
  };

  for (const usuario of response.data) {
    switch (usuario.role) {
      case "Cliente":
        conteoRoles.Cliente++;
        break;
      case "Profesionista":
        conteoRoles.Profesionista++;
        break;
      case "Administrador":
        conteoRoles.Administrador++;
        break;
      default:
        conteoRoles.Otros++;
        break;
    }
  }

  return conteoRoles;
}