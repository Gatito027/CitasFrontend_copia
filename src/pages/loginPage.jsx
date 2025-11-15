import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitLogin } from "../infrastructure/submitLogin";
import { UserContext } from "../context/UserContext";
export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUser, setEmail, setEdad, setTelefono, setRol } = useContext(UserContext);
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const result = await submitLogin({
          loginEmail,
          password,
        });
        setUser(result.user.username);
        setEmail(result.user.email);
        setEdad(result.user.age);
        setTelefono(result.user.phoneNumber);
        setRol(result.user.role);
        localStorage.setItem("token", result.token);
        navigate("/");
        //alert("Login mesage");
      } catch (error) {
        //console.log(error);
        setError(error.toString());
      }
    };
  return (
    <div className="mt-10 flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-white">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-sky-600 mb-6">
          Acceder a la cuenta
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="ejemplo@email.com"
            value={loginEmail}
            onChange={(ev) => setLoginEmail(ev.target.value)}
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            required
          />
          {error != "" &&
          <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">¡Error!</strong>
              <span className="block sm:inline">
                {error}
              </span>
            </div>
            }
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Acceder
          </button>
          <div className="text-center text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="text-sky-700 hover:underline font-medium"
            >
              Registrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
