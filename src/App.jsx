import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Sobre from "./pages/Sobre.jsx";
import { Cadastro } from "./pages/cadastro.jsx";
import DashboardVoluntario from "./pages/DashboardVoluntario.jsx";
import DetalhesProcedimento from "./pages/DetalhesProcedimento.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/voluntarios" element={<DashboardVoluntario />} />
        <Route path="/procedimento/:id" element={<DetalhesProcedimento />} />
      </Routes>
      
    </div>
  );
}
