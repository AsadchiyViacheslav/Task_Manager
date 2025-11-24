import { useUserStore } from './features/auth/model/useUserStore'
import { BrowserRouter ,Routes,Route,Navigate  } from "react-router-dom";
import RegistrationPage from './page/Registration/Registration';
import LoginPage from './page/Login/Login';

export default function App() {
  const isLoggedIn = useUserStore((state)=>state.isLoggedIn)

  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={isLoggedIn ? <Home /> : <><Navigate to="/login" replace /></>}/>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

