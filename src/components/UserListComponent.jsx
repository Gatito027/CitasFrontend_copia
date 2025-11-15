import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import userPlaceholder from "../assets/placeholder_user_2.png";
import { GetAllProfecionistas } from "../infrastructure/GetAllProfecionistas";
import toast from "react-hot-toast";
import { useRol } from "../context/UseUserData";
import { GetValidToken } from "../infrastructure/GetValidToken";

export default function UserListComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [validationFilter, setValidationFilter] = useState("all");
  const [professionFilter, setProfessionFilter] = useState("all");
  const [ubicacionFilter, setUbicacionFilter] = useState("all");
  const token = GetValidToken();
  const { userRol } = useRol();

  // Datos de ejemplo para los profesionales
  const [professionals, setProfessionals] = useState([]);

  // Filtrar profesionales
  const filteredProfessionals = professionals.filter((professional) => {
    const matchesSearch = professional.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesValidation =
      userRol === "Cliente"
      ? professional.validated // 👈 solo mostrar validados para Cliente
      : validationFilter === "all" ||
      (validationFilter === "validated" && professional.validated) ||
      (validationFilter === "not-validated" && !professional.validated);
    const matchesProfession =
      professionFilter === "all" ||
      professional.professionLabel
        .toLowerCase()
        .includes(professionFilter.toLowerCase());
    const matchesUbicacion =
      ubicacionFilter === "all" || 
      professional.location
        .toLowerCase()
        .includes(ubicacionFilter.toLowerCase());

    return matchesSearch && matchesValidation && matchesProfession && matchesUbicacion;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await GetAllProfecionistas(token);
        if (!response.success || !response.data?.length) return;

        const mappedProfessionals = response.data.map((prof) => ({
          id: prof.idUsuario,
          name: prof.userName ?? "Sin información",
          profession: prof.categoria ?? "Sin información",
          professionLabel: prof.categoria ?? "Sin información",
          location: prof.ubicacion ?? "Sin información",
          validated: prof.isApprovated,
          image: userPlaceholder,
        }));

        setProfessionals(mappedProfessionals);
      } catch (error) {
        toast.error("Ocurrió un error y no se han podido cargar los perfiles");
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="container mx-auto mt-15 p-4">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-sky-500 mb-4 flex items-center gap-2">
          <span className="material-icons">filter_list</span>
          Filtros de Búsqueda
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Buscador por nombre */}
          {userRol ===  "Cliente" && (<>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="material-icons text-sm">search</span>
              Buscar por nombre
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ej: Dr. Juan Pérez..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
              />
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                search
              </span>
            </div>
          </div></>)}

          {/* Buscador por ubicacion */}
          {userRol ===  "Cliente" && (<>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="material-icons text-sm">location_on</span>
              Ubicacion
            </label>
            <input
              type="text"
              placeholder="Ej: Calle Universidad, Tula, Hidalgo..."
              value={ubicacionFilter === "all" ? "" : ubicacionFilter}
              onChange={(e) => setUbicacionFilter(e.target.value.trim())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div></>)}

          {/* Filtro por validación */}
          {userRol ===  "Administrador" && (<>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="material-icons text-sm">verified</span>
              Estado de validación
            </label>
            <select
              value={validationFilter}
              onChange={(e) => setValidationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="validated">Solo validados</option>
              <option value="not-validated">Solo no validados</option>
            </select>
          </div></>)}

          {/* Filtro por profesión */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span className="material-icons text-sm">work</span>
              Profesión
            </label>
            <input
              type="text"
              placeholder="Ej: Doctor, Abogado, Arquitecto..."
              value={professionFilter === "all" ? "" : professionFilter}
              onChange={(e) => setProfessionFilter(e.target.value.trim())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex justify-between items-center">
          {userRol ===  "Administrador" && (
          <span className="text-sm text-gray-600">
            {filteredProfessionals.length} de {professionals.length}{" "}
            profesionales encontrados
          </span>)}

          {/* Botones para limpiar filtros */}
          {(searchTerm ||
            validationFilter !== "all" ||
            ubicacionFilter !== "all" ||
            professionFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setValidationFilter("all");
                setProfessionFilter("all");
                setUbicacionFilter("all");
              }}
              className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
            >
              <span className="material-icons text-sm">clear_all</span>
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Grid de profesionales */}
      {filteredProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
          {filteredProfessionals.map((professional) => (
            <Link
              to={`/profesionista/${professional.id}`}
              key={professional.id}
              className="block h-full"
            >
              <div className="bg-white shadow-lg rounded-xl overflow-hidden p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100 flex flex-col justify-between h-full min-h-[400px]">
                <div className="relative">
                  <img
                    src={professional.image}
                    alt="UserProfileImage"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {userRol ===  "Administrador" && (
                  <div className="absolute top-3 right-3">
                    <span
                      className={`${
                        professional.validated
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1`}
                    >
                      <span className="material-icons text-sm">
                        {professional.validated ? "check_circle" : "cancel"}
                      </span>
                      {professional.validated ? "Validado" : "No validado"}
                    </span>
                  </div>)}
                </div>

                <div className="mt-4">
                  <h2 className="text-xl text-sky-600 font-bold">
                    {professional.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-icons text-gray-600 text-sm">
                      work
                    </span>
                    <span className="text-gray-700 font-medium">
                      {professional.professionLabel}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 mt-3">
                    <span className="material-icons text-gray-600 text-sm mt-0.5">
                      location_on
                    </span>
                    <p className="text-gray-600 text-sm leading-tight">
                      {professional.location}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="w-full bg-sky-50 text-sky-600 hover:bg-sky-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                      <span className="material-icons text-sm">visibility</span>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Estado cuando no hay resultados */
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
          <span className="material-icons text-6xl text-gray-300 mb-4">
            search_off
          </span>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron profesionales
          </h3>
          <p className="text-gray-500 mb-4">
            No hay resultados que coincidan con tus criterios de búsqueda.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setValidationFilter("all");
              setProfessionFilter("all");
            }}
            className="inline-flex items-center gap-2 bg-sky-500 text-white hover:bg-sky-600 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            <span className="material-icons text-sm">refresh</span>
            Mostrar todos los profesionales
          </button>
        </div>
      )}
    </div>
  );
}
