import fondo from '../assets/Background_1.jpg';

export default function NoDisponibleComponent() {
  return (
    <div
      className="relative bg-cover bg-center min-h-screen flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Overlay para oscurecer ligeramente el fondo */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Contenido centrado */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          Servicio no disponible
        </h1>
        <p className="text-lg text-white/80">Estamos trabajando.</p>
      </div>
    </div>
  );
}
