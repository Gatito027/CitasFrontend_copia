import { BrowserRouter, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import { UserContextProvider } from "./context/UserContextProvider"; 
import LoginPage from './pages/LoginPage';
import LayoutComponent from './components/LayoutComponent';
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PerfilPage from "./pages/PerfilPage";
import EditHorarioPage from "./pages/EditHorarioPage";
import ProfesionistaInfoPage from "./pages/ProfecionistaInfoPage";
import AgendaPage from "./pages/AgendaPage";
import NotFound from "./pages/NotFound";
import EstadisticasPage from "./pages/EstadisticasPage";
=======
import { UserContextProvider } from "./context/userContextProvider"; 
import LoginPage from './pages/loginPage';
import LayoutComponent from './components/layoutComponent';
import RegisterPage from './pages/registerPage';
import HomePage from "./pages/homePage";
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29

function App() {

  return (
    <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LayoutComponent />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage/>}/>
<<<<<<< HEAD
                        <Route path="perfil" element={<PerfilPage/>}/>
                        <Route path="editarHorario" element={<EditHorarioPage />} />
                        <Route path='profesionista/:id' element={<ProfesionistaInfoPage />} />
                        <Route path="directorio" element={<AgendaPage />} />
                        <Route path="estadisticas" element={<EstadisticasPage />} />
                        <Route path="*" element={<NotFound />} />
=======
>>>>>>> 2ab88af6759daf2e0cc2875657956667b29e9e29
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
  )
}

export default App
