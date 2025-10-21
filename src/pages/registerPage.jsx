import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitRegister } from "../infrastructure/submitRegister";
import { registerSchema } from "../utils/schema/RegisterSchema.js";
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetedPassword, setRepetedPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("");

  const [errors, setErrors] = useState({});

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
      await submitRegister(result.data);
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
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const isFilled = () =>
    user && email && password && repetedPassword && edad && telefono && rol;

  return (
    <>
      <div className="mt-10 flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-100 to-white">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
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
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField("password", e.target.value);
                  validateField("repetedPassword", repetedPassword);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.password?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
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
              <input
                type="password"
                placeholder="Confirma tu contraseña"
                value={repetedPassword}
                onChange={(e) => {
                  setRepetedPassword(e.target.value);
                  validateField("repetedPassword", e.target.value);
                  validateField("password", password);
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.repetedPassword?.length ? "border-red-500" : "border-sky-300"
                }`}
                required
              />
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
              disabled={!isFilled()}
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                isFilled()
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Registrarse Ahora
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
