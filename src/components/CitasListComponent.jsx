import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useRol, useSub } from "../context/UseUserData";
import { GetCitasCliente } from "../infrastructure/GetCitasCliente";
import { GetCitasProfecionista } from "../infrastructure/GetCitasProfecionista";
import { GetProfesionistaId } from "../infrastructure/GetProfesionistaId";
import toast from "react-hot-toast";
import { UpdateStatusCita } from "../infrastructure/UpdateStatusCita";
import { UpdateCita } from "../infrastructure/UpdateCita";
import { GetValidToken } from "../infrastructure/GetValidToken";

export default function CitasListComponent() {
  const { userRol } = useRol();
  const { userSub } = useSub();
  const token = GetValidToken();
  const [citas, setCitas] = useState([]);
  //const [selectedCitaId, setSelectedCitaId] = useState(null);
  const today = new Date();
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState(
    today.toISOString().split("T")[0]
  ); // formato YYYY-MM-DD
  //console.log(filtroFecha);
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [ignorarFecha, setIgnorarFecha] = useState(true);

  const [loadingCitaId, setLoadingCitaId] = useState(null); // null o el id de la cita en proceso
  const [loadingCancelCitaId, setLoadingCancelCitaId] = useState(null);
  const [loadingAtenderCitaId, setLoadingAtenderCitaId] = useState(null);
  const [loadingUpdateCitaId, setLoadingUpdateCitaId] = useState(null);

  const isPast = (fecha, hora) => {
    const citaDate = new Date(`${fecha}T${hora}`);
    return citaDate < new Date();
  };

  const isWithin24Hours = (fecha, hora) => {
    const citaDate = new Date(`${fecha}T${hora}`);
    const now = new Date();
    const diff = citaDate - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000; // dentro de 24 horas
  };

  const citasFiltradas = citas.filter((cita) => {
    const coincideNombre = cita.nombre
      .toLowerCase()
      .includes(filtroNombre.toLowerCase());
    const coincideFecha =
      ignorarFecha || (filtroFecha ? cita.fecha === filtroFecha : true);
    const coincideCategoria = cita.categoria
      .toLowerCase()
      .includes(filtroCategoria.toLowerCase());
    const coincideStatus =
      filtroStatus === ""
        ? true
        : filtroStatus === "Sin atender"
        ? cita.status === "Por atender" && isPast(cita.fecha, cita.hora)
        : cita.status === filtroStatus;
    return (
      coincideNombre && coincideFecha && coincideCategoria && coincideStatus
    );
  });

  const handleConfirmCita = async (e, idCita) => {
    e.preventDefault();
    setLoadingCitaId(idCita); // activa solo el botón correspondiente
    try {
      const result = await UpdateStatusCita(token, "Por atender", idCita);
      if (!result.success) {
        console.error("Error al actualizar estado:", result.message);
        toast.error(`Error: ${result.message}`);
        return;
      }
      toast.success("Estado actualizado correctamente");
      await fetchData();
    } catch (error) {
      console.error("Error inesperado en handleConfirmCita:", error);
      toast.error(
        `Error: ${error.message || "No se pudo actualizar el estado"}`
      );
    } finally {
      setLoadingCitaId(null); // libera el botón
    }
  };

  const handleCancelCita = async (e, idCita) => {
    e.preventDefault();
    setLoadingCancelCitaId(idCita); // activa solo el botón correspondiente
    try {
      const result = await UpdateStatusCita(token, "Cancelada", idCita);
      if (!result.success) {
        console.error("Error al actualizar estado:", result.message);
        toast.error(`Error: ${result.message}`);
        return;
      }
      toast.success("Estado actualizado correctamente");
      await fetchData();
    } catch (error) {
      console.error("Error inesperado en handleConfirmCita:", error);
      toast.error(
        `Error: ${error.message || "No se pudo actualizar el estado"}`
      );
    } finally {
      setLoadingCancelCitaId(null); // libera el botón
    }
  };

  const handleAtenderCita = async (e, idCita) => {
    e.preventDefault();
    setLoadingAtenderCitaId(idCita); // activa solo el botón correspondiente
    try {
      const result = await UpdateStatusCita(token, "Atendida", idCita);
      if (!result.success) {
        console.error("Error al actualizar estado:", result.message);
        toast.error(`Error: ${result.message}`);
        return;
      }
      toast.success("Estado actualizado correctamente");
      await fetchData();
    } catch (error) {
      console.error("Error inesperado en handleConfirmCita:", error);
      toast.error(
        `Error: ${error.message || "No se pudo actualizar el estado"}`
      );
    } finally {
      setLoadingAtenderCitaId(null); // libera el botón
    }
  };

  const handleUpdateCita = async (e, idCita) => {
    e.preventDefault();
    setLoadingUpdateCitaId(idCita); // activa solo el botón correspondiente

    try {
      const result = await UpdateCita(token, idCita);

      if (!result.success) {
        console.error("Error al actualizar cita:", result.message);
        toast.error(`Error: ${result.message}`);
        return;
      }

      const { dia, hora } = result.data || {};
      const mensaje = result.message || "Cita actualizada correctamente";

      toast.success(
        `${mensaje}${dia && hora ? ` para el ${dia} a las ${hora}` : ""}`
      );
      await fetchData();
    } catch (error) {
      console.error("Error inesperado en handleUpdateCita:", error);
      toast.error(`Error: ${error.message || "No se pudo actualizar la cita"}`);
    } finally {
      setLoadingUpdateCitaId(null); // libera el botón
    }
  };

  const fetchData = useCallback(async () => {
    try {
      if (userRol === "Cliente") {
        const response = await GetCitasCliente(userSub, token);
        if (!response.success || !response.data?.length) return;

        const mappedCitas = response.data.map((cita) => ({
          id: cita.idCita,
          idProfecionista: cita.idUsuarioProfesional,
          nombre: cita.nombreProfesionista,
          categoria: cita.categoria ?? "Sin información",
          fecha: cita.dia,
          hora: cita.hora,
          status: cita.estado ?? "Sin información",
        }));

        setCitas(mappedCitas);
      } else {
        const profecionistaData = await GetProfesionistaId(userSub, token);
        const idProf = profecionistaData?.data?.[0]?.id;
        if (!idProf) return;

        const response = await GetCitasProfecionista(idProf, token);
        if (!response.success || !response.data?.length) return;

        const mappedCitas = response.data.map((cita) => ({
          id: cita.idCita,
          idProfecionista: cita.idCliente,
          nombre: cita.nombreCliente,
          categoria: "Sin información",
          fecha: cita.dia,
          hora: cita.hora,
          status: cita.estado ?? "Sin información",
        }));

        setCitas(mappedCitas);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
      toast.error("No se ha podido cargar las citas");
    }
  }, [userRol, userSub, token]); // dependencias necesarias

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-6xl mx-auto mt-15 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <span className="material-icons text-white mr-3 text-3xl">
              alarm
            </span>
            Citas Registradas
          </h2>
          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
            Total: {citasFiltradas.length} citas
          </span>
        </div>
      </div>

      {/*Buscador*/}
      <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Nombre */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Fecha + Switch */}
          <div>
            <div className="flex items-center space-x-3">
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                disabled={ignorarFecha}
                className={`px-3 py-2 border rounded-lg text-sm w-full ${
                  ignorarFecha
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
              {/* Switch */}
              <label
                className="flex items-center cursor-pointer"
                title="Ver todas las fechas?"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={ignorarFecha}
                    onChange={(e) => setIgnorarFecha(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-sky-500 transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Categoría */}
          {userRol === "Cliente" && (
            <div className="relative">
              <span className="material-icons absolute left-3 top-2.5 text-gray-400 text-base">
                category
              </span>
              <input
                type="text"
                placeholder="Categoría"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          )}

          {/* Estado */}
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="">Todos los estados</option>
              <option value="Por aceptar">Por aceptar</option>
              <option value="Por atender">Por atender</option>
              <option value="Atendida">Atendida</option>
              <option value="Cancelada">Cancelada</option>
              <option value="Sin atender">Sin atender</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla mejorada */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-sky-50 border-b border-gray-200">
              <th className="p-4 font-semibold text-gray-700 text-left">
                Información de la Cita
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Estado
              </th>
              <th className="p-4 font-semibold text-gray-700 text-center">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {citasFiltradas
              .slice() // para no mutar el original
              .sort((a, b) => {
                const fechaA = new Date(`${a.fecha}T${a.hora}`);
                const fechaB = new Date(`${b.fecha}T${b.hora}`);
                return fechaA.getTime() - fechaB.getTime(); // ascendente
              })
              .map((cita) => (
                <tr
                  className="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200"
                  key={cita.id}
                >
                  <td className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="material-icons text-white text-lg">
                            person
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {cita.nombre}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          {userRol === "Cliente" && (
                            <div className="flex items-center">
                              <span className="material-icons text-sky-500 text-base mr-2">
                                work
                              </span>
                              <span>{cita.categoria}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="material-icons text-sky-500 text-base mr-2">
                              event
                            </span>
                            <span>{cita.fecha}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="material-icons text-sky-500 text-base mr-2">
                              schedule
                            </span>
                            <span>{cita.hora}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {cita.status === "Por aceptar" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          <span className="material-icons text-amber-500 text-base mr-1">
                            pending
                          </span>
                          {cita.status}
                        </span>
                      ) : cita.status === "Por atender" &&
                        isPast(cita.fecha, cita.hora) ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          <span className="material-icons text-red-500 text-base mr-1">
                            error
                          </span>
                          Sin atender
                        </span>
                      ) : cita.status === "Por atender" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          <span className="material-icons text-green-500 text-base mr-1">
                            alarm
                          </span>
                          {cita.status}
                        </span>
                      ) : cita.status === "Atendida" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800 border border-sky-200">
                          <span className="material-icons text-sky-500 text-base mr-1">
                            check_circle
                          </span>
                          {cita.status}
                        </span>
                      ) : cita.status === "Cancelada" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                          <span className="material-icons text-red-500 text-base mr-1">
                            cancel
                          </span>
                          {cita.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <span className="material-icons text-gray-500 text-base mr-1">
                            question_mark
                          </span>
                          {cita.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      {userRol === "Cliente" && (
                        <Link
                          to={`/profesionista/${cita.idProfecionista}`}
                          className="flex items-center justify-center w-10 h-10 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 hover:text-sky-700 transition-all duration-200 transform hover:scale-105 shadow-sm"
                          title="Ver detalles del profecionista"
                        >
                          <span className="material-icons text-lg">
                            visibility
                          </span>
                        </Link>
                      )}
                      {userRol === "Profesionista" &&
                        cita.status === "Por aceptar" && (
                          <button
                            key={`aceptar-${cita.id}`} // clave única
                            disabled={loadingCitaId === cita.id}
                            onClick={(e) => handleConfirmCita(e, cita.id)}
                            className="flex items-center justify-center w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 hover:text-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title={
                              loadingCitaId === cita.id
                                ? "Procesando..."
                                : "Aceptar cita"
                            }
                          >
                            {loadingCitaId === cita.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-emerald-600"
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
                            ) : (
                              <span className="material-icons text-lg">
                                check_circle
                              </span>
                            )}
                          </button>
                        )}

                      {((cita.status === "Por atender" &&
                        !isWithin24Hours(cita.fecha, cita.hora)) ||
                        cita.status === "Por aceptar") &&
                        !isPast(cita.fecha, cita.hora) && (
                          <button
                            key={`cancelar-${cita.id}`} // clave única
                            disabled={loadingCancelCitaId === cita.id}
                            onClick={(e) => handleCancelCita(e, cita.id)}
                            className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title={
                              loadingCancelCitaId === cita.id
                                ? "Procesando..."
                                : "Cancelar cita"
                            }
                          >
                            {loadingCancelCitaId === cita.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-red-600"
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
                            ) : (
                              <span className="material-icons text-lg">
                                cancel
                              </span>
                            )}
                          </button>
                        )}
                      {cita.status !== "Atendida" &&
                        cita.status !== "Cancelada" &&
                        !isWithin24Hours(cita.fecha, cita.hora) &&
                        !isPast(cita.fecha, cita.hora) && (
                          <button
                            key={`actualizar-${cita.id}`} // clave única
                            disabled={loadingUpdateCitaId === cita.id}
                            onClick={(e) => handleUpdateCita(e, cita.id)}
                            className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 hover:text-orange-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title={
                              loadingUpdateCitaId === cita.id
                                ? "Procesando..."
                                : "Reagendar"
                            }
                          >
                            {loadingUpdateCitaId === cita.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-orange-600"
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
                            ) : (
                              <span className="material-icons text-lg">
                                pending
                              </span>
                            )}
                          </button>
                        )}
                      {userRol === "Profesionista" &&
                        cita.status === "Por atender" &&
                        isWithin24Hours(cita.fecha, cita.hora) && (
                          <button
                            key={`atender-${cita.id}`}
                            disabled={loadingAtenderCitaId === cita.id}
                            onClick={(e) => handleAtenderCita(e, cita.id)}
                            className="flex items-center justify-center w-10 h-10 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 hover:text-sky-700 transition-all duration-200 transform hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            title={
                              loadingAtenderCitaId === cita.id
                                ? "Procesando..."
                                : "Atender cita"
                            }
                          >
                            {loadingAtenderCitaId === cita.id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-sky-600"
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
                            ) : (
                              <span className="material-icons text-lg">
                                event
                              </span>
                            )}
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {citasFiltradas.length <= 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Icono ilustrativo */}
            <div className="mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-icons text-gray-400 text-4xl">
                    event_busy
                  </span>
                </div>
                <div className="absolute -inset-2 bg-gray-100 rounded-full blur-sm opacity-50"></div>
              </div>
            </div>

            {/* Texto principal */}
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No hay citas registradas
            </h3>

            {/* Descripción */}
            <p className="text-gray-500 max-w-md mb-6 leading-relaxed">
              No se encontraron citas programadas en este momento. Las nuevas
              citas aparecerán aquí una vez que sean agendadas.
            </p>

            {/* Acción sugerida */}
            {userRol === "Cliente" && (
              <Link
                to="/directorio"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
              >
                <span className="material-icons text-lg mr-2">add</span>
                Agendar primera cita
              </Link>
            )}
          </div>
        )}
      </div>
      {/* Footer de la tabla */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center">
            <span className="material-icons text-sky-500 text-base mr-2">
              info
            </span>
            <span>
              Mostrando {citasFiltradas.length} de {citas.length} citas
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
