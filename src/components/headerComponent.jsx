import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useRol } from "../context/useUserData";
import SignInLayoutComponent from "./layouts/SignInLayoutComponent";
import ClientLayout from "./layouts/ClientLayout";
import ProfesionistaLayout from "./layouts/ProfesionistaLayout";
import AdministradorLayout from "./layouts/AdministradorLayout"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userUser } = useUser();
  const { userRol } = useRol();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md px-4 py-2 flex justify-between items-center z-50 shadow-sm">
      {/* Logo y nombre */}
      <div className="flex items-center gap-x-2">
        <p className="text-black font-bold text-xl">ᓚᘏᗢ</p>
        <Link
          to="/"
          className="text-black font-semibold text-lg hover:text-sky-600 transition-colors"
        >
          Servicio de Citas
        </Link>
      </div>

      {/* Botón hamburguesa para móviles */}
      <div className="sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-black hover:text-sky-600 transition-colors"
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      {/* Navegación para pantallas grandes */}
      <div className="hidden sm:flex items-center gap-x-4">
        {!userUser && <SignInLayoutComponent />}
        {userRol === "Cliente" && <ClientLayout />}
        {userRol === "Profesionista" && <ProfesionistaLayout />}
        {userRol === "Administrador" && <AdministradorLayout />}
      </div>

      {/* Menú hamburguesa desplegable */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-4 sm:hidden">
          <div className="flex flex-col gap-y-4">
            {!userUser && <SignInLayoutComponent isMobile={true} />}
            {userRol === "Cliente" && <ClientLayout isMobile={true} />}
            {userRol === "Profesionista" && <ProfesionistaLayout isMobile={true} />}
            {userRol === "Administrador" && <AdministradorLayout isMobile={true} />}
          </div>
        </div>
      )}
    </nav>
  );
}