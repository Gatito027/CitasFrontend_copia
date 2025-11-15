import { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { useUser } from "../../context/UseUserData";
import { useLogout } from "../../utils/Logout";
=======
import { useUser } from "../../context/useUserData";
import { useLogout } from "../../utils/logout";
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29

export default function ClientLayout({ isMobile = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userUser } = useUser();
  const logout = useLogout();

  return (
    <div className={`flex ${isMobile ? "flex-col gap-y-4" : "items-center gap-x-4"}`}>
      {/* Navegación principal */}
      <nav className={`flex ${isMobile ? "flex-col gap-y-2" : "gap-x-2 sm:gap-x-4"}`}>
        <Link
<<<<<<< HEAD
          to="/directorio"
=======
          to="/"
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
          className="flex items-center gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
        >
          <span className="material-icons text-base sm:text-lg">folder_shared</span>
          <span>Directorio</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
        >
          <span className="material-icons text-base sm:text-lg">event</span>
          <span>Agenda</span>
        </Link>
      </nav>

      {/* Menú de usuario */}
<<<<<<< HEAD
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
=======
      <div className="relative">
        <button
          className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition flex items-center gap-x-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span>{userUser || "Usuario"}</span>
          <span
            className="material-icons transition-transform duration-300"
            style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            arrow_drop_down
          </span>
        </button>

        {menuOpen && (
          <div
            className={`absolute ${isMobile ? "static mt-2" : "right-0 mt-2"} w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50`}
          >
            <button
              className="flex items-center justify-start gap-x-3 px-4 py-3 w-full text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 text-sm sm:text-base"
              onClick={logout}
            >
              <span className="material-icons text-lg sm:text-xl">logout</span>
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
    </div>
  );
}