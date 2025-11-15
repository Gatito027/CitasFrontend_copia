import { useState, useEffect } from "react";
import { UpdateProfileShema } from "../utils/schema/UpdatePorfileSchema.js";
import toast from "react-hot-toast";
import { useEmail, useSub, useRol } from "../context/UseUserData";
import { UpdateProfile } from "../infrastructure/UpdateProfile.js";
import ProfileView from "./ProfileView.jsx";
import { RecuperarPerfil } from "../infrastructure/RecuperarPerfil.js";
import LoadingPageComponent from "./LoadingPageComponent";
import { GetValidToken } from "../infrastructure/GetValidToken";

export default function PerfilFormComponent() {
  const token = GetValidToken();
  const { userSub } = useSub();
  const { userRol } = useRol();
  const { userEmail } = useEmail();

  const [user, setUser] = useState();
  const [edad, setEdad] = useState();
  const [telefono, setTelefono] = useState();

  const [errors, setErrors] = useState({});
  const [edit, setEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const FormRequest = {
    userSub,
    userRol,
    user,
    userEmail,
    edad,
    telefono,
    token,
  }

  const validateField = (field, value) => {
    const formData = {
      user,
      edad,
      telefono,
      [field]: value,
    };

    const result = UpdateProfileShema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [field]: Array.isArray(fieldErrors[field])
          ? fieldErrors[field]
          : fieldErrors[field]
          ? [fieldErrors[field]]
          : [],
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = UpdateProfileShema.safeParse({ user, edad, telefono });

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const normalizedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, val]) => [
        key,
        Array.isArray(val) ? val : val ? [val] : [],
      ])
    );
    setErrors(normalizedErrors);
    toast.error("Por favor, corrige los errores en el formulario");
    return;
  }

  if (!userSub || !userRol || !token) {
    toast.error("Faltan datos esenciales para actualizar el perfil.");
    return;
  }

  try {
    setIsLoading(true);
    const result = await UpdateProfile({
     FormRequest
    });
    if (!result.success) {
        console.log(result.message);
        toast.error("Error: ", result.message.toString());
      } else {
        toast.success("Datos actualizados");
        setEdit(false);
      }
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }finally{
    setIsLoading(false);
    setErrors({});
  }
};

  const isFilled = () => user && edad && telefono;

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log(userSub);
        const response = await RecuperarPerfil({userSub, token});
        if (!response.success) {
          return;
        }

        if (response.success) {
          setUser(response.data.username);
          setEdad(response.data.age.toString());
          setTelefono(response.data.phoneNumber)
          //console.log(response);
        }
      } catch (error) {
        toast.error(
          "No se ha podido cargar"
        );
        console.log(error);
      } finally{
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [userSub, token]);

  if (loadingPage) {
      return <LoadingPageComponent />;
    }

  if (!edit){
    return <ProfileView profile={FormRequest} setEdit={setEdit} />;
  }

  return (
    <div className="w-full px-4 py-6">
  <div className="relative flex justify-center items-center mb-8">
    <h1 className="text-3xl sm:text-4xl font-bold text-sky-600 text-center">
      Actualizar datos personales
    </h1>
    <button 
      type="button" 
      onClick={() => setEdit(false)}
      className="flex items-center space-x-2 mx-5 px-4 py-2 border border-sky-200 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
    >
      <span className="material-icons text-xl">visibility</span>
      <span className="font-medium">Vista</span>
    </button>
  </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto">
        {/* Nombre */}
        <div>
          <input
            type="text"
            placeholder="Juan Pérez García"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              validateField("user", e.target.value);
            }}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.user?.length ? "border-red-500" : "border-white"
            }`}
            required
          />
          {errors.user?.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
              {errors.user.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            maxLength={10}
            onChange={(e) => {
              setTelefono(e.target.value);
              validateField("telefono", e.target.value);
            }}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.telefono?.length ? "border-red-500" : "border-white"
            }`}
            required
          />
          {errors.telefono?.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
              {errors.telefono.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Edad */}
        <div>
          <input
            type="text"
            placeholder="Edad"
            value={edad}
            maxLength={3}
            onChange={(e) => {
              setEdad(e.target.value);
              validateField("edad", e.target.value);
            }}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              errors.edad?.length ? "border-red-500" : "border-white"
            }`}
            required
          />
          {errors.edad?.length > 0 && (
            <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
              {errors.edad.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFilled() || isLoading}
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
            "Guardar"
          )}
        </button>
      </form>
    </div>
  );
}