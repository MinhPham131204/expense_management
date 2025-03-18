import { BrowserRouter as Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"; // Import từ file vừa tạo
import { Sidebar } from "lucide-react";

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <Routes>
            <Route path="/" element={<Sidebar />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
