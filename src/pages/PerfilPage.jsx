import { useState } from "react";
import { useRol } from "../context/UseUserData";
import PerfilFormComponent from "../components/PerfilFormComponent";
import FormularioProfecionistaComponent from "../components/FormularioProfecionistaComponent";
import LoginPage from './LoginPage';

export default function PerfilPage() {
  const { userRol } = useRol();
  const [activeIndex, setActiveIndex] = useState(0);
  if (!userRol) {
        return(
        <LoginPage />
        );
      }

  const tabs = [
    { id: "perfil", component: <PerfilFormComponent /> },
    ...(userRol === "Profesionista"
      ? [{ id: "profesion", component: <FormularioProfecionistaComponent /> }]
      : []),
  ];

  const handleNext = () => {
    if (activeIndex < tabs.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const showNavigation = tabs.length > 1;

  return (
    <div className="w-full mt-15 px-4 py-6">
      {/* Contenido del carrusel */}
      <div className="transition-all duration-300 ease-in-out">
        {tabs[activeIndex].component}
      </div>

      {/* Botones de navegación solo si hay más de una sección */}
      {showNavigation && (
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 transition ${
              activeIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="material-icons">arrow_back</span>
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === tabs.length - 1}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-sky-500 text-white hover:bg-sky-600 transition ${
              activeIndex === tabs.length - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Siguiente
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}