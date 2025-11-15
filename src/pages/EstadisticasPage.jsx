import EstadisticasRolComponent from "../components/EstadisticasRolComponent";
import EstadisticasCategoriaComponent from "../components/EstadisticasCategoriasComponent";
import { useRol } from "../context/UseUserData";
import LoginPage from "./LoginPage";
import NoDisponibleComponent from "../components/NoDisponibleComponent";
import { useState, useEffect } from "react";

export default function EstadisticasPage() {
  const { userRol } = useRol();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    { 
      title: "Estadísticas por Rol", 
      component: <EstadisticasRolComponent />,
      icon: "badge",
      description: "Distribución de usuarios según sus roles en el sistema"
    },
    { 
      title: "Estadísticas por Categoría", 
      component: <EstadisticasCategoriaComponent />,
      icon: "category",
      description: "Preferencias de usuarios por categorías de contenido"
    },
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === slideIndex) return;
    setIsTransitioning(true);
    setSlideIndex(index);
  };

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);
  

  if (!userRol) return <LoginPage />;
  if (userRol !== "Administrador") return <NoDisponibleComponent />;

  return (
    <div className="min-h-screen mt-15 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
            <div className="flex flex-wrap gap-2">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    slideIndex === index
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons text-lg">
                    {slide.icon}
                  </span>
                  {slide.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Slide Indicator */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 font-medium">Vista actual:</span>
              <div className="flex items-center gap-2">
                <span className="material-icons text-sky-500">
                  {slides[slideIndex].icon}
                </span>
                <span className="font-semibold text-gray-800">
                  {slides[slideIndex].title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Content */}
        <div className="relative">
          {/* Navigation Arrows - Desktop */}
          <div className="hidden lg:block">
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 w-14 h-14 rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons text-2xl">chevron_left</span>
            </button>
            
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons text-2xl">chevron_right</span>
            </button>
          </div>

          {/* Slide Container */}
          <div className={`transition-all duration-500 ease-in-out transform ${
            isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Slide Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-sky-100 rounded-2xl">
                      <span className="material-icons text-sky-600 text-3xl">
                        {slides[slideIndex].icon}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {slides[slideIndex].title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {slides[slideIndex].description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Slide Indicator Dots */}
                  <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          slideIndex === index
                            ? 'bg-blue-500 scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slide Content */}
              <div className="p-2">
                {slides[slideIndex].component}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden mt-8">
          <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons">chevron_left</span>
              Anterior
            </button>
            
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    slideIndex === index ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}