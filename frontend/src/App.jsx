import { useUserStore } from './features/auth/model/useUserStore'
import { BrowserRouter ,Routes,Route,Navigate  } from "react-router-dom";
import RegistrationPage from './page/Registration/Registration';
import LoginPage from './page/Login/Login';
import HomePage from './page/Home/Home';
import Tasks from './page/Tasks/Tasks';

export default function App() {
  const isLoggedIn = useUserStore((state)=>state.isLoggedIn)

  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={isLoggedIn ? <HomePage /> : <><Navigate to="/login" replace /></>}/>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/registration" element={<RegistrationPage />} />
         <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  )
}

