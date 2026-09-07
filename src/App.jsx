import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import Home from './pages/home/Home'
import Categoria from './pages/categoria/Categoria'
import Login from './pages/login/Login'
import PainelCategorias from './pages/painelAdministrador/PainelCategorias'
import PainelColecoes from './pages/painelAdministrador/PainelColecoes'
import './index.css'
import About from './pages/about/About'
import Footer from './components/Footer/Footer'
import Menu from './pages/menu/Menu'
import Categorias from './pages/categorias/Categorias'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/categoria/:id" element={<Categoria />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Navigate to="/dashboard/categorias" replace />} />
              <Route path="/dashboard/categorias" element={<PainelCategorias />} />
              <Route path="/dashboard/colecoes" element={<PainelColecoes />} />
            </Routes>
          </main>
          <Footer />
          <ThemeToggle />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
