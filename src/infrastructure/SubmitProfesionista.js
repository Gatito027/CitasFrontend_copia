import { fetchFactory } from "../utils/FetchFactory";

var url = import.meta.env.VITE_PROFECIONISTA_API + "/api/Profesional";
//const url = "/p/api/Profesional";

export async function SubmitProfecionista({ FormRequest }) {

  if(FormRequest.metod === "PUT"){
    url=import.meta.env.VITE_PROFECIONISTA_API + "/api/Profesional"+"/"+FormRequest.idProfesionista;
  }
  //console.log(FormRequest.idProfesionista);

  const payload = {
    id: FormRequest.idProfesionista,
    idUsuario: FormRequest.userSub,
    descripcion: FormRequest.descripcion,
    ubicacion: FormRequest.ubicacion,
    facebook: FormRequest.facebook,
    categoria:
      FormRequest.categoria === "Otro"
        ? FormRequest.categoriaPersonalizada
        : FormRequest.categoria,
    imagen: "https://static.vecteezy.com/system/resources/previews/036/594/092/original/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg",//FormRequest.imgPerfil,
    rfc: "https://www.orimi.com/pdf-test.pdf",//FormRequest.rfc,
    cedula: "https://www.orimi.com/pdf-test.pdf",//FormRequest.cedula,
    licencia: "https://www.orimi.com/pdf-test.pdf",//FormRequest.licencia
  };

  //console.log(payload);
  try {
    const response = await fetchFactory({
      url: url, // reemplaza con tu endpoint real
      data: payload,
      contentType: "json",
      method: FormRequest.metod,
      token: FormRequest.token,
    });
    const result = await response.json();

    if (!result.success) {
      //console.log(result.data);
      return {
        success: false,
        message: "Un dato o mas no fue recibido",
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

  } catch (error) {
    console.error("Error en submitProfecionista:", error);

    return {
      success: false,
      message: "Servicio no disponible",
      data: null,
    };
  }
}
