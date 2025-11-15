import { useState, useEffect } from "react";
import { useSub } from "../context/UseUserData";
import toast from "react-hot-toast";
import { SubmitHorario } from "../infrastructure/SubmitHorario";
import { GetProfesionistaId } from "../infrastructure/GetProfesionistaId";
import { GetHorarioId } from "../infrastructure/GetHorarioId";
import { Link } from "react-router-dom";
import LoadingPageComponent from "./LoadingPageComponent";
import { GetValidToken } from "../infrastructure/GetValidToken";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function EditHorarioComponent() {
  const { userSub } = useSub();
  const [newHorario, setNewHorario] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [idProfesionista, setIdProfecionista] = useState(-1);
  const [loadingPage, setLoadingPage] = useState(true);
  var metod = "POST";
  const token = GetValidToken();

  const [schedule, setSchedule] = useState(
    days.map((day) => ({
      day,
      active: false,
      start: "09:00",
      end: "17:00",
      idHorario: 0,
    }))
  );

  const toggleDay = (index) => {
    const updated = [...schedule];
    updated[index].active = !updated[index].active;
    setSchedule(updated);
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (newHorario) {
      metod = "POST";
    } else {
      metod = "PUT";
    }
    const FormRequest = {
      schedule,
      idProfesionista,
      metod,
      token,
    };
    try {
      const result = await SubmitHorario({ FormRequest });
      if (!result.success) {
        console.log(result.message);
        toast.error("Error: ", result.message.toString());
      } else {
        toast.success("Horario guardado exitosamente");
      }
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
        if (!response.success || !response.data?.[0]) return;

        const id = response.data[0].id;
        setIdProfecionista(id);
        //console.log(idProfesionista);

        const resHorario = await GetHorarioId(id, token);
        const horarios = resHorario.data;

        if (!resHorario.success || !horarios || horarios.length === 0) return;

        const updatedSchedule = days.map((day) => {
          const match = horarios.find((h) => h.diaSemana === day);
          return match
            ? {
                day,
                active: match.isActivate,
                start: formatTime(match.horaInicio),
                end: formatTime(match.horaFinal),
                idHorario: match.idHorario,
              }
            : {
                day,
                active: false,
                start: "09:00",
                end: "17:00",
                idHorario: 0,
              };
        });

        setSchedule(updatedSchedule);
        setNewHorario(false);
      } catch (error) {
        toast.error(
          "No tienes un registro anterior o este no se ha podido cargar"
        );
        console.error(error);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchData();
  }, [userSub, token]);

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const paddedHour = hour.padStart(2, "0");
    return `${paddedHour}:${minute}`;
  };

  if(loadingPage){
    return <LoadingPageComponent />;
  }

  if (idProfesionista === -1) {
    return (
      <div className="mt-25 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-icons text-gray-400 text-6xl">
              person
            </span>
          </div>

          <h3 className="text-3xl font-semibold text-gray-800 mb-4">
            Perfil Incompleto
          </h3>

          <p className="text-gray-500 text-xl mb-10 leading-relaxed">
            Antes de continuar, necesitamos que completes la información de tu
            perfil
          </p>

          <Link
            to="/perfil"
            className="inline-flex items-center space-x-3 text-sky-500 hover:text-sky-600 font-semibold text-xl transition-colors duration-200 py-3 px-6 border-2 border-sky-500 hover:border-sky-600 hover:bg-sky-100 rounded-lg"
          >
            <span>Ir a Perfil</span>
            <span className="material-icons text-2xl">arrow_forward</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mt-20 mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="space-y-4">
        {schedule.map((item, index) => (
          <div
            key={item.day}
            className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 rounded-xl transition-all duration-200 ${
              item.active
                ? "bg-blue-50 border border-blue-200"
                : "bg-gray-50 border border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-4 min-w-[150px]">
              <span
                className={`font-medium w-28 ${
                  item.active ? "text-blue-700" : "text-gray-500"
                }`}
              >
                {item.day}
              </span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={() => toggleDay(index)}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 rounded-full peer ${
                    item.active ? "bg-blue-500" : "bg-gray-300"
                  } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}
                ></div>
              </label>
            </div>

            {item.active ? (
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={item.start}
                    onChange={(e) =>
                      handleTimeChange(index, "start", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={item.end}
                    onChange={(e) =>
                      handleTimeChange(index, "end", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="text-sm text-green-600 font-medium">Activo</div>
              </div>
            ) : (
              <span className="text-gray-400 text-sm font-medium">
                No laborable
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          disabled={isLoading}
          onClick={() =>
            setSchedule(
              days.map((day) => ({
                day: day,
                active: false,
                start: "09:00",
                end: "17:00",
              }))
            )
          }
          className="bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Limpiar
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            "Guardar Horario"
          )}
        </button>
      </div>
    </div>
  );
}
