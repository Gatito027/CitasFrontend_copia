import { useState, useEffect } from "react";
import ModalPDFViewer from "./ModalPDFViewer";
import toast from "react-hot-toast";
//import userPlaceholder from "../assets/placeholder_user_2.png";
import { perfilProfesionalSchema } from "../utils/schema/PerfilSchema";
import MapaUbicacion from "./MapaUbicacion";
import { useSub } from "../context/UseUserData";
import { SubmitProfecionista } from "../infrastructure/SubmitProfesionista";
import { GetProfesionistaId } from "../infrastructure/GetProfesionistaId";
import ProfecionistaView from "./ProfecionistaView";
import LoadingPageComponent from "./LoadingPageComponent";
import { GetValidToken } from "../infrastructure/GetValidToken";

export default function FormularioProfecionistaComponent() {
  const [isValid, setIsValid] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [facebook, setFacebook] = useState("");
  const [rfc, setRfc] = useState(null);
  const [licencia, setLicencia] = useState(null);
  const [cedula, setCedula] = useState(null);
  const [archivoActivo] = useState(null);
  const [imgPerfil, setImgPerfil] = useState(null);
  const [idProfesionista, setIdProfecionista] = useState(0);

  //const imagenDefault = userPlaceholder;
  const [edit, setEdit] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  var metod = "POST";
  const { userSub } = useSub();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const token = GetValidToken();
  const [newPorfile, setNewPorfile] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);

  const validarCampo = (campo, valor) => {
    const formData = {
      descripcion,
      categoria,
      categoriaPersonalizada,
      ubicacion,
      facebook,
      [campo]: valor,
    };

    const result = perfilProfesionalSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [campo]: Array.isArray(fieldErrors[campo])
          ? fieldErrors[campo]
          : fieldErrors[campo]
          ? [fieldErrors[campo]]
          : [],
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [campo]: [],
      }));
    }
  };

  /*const handleArchivoPDF = (ev, tipo) => {
    const file = ev.target.files?.[0];

    if (!file) return;

    if (file.type === "application/pdf") {
      switch (tipo) {
        case "RFC":
          setRfc(file);
          break;
        case "Licencia":
          setLicencia(file);
          break;
        case "Cedula":
          setCedula(file);
          break;
        default:
          console.warn(`Tipo de documento desconocido: ${tipo}`);
      }
    } else {
      toast.error("Por favor selecciona un archivo PDF válido.");
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPorfile) {
      metod = "POST";
    } else {
      metod = "PUT";
    }
    const FormRequest = {
      userSub,
      descripcion,
      ubicacion,
      facebook,
      categoria,
      categoriaPersonalizada,
      imgPerfil,
      rfc,
      cedula,
      licencia,
      token,
      metod,
      idProfesionista,
    };
    try {
      const resultShema = perfilProfesionalSchema.safeParse({
        descripcion,
        categoria,
        categoriaPersonalizada,
        ubicacion,
        facebook,
      });

      if (!resultShema.success) {
        const fieldErrors = resultShema.error.flatten().fieldErrors;
        const normalizedErrors = Object.fromEntries(
          Object.entries(fieldErrors).map(([key, val]) => [
            key,
            Array.isArray(val) ? val : val ? [val] : [],
          ])
        );
        setErrors(normalizedErrors);
        console.log(resultShema);
        toast.error("Por favor, corrige los errores en el formulario");
        return;
      }
      const result = await SubmitProfecionista({ FormRequest });
      if (!result.success) {
        console.log(result.message);
        toast.error("Error: ", result.message.toString());
      } else {
        toast.success("Actualizacion exitosa");
        setEdit(false);
        setNewPorfile(false);
      }
      //console.log(FormRequest);
    } catch (error) {
      toast.error("Error: ", error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetProfesionistaId(userSub, token);
        if (!response.success) {
          return;
        }

        if (response.success) {
          setIdProfecionista(response.data[0].id);
          setCategoria("Otro");
          setCategoriaPersonalizada(response.data[0].categoria);
          setDescripcion(response.data[0].descripcion);
          setUbicacion(response.data[0].ubicacion);
          setFacebook(response.data[0].facebook);
          setImgPerfil(response.data[0].imagen);
          setRfc(response.data[0].rfc);
          setCedula(response.data[0].cedula);
          setLicencia(response.data[0].licencia);
          setIsValid(response.data[0].isApprovated);
          setNewPorfile(false);
          setEdit(false);
          //console.log(response.data[0]);
        }
      } catch (error) {
        toast.error(
          "No tienes un registro anterior o este no se ha podido cargar"
        );
        console.log(error);
      } finally{
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [userSub, token]);

  const FormProfile = {
  descripcion,
  ubicacion,
  facebook,
  categoriaPersonalizada: categoria !== "Otro" ? categoria : categoriaPersonalizada,
  idProfesionista,
  isValid,
};
  //console.log(FormProfile);
  if (loadingPage) {
    return <LoadingPageComponent />;
  }

  if (!edit) {
    return <ProfecionistaView profecionista={FormProfile} setEdit={setEdit} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Título */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Título y badge alineados */}
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-sky-600">
            Perfil Profesional
          </h1>
          <span
            className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${
              isValid
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isValid ? "Aprobado" : "No aprobado"}
          </span>
        </div>

        {/* Botón de vista */}
        {!newPorfile && (
          <button
            type="button"
            onClick={() => setEdit(false)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-sky-300 text-sky-600 hover:bg-sky-50 hover:border-sky-400 rounded-lg transition-all duration-200"
          >
            <span className="material-icons text-xl">visibility</span>
            <span className="font-semibold">Vista</span>
          </button>
        )}
      </div>

      <form
        encType="multipart/form-data"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Imagen y descripción */}
        <fieldset className="flex gap-6 items-start">
          <legend className="sr-only">Imagen y descripción</legend>

          {/* Imagen */}
          {/*<label className="relative group cursor-pointer">
            <img
              src={
                imgPerfil
                  ? typeof imgPerfil === "string"
                    ? imgPerfil // URL remota
                    : URL.createObjectURL(imgPerfil) // Archivo local
                  : imagenDefault
              }
              alt="Imagen de perfil"
              className="w-48 h-48 object-cover rounded-full border-2 border-sky-300 shadow-sm transition group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-icons text-white text-5xl">upload</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(ev) => {
                const file = ev.target.files[0];
                if (file?.type.startsWith("image/")) {
                  setImgPerfil(file); // Guarda el File
                } else {
                  toast.error("Por favor selecciona una imagen válida.");
                }
              }}
              className="hidden"
            />
          </label>*/}

          {/* Descripción + errores */}
          <div className="flex-1 flex flex-col">
            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(ev) => {
                const val = ev.target.value;
                setDescripcion(val);
                validarCampo("descripcion", val);
              }}
              required
              maxLength={255}
              className="h-48 px-4 py-2 border border-sky-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {errors.descripcion?.length > 0 && (
              <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                {errors.descripcion.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        {/* Categoría */}
        <fieldset>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(ev) => {
              const val = ev.target.value;
              setCategoria(val);
              validarCampo("categoria", val);
            }}
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          >
            <option value="">Selecciona una categoría</option>
            {[
              "Médico",
              "Estilista",
              "Pediatra",
              "Abogado",
              "Contratista",
              "Veterinario",
              "Carpintero",
              "Contador",
              "Otro",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.categoria?.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
              {errors.categoria.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          {categoria === "Otro" && (
            <input
              type="text"
              placeholder="Especifica la categoría"
              value={categoriaPersonalizada}
              onChange={(ev) => {
                const val = ev.target.value;
                setCategoriaPersonalizada(val);
                validarCampo("categoriaPersonalizada", val);
              }}
              className="mt-2 w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          )}
          {errors.categoriaPersonalizada?.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
              {errors.categoriaPersonalizada.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* Ubicación y servicios */}
        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          required
          maxLength={225}
          onChange={(ev) => {
            const val = ev.target.value;
            setUbicacion(val);
            validarCampo("ubicacion", val);
          }}
          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        {/* Mapa interactivo */}
        <MapaUbicacion ubicacion={ubicacion} setUbicacion={setUbicacion} />
        {errors.ubicacion?.length > 0 && (
          <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
            {errors.ubicacion.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        {/* Redes Sociales */}
        <fieldset>
          <legend className="text-lg font-semibold text-sky-600 mb-2">
            Redes Sociales
          </legend>

          {[
            {
              icon: "facebook",
              value: facebook,
              setter: setFacebook,
              placeholder: "Facebook",
              name: "facebook",
            },
          ].map(({ icon, value, setter, placeholder, name }, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-sky-600">{icon}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={(ev) => {
                    const val = ev.target.value;
                    setter(val);
                    validarCampo(name, val);
                  }}
                  className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              {errors[name]?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors[name].map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </fieldset>

        {/*<fieldset>
          <legend className="text-lg font-semibold text-sky-600 mb-2">
            Documentos
          </legend>
          {[
            { label: "RFC", file: rfc, tipo: "RFC" },
            { label: "Licencia comercial", file: licencia, tipo: "Licencia" },
            { label: "Cédula", file: cedula, tipo: "Cedula" },
          ].map(({ label, file, tipo }, idx) => (
            <div key={idx} className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{label}</label>
              <div className="flex items-center gap-2">
                {file && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setArchivoActivo({ tipo, file });
                        setMostrarModal(true);
                      }}
                      className="text-sky-700 hover:underline text-sm"
                    >
                      {file.name}
                    </button>

                    {!newPorfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setArchivoActivo({ tipo, file });
                          setMostrarModal(true);
                        }}
                        className="material-icons text-sky-600 hover:text-sky-800 text-base"
                        title={`Ver ${label}`}
                      >
                        visibility
                      </button>
                    )}
                  </>
                )}

                <label className="material-icons cursor-pointer text-sky-600 hover:text-sky-800">
                  upload_file
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(ev) => handleArchivoPDF(ev, tipo)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ))}
        </fieldset>*/}

        {/* Botón */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Procesando...
            </div>
          ) : (
            "Guardar perfil"
          )}
        </button>
      </form>

      {/* Modal PDF */}
      {mostrarModal && archivoActivo && (
        <ModalPDFViewer
          titulo={archivoActivo.tipo}
          archivo={archivoActivo.file}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>
  );
}
