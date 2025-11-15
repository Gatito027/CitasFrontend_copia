import userPlaceholder from "../assets/placeholder_user_2.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MapaVisualizacion from "../components/MapaVisualizacion";
import toast from "react-hot-toast";
import { GetProfesionistaId } from "../infrastructure/GetProfesionistaId";
import { GetHorarioId } from "../infrastructure/GetHorarioId";
//import { useSub } from "../context/UseUserData";
import { useParams } from "react-router-dom";
import { ApprovateProfecionista } from "../infrastructure/ApprovateProfecionista";
import { SubmitCita } from "../infrastructure/SubmitCita";
import { useRol, useSub } from "../context/UseUserData";
import LoginPage from "./LoginPage";
import { GetValidToken } from "../infrastructure/GetValidToken";

export default function ProfesionistaInfoPage() {
  const { userRol } = useRol();
  const { userSub } = useSub();
  const { id } = useParams();
  const token = GetValidToken();
  const [isLoading, setIsLoading] = useState(false);
  const [helper, setHelper] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [name, setName] = useState("");
  const [categoria, setCategoria] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idProf, setIdProf] = useState(null);
  const [schedule, setSchedule] = useState([
    { day: "Lunes", hours: "Cerrado" },
    { day: "Martes", hours: "Cerrado" },
    { day: "Miércoles", hours: "Cerrado" },
    { day: "Jueves", hours: "Cerrado" },
    { day: "Viernes", hours: "Cerrado" },
    { day: "Sábado", hours: "Cerrado" },
    { day: "Domingo", hours: "Cerrado" },
  ]);

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const paddedHour = hour.padStart(2, "0");
    return `${paddedHour}:${minute}`;
  };

  const handleApprovate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await ApprovateProfecionista(token, helper, id);
      if (!result.success) {
        console.error(result.message);
        toast.error(`Error: ${result.message}`);
      } else {
        setIsValid(helper);
        setHelper(!helper);
        toast.success("Actualización exitosa");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCita = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const result = await SubmitCita({ userSub, idProf, token });
    //console.log(result);

    if (!result.success) {
      console.error(result.message);
      toast.error(`Error: ${result.message}`);
      return;
    }
    const { dia, hora } = result.data || {};
    toast.success(`Cita creada para el ${dia} a las ${hora}`);
  } catch (error) {
    console.error("Error al crear cita:", error);
    toast.error(`Error: ${error.message || "No se pudo crear la cita"}`);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetProfesionistaId(id, token);
        const data = response.data?.[0];
        //console.log(response);
        if (!response.success || !data) return;

        const proid = data.id;
        setCategoria(
          data.categoria?.trim() ? data.categoria : "Sin información"
        );
        setDescripcion(
          data.descripcion?.trim() ? data.descripcion : "Sin información"
        );
        setEmail(data.email?.trim() ? data.email : "Sin información");
        setFacebookUrl(data.facebook?.trim() ? data.facebook : "");
        setIsValid(data.isApprovated);
        setHelper(!data.isApprovated);
        setName(data.userName?.trim() ? data.userName : "Sin información");
        setTel(data.phoneNumber?.trim() ? data.phoneNumber : "Sin información");
        setUbicacion(
          data.ubicacion?.trim() ? data.ubicacion : "Sin información"
        );
        setIdProf(proid);

        const resHorario = await GetHorarioId(proid, token);
        const horarios = resHorario.data;

        if (!resHorario.success || !horarios || horarios.length === 0) return;

        const days = [
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ];

        const updatedSchedule = days.map((day) => {
          const match = horarios.find((h) => h.diaSemana === day);
          return match
            ? {
                day,
                hours:
                  match && match.isActivate
                    ? `${formatTime(match.horaInicio)} - ${formatTime(
                        match.horaFinal
                      )}`
                    : "Cerrado",
              }
            : {
                day,
                hours: "Cerrado",
              };
        });

        setSchedule(updatedSchedule);
      } catch (error) {
        toast.error("Este usuario no se ha podido cargar");
        console.error(error);
      }
    };

    fetchData();
  }, [id, token]);

  const socialLinks = [
    { icon: "facebook", name: "Facebook", url: facebookUrl },
  ];

  const isScheduleClosedAllWeek = schedule.every((day) => day.hours === "Cerrado");

  if (!userRol) {
    return <LoginPage />;
  }

  return (
    <div className="max-w-4xl mt-15 mx-auto px-6 py-8">
      {/* Header con imagen y información principal */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <img
              src={userPlaceholder}
              alt="Imagen de perfil"
              className="w-36 h-36 object-cover rounded-2xl border-4 border-white shadow-xl"
            />
            {userRol === "Administrador" && (
              <div
                className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white ${
                  isValid ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {name || "Nombre no disponible"}
              </h1>
              {userRol === "Administrador" && (
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isValid
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {isValid ? "✓ Validado" : "No validado"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {/* Categoría */}
              <span className="inline-flex items-center gap-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium">
                <span className="material-icons text-lg">work</span>
                {categoria || "Sin Caregoria"}
              </span>

              {/* Correo */}
              <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <span className="material-icons text-lg">mail</span>
                {email}
              </span>

              {/* Teléfono */}
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                <span className="material-icons text-lg">call</span>
                {tel}
              </span>

              <div className="w-full mt-1">
                {userRol === "Administrador" ? (
                  <button
                    onClick={(ev) => {
                      handleApprovate(ev);
                    }}
                    disabled={isLoading}
                    className={`w-full text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                      isValid
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
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
                    ) : isValid ? (
                      "Desaprobar"
                    ) : (
                      "Aprobar"
                    )}
                  </button>
                ) : (
                  <button
                  onClick={(ev) => {
                      handleCreateCita(ev);
                    }}
                    disabled={isScheduleClosedAllWeek || isLoading}
                    className="bg-sky-500 text-white py-3 px-4 w-full rounded-xl font-medium hover:bg-sky-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                    ) : isScheduleClosedAllWeek ? (
                      "Este profesional no tiene horarios disponibles esta semana"
                    ) : (
                      "Agendar cita"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons text-sky-600 text-2xl">
            location_on
          </span>
          <h2 className="text-xl font-semibold text-gray-800">Ubicación</h2>
        </div>
        <div className="flex items-start gap-3 mb-4">
          <span className="material-icons text-gray-500 text-lg">place</span>
          <p className="text-gray-700">{ubicacion || "Tepji del rio"}</p>
        </div>

        {/* Mapa visual */}
        <MapaVisualizacion ubicacion={ubicacion || "Tepji del rio"} />
      </section>

      {/* Grid de información */}
      <div className="mt-10 gap-8">
        {/* Columna izquierda */}
        <div className="space-y-8">
          {/* Descripción */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons text-sky-600 text-2xl">
                description
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                Descripción
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{descripcion}</p>
          </section>
        </div>

        {/* Columna derecha */}
        <div className="mt-10">
          {/* Redes sociales */}
          {facebookUrl && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-icons text-sky-600 text-2xl">
                  share
                </span>
                <h2 className="text-xl font-semibold text-gray-800">
                  Redes Sociales
                </h2>
              </div>
              <ul className="space-y-3">
                {socialLinks.map((social, index) => (
                  <li key={index}>
                    <a
                      href={social.url}
                      target="_blank"
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <span className="material-icons text-sky-600 text-xl group-hover:scale-110 transition-transform">
                        {social.icon}
                      </span>
                      <span className="text-gray-700 font-medium group-hover:text-sky-700 transition-colors">
                        {social.name}
                      </span>
                      <span className="material-icons text-gray-400 text-lg ml-auto">
                        arrow_forward
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Documentos 
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons text-sky-600 text-2xl">
                folder
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                Documentos
              </h2>
            </div>
            <ul className="space-y-3">
              {documents.map((doc, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="material-icons text-sky-600 text-lg">
                    description
                  </span>
                  <span className="text-gray-700">{doc}</span>
                  <button className="ml-auto text-sky-600 hover:text-sky-700 transition-colors">
                    <span className="material-icons text-lg">visibility</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>*/}

          {/* Horario */}
          <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons text-sky-600 text-2xl">
                schedule
              </span>
              <h2 className="text-xl font-semibold text-gray-800">Horario</h2>
            </div>
            <ul className="space-y-3">
              {schedule.map((day, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">{day.day}</span>
                  <span
                    className={`font-medium ${
                      day.hours === "Cerrado"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {day.hours}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
