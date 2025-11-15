//import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { useEmail } from "../context/useUserData";
import LoginPage from './loginPage';

export default function HomePage() {
  //const navigate = useNavigate();
  const { userEmail } = useEmail();

  
    if (!userEmail) {
      //navigate("/login");
      return(
      <LoginPage />
      );
    }

  return (
    <div className="mt-15">
      <h1 className="text-4xl font-bold text-center text-sky-600 mb-6">
        Home
      </h1>
    </div>
  );
}