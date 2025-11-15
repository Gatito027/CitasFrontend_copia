import { useRol } from "../context/UseUserData";
import LoginPage from './LoginPage';
import NoDisponibleComponent from "../components/NoDisponibleComponent";
import UserListComponent from "../components/UserListComponent";

export default function AgendaPage() {
  //const navigate = useNavigate();
  const { userRol } = useRol();
    if (!userRol) {
      return(
      <LoginPage />
      );
    }
    if (userRol === "Cliente"){
      return(<UserListComponent/>);
    }

  return (
    <NoDisponibleComponent />
  );
}