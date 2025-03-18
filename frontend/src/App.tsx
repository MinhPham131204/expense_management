import { BrowserRouter as Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"; // Import từ file vừa tạo
import UserInput from "./components/UserInput";

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider>
        <Routes>
            <Route path="/" element={<UserInput />} />
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
