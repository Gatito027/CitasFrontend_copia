import MapaVisualizacion from "./MapaVisualizacion";
export default function ProfecionistaView({ profecionista, setEdit }) {
  const pressIcon = () => {
    setEdit(true);
  };
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-8">
        <div className="flex justify-between items-start">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">P</span>
            </div>

            {/* Información principal */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Perfil profecional
              </h1>
              <div className="inline-flex items-center px-3 py-1 rounded-full backdrop-blur-sm">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    profecionista.isValid
                      ? "bg-green-100/80 text-green-700"
                      : "bg-red-100/80 text-red-700"
                  }`}
                >
                  {profecionista.isValid ? "Aprobado" : "No aprobado"}
                </span>
              </div>
            </div>
          </div>

          {/* Botón de edición */}
          <button
            type="button"
            onClick={pressIcon}
            className="flex items-center justify-center w-10 h-10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            title="Editar perfil"
          >
            <span className="material-icons text-white text-2xl">edit</span>
          </button>
        </div>
      </div>

      {/* Contenido del perfil */}
      <div className="p-6 space-y-4">
        {/* Decripcion */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="material-icons text-blue-500 text-2xl">
            description
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Descripcion</p>
            <p className="text-gray-800 font-semibold">
              {profecionista.descripcion}
            </p>
          </div>
        </div>

        {/* Categoria */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="material-icons text-green-500 text-2xl">work</span>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Categoría</p>
            <p className="text-gray-800 font-semibold">
              {profecionista.categoriaPersonalizada || "Sin categoria"}
            </p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <span className="material-icons text-sky-600 text-2xl">
              location_on
            </span>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500 font-medium">Ubicación</p>
              <p className="text-gray-800 font-semibold">
                {profecionista.ubicacion || "No especificada"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <MapaVisualizacion ubicacion={profecionista.ubicacion} />
          </div>
        </div>

        {/* Redes Sociales - Facebook */}
        <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="material-icons text-white text-xl">share</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Redes Sociales
              </p>

              {/* Facebook */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="material-icons text-white text-lg">
                      facebook
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-600">
                      Facebook
                    </p>
                    <p
                      className={`font-semibold ${
                        profecionista.facebook
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      {profecionista.facebook || "Sin enlace"}
                    </p>
                  </div>
                </div>
                {profecionista.facebook && (
                  <a
                    href={profecionista.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-3 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors self-start sm:self-auto"
                  >
                    <span className="material-icons text-base">
                      open_in_new
                    </span>
                    <span className="text-sm font-medium">Visitar</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
