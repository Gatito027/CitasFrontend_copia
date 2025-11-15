import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitRegister } from "../infrastructure/SubmitRegister.js";
import { registerSchema } from "../utils/schema/RegisterSchema.js";
import toast from "react-hot-toast";
import fondo from "../assets/Background_1.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetedPassword, setRepetedPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [repetedIsPasswordFocused, setRepetedIsPasswordFocused] = useState(false);
  const [showRepetedPassword, setShowRepetedPassword] = useState(false);

  const validateField = (field, value) => {
    const formData = {
      user,
      email,
      password,
      repetedPassword,
      edad,
      telefono,
      rol,
      [field]: value,
    };

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        [field]: Array.isArray(fieldErrors[field])
          ? fieldErrors[field]
          : fieldErrors[field]
          ? [fieldErrors[field]]
          : [],
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: [],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = registerSchema.safeParse({
      user,
      email,
      password,
      repetedPassword,
      edad,
      telefono,
      rol,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const normalizedErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, val]) => [
          key,
          Array.isArray(val) ? val : val ? [val] : [],
        ])
      );
      setErrors(normalizedErrors);
      toast.error("Por favor, corrige los errores en el formulario");
      return;
    }

    try {
      const response = await submitRegister(result.data);
      if (response.success) {
        toast.success("Registro exitoso");
        setUser("");
        setEmail("");
        setPassword("");
        setRepetedPassword("");
        setEdad("");
        setTelefono("");
        setRol("");
        setErrors({});
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(`Error: No se ha podido registrar`);
    } finally {
      setIsLoading(false);
    }
  };

  const isFilled = () =>
    user && email && password && repetedPassword && edad && telefono && rol;

  return (
    <>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${fondo})` }}
      >
        <div className="backdrop-blur-sm bg-white/80 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/20">
          <h1 className="text-4xl font-bold text-center text-sky-600 mb-6">
            Registrarse
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <input
                type="text"
                placeholder="Juan Pérez García"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                  validateField("user", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.user?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
              {errors.user?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.user.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.email?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
              {errors.email?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.email.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                maxLength={10}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  validateField("telefono", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.telefono?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
              {errors.telefono?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.telefono.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField("password", e.target.value);
                    validateField("repetedPassword", repetedPassword);
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.password?.length
                      ? "border-red-500"
                      : "border-sky-300"
                  }`}
                  required
                />
                {(isPasswordFocused || password.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showPassword ? (
                      <span className="material-icons text-base sm:text-lg">
                        visibility_off
                      </span>
                    ) : (
                      <span className="material-icons text-base sm:text-lg">
                        visibility
                      </span>
                    )}
                  </button>
                )}
              </div>

              {errors.password?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.password.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <div className="relative w-full">
                <input
                  type={showRepetedPassword ? "text" : "password"}
                  placeholder="Confirma tu contraseña"
                  value={repetedPassword}
                  onFocus={() => setRepetedIsPasswordFocused(true)}
                  onBlur={() => setRepetedIsPasswordFocused(false)}
                  onChange={(e) => {
                    setRepetedPassword(e.target.value);
                    validateField("repetedPassword", e.target.value);
                    validateField("password", password);
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.repetedPassword?.length
                      ? "border-red-500"
                      : "border-sky-300"
                  }`}
                  required
                />
                {(repetedIsPasswordFocused || password.length > 0) && (
                  <button
                    type="button"
                    onClick={() => setShowRepetedPassword((prev) => !prev)}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showRepetedPassword ? (
                      <span className="material-icons text-base sm:text-lg">
                        visibility_off
                      </span>
                    ) : (
                      <span className="material-icons text-base sm:text-lg">
                        visibility
                      </span>
                    )}
                  </button>
                )}
              </div>
              {errors.repetedPassword?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.repetedPassword.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Edad */}
            <div>
              <input
                type="text"
                placeholder="Edad"
                value={edad}
                maxLength={3}
                onChange={(e) => {
                  setEdad(e.target.value);
                  validateField("edad", e.target.value);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.edad?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
              {errors.edad?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.edad.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Rol */}
            <div>
              <select
                value={rol}
                onChange={(e) => {
                  setRol(e.target.value);
                  validateField("rol", e.target.value);
                }}
                className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">Selecciona tu rol</option>
                <option value="Cliente">Cliente</option>
                <option value="Profesionista">Profesionista</option>
              </select>
              {errors.rol?.length > 0 && (
                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                  {errors.rol.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFilled() || isLoading}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                "Registrarse Ahora"
              )}
            </button>

            <div className="text-center text-gray-600">
              ¿Ya estás registrado?{" "}
              <Link
                to="/login"
                className="text-sky-700 hover:underline font-medium"
              >
                Acceder
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
