import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider";

import TransactionTable from "./components/TransactionTable";
import LoginSignup from "./pages/LoginSignup";

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
