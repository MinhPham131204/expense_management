import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider";
import { BarCharts } from "@/components/Charts"

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<BarCharts />} />
          </Routes>
        </Router>
      </ThemeProvider>
        
    </>
  )
}

export default App
