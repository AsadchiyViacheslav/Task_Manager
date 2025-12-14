import { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from "./features/auth/model/useUserStore";
import HomePage from "./page/Home/Home";
import LoginPage from "./page/Login/Login";
import Tasks from "./page/Tasks/Tasks";
import Registration from "./features/auth/ui/Registration/Registration";
import CreatePage from "./page/Tasks/Create/CreatePage";
import TaskPage from "./page/Task/Task";
import EditTaskPage from "./page/Edit/EditPage";
import RegistrationPage from "./page/Registration/Registration";

function App() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const refreshToken = useUserStore((state) => state.refreshToken);
  const [loading, setLoading] = useState(true);

  const triedRefresh = useRef(false);

  useEffect(() => {
    const tryRefresh = async () => {
      if (triedRefresh.current) return;
      triedRefresh.current = true;

      try {
        await refreshToken();
      } catch (e) {
        console.log("Сессия не восстановлена");
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, [refreshToken]);

  if (loading) return <div></div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />

        <Route
          path="/tasks"
          element={isLoggedIn ? <Tasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/tasks/create"
          element={isLoggedIn ? <CreatePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/task/:id"
          element={isLoggedIn ? <TaskPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/task/edit/:id"
          element={isLoggedIn ? <EditTaskPage /> : <Navigate to="/login" replace />}
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
