import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContextProvider } from "./context/userContextProvider"; 
import LoginPage from './pages/loginPage';
import LayoutComponent from './components/layoutComponent';
import RegisterPage from './pages/registerPage';
import HomePage from "./pages/homePage";

function App() {

  return (
    <UserContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LayoutComponent />}>
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </UserContextProvider>
  )
}

export default App
