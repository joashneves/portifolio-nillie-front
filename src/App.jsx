import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import Home from './pages/home/Home'
import Categoria from './pages/categoria/Categoria'
import Login from './pages/login/Login'
import Painel from './pages/painelAdministrador/Painel'
import './index.css'
import About from './pages/about/About'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/categoria/:id" element={<Categoria />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Painel />} />
            </Routes>
          </main>
          <ThemeToggle />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
