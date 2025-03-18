import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"; // Import từ file vừa tạo
import { Children } from "react";

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
              <Route path="/" element={Children} />

          </Routes>
        </Router>
      </ThemeProvider>
    </>
  )
}

export default App
