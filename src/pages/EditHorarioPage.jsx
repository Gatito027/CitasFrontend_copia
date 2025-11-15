import EditHorarioComponent from "../components/EditHorarioComponent";
import { useNavigate } from "react-router-dom";
import { useRol } from "../context/UseUserData";
import LoginPage from './LoginPage';

export default function EditHorarioPage() {
  const navigate = useNavigate();
  const { userRol } = useRol();

    // Redirige si no está autenticado
    if (!userRol) {
      return <LoginPage />;
    }

    // Redirige si el rol no es "Profesionista"
    if (userRol !== "Profesionista") {
      navigate("/");
    }

  return <EditHorarioComponent />;
}
