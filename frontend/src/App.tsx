import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider";
import LoginSignup from "./pages/LoginSignup";
import TransactionTable from "./components/TransactionTable";

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginSignup />} />
            <Route path="/tab" element={<TransactionTable />} />
          </Routes>
        </Router>
      </ThemeProvider>
        
    </>
  )
}

export default App
