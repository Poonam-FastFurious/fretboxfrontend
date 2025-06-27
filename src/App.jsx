import "./App.css";
import "./assets/css/tailwind2.css";
import Login from "./AuthentiCation/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./AuthentiCation/Signup";
import Home from "./Home/Home";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import AutoLogin from "./AuthentiCation/AutoLogin";
function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!authUser ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
