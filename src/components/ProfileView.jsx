export default function ProfileView({ profile, setEdit }) {
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
              <span className="text-2xl font-bold text-white">
                {profile.user?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>

            {/* Información principal */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profile.user}
              </h1>
              <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                <span className="text-white text-sm font-medium">
                  {profile.userRol}
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
        {/* Email */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="material-icons text-blue-500 text-2xl">email</span>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Correo</p>
            <p className="text-gray-800 font-semibold">{profile.userEmail}</p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="material-icons text-green-500 text-2xl">phone</span>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Teléfono</p>
            <p className="text-gray-800 font-semibold">
              {profile.telefono || "No especificado"}
            </p>
          </div>
        </div>

        {/* Edad */}
        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <span className="material-icons text-purple-500 text-2xl">
            person
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-500 font-medium">Edad</p>
            <p className="text-gray-800 font-semibold">
              {profile.edad ? `${profile.edad} años` : "No especificada"}
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
}
