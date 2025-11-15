import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {

  return (
    <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LayoutComponent />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage/>}/>
                        <Route path="perfil" element={<PerfilPage/>}/>
                        <Route path="editarHorario" element={<EditHorarioPage />} />
                        <Route path='profesionista/:id' element={<ProfesionistaInfoPage />} />
                        <Route path="directorio" element={<AgendaPage />} />
                        <Route path="estadisticas" element={<EstadisticasPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
  )
}

export default App
