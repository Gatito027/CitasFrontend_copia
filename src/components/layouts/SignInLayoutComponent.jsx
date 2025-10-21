import { Link } from "react-router-dom";

export default function SignInLayoutComponent() {
  return (
    <>
      <Link
        to="/register"
        className="flex items-center gap-x-1 sm:gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
      >
        <span className="material-icons text-base sm:text-lg">email</span>
        <span>Registro</span>
      </Link>
      <Link
        to="/login"
        className="flex items-center gap-x-1 sm:gap-x-2 text-black hover:text-sky-600 transition-transform hover:scale-105 text-sm sm:text-base"
      >
        <span className="material-icons text-base sm:text-lg">login</span>
        <span>Iniciar Sesión</span>
      </Link>
    </>
  );
}