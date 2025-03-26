import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuth } from "@/context/AuthContext";

import LoginSignup from"./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Budget from "./pages/Budget";


function App(): JSX.Element {
  const { isLoggedIn } = useAuth();
  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginSignup />} />
            <Route path="/history" element={isLoggedIn ? <History /> : <Navigate to="/login" />} />
            <Route path="/budget" element={isLoggedIn ? <Budget /> : <Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
