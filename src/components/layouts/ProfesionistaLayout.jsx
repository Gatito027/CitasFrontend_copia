import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UseUserData";
import { useLogout } from "../../utils/Logout";

export default function ProfesionistaLayout({ isMobile = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userUser } = useUser();
  const logout = useLogout();


  return (
    <div
      className={`flex ${isMobile ? "flex-col gap-y-4" : "items-center gap-x-4"}`}
    >
      {/* Navegación principal */}
      <nav className={`flex ${isMobile ? "flex-col gap-y-2" : "gap-x-2 sm:gap-x-4"}`}>
        <Link
          to="/editarHorario"
          className="flex items-center gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
        >
          <span className="material-icons text-base sm:text-lg">schedule</span>
          <span>Editar Horario</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
        >
          <span className="material-icons text-base sm:text-lg">calendar_today</span>
          <span>Citas</span>
        </Link>
        
      </nav>

      {/* Menú de usuario */}
      <div className="relative inline-block text-left">
  <button
    className="flex items-center gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    <span className="truncate">{userUser || "Usuario"}</span>
    <span
      className={`material-icons transform transition-transform duration-300 ${
        menuOpen ? "rotate-180" : "rotate-0"
      }`}
    >
      arrow_drop_down
    </span>
  </button>

  {menuOpen && (
    <div
      className={`absolute ${
        isMobile ? "static mt-2" : "right-0 mt-2"
      } w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden`}
    >
      <Link
        to="/perfil"
        className="flex items-center gap-x-3 px-4 py-3 w-full text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors duration-200 text-sm sm:text-base"
      >
        <span className="material-icons text-base sm:text-lg">person</span>
        <span>Perfil</span>
      </Link>

      <button
        className="flex items-center gap-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm sm:text-base"
        onClick={logout}
      >
        <span className="material-icons text-lg sm:text-xl">logout</span>
        <span>Cerrar sesión</span>
      </button>
    </div>
  )}
</div>
    </div>
  );
}