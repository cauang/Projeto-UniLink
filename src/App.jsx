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
// CORREÇÃO 1: Mude o nome da importação para começar com maiúscula (boa prática do React)
import Perfil from "./pages/perfil.jsx";
import Admin from "./pages/Admin.jsx";
import Calendario from "./pages/Calendario.jsx"

export default function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* ⚠️ Nota: A Navbar e o Footer geralmente ficam fora do <Routes> se forem fixos em todas as páginas */}

      <Routes>
        {/* Rota inicial / (Home) - provavelmente deveria ser o Home */}
        {/* Se a rota inicial é a Home:
        <Route path="/" element={<Home />} />
        */}
        
        {/* Se a rota inicial for o perfil (como no seu código, mas provavelmente é Home) */}
        <Route path="/" element={<Perfil />} /> 

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/voluntarios" element={<DashboardVoluntario />} />
        <Route path="/procedimento/:id" element={<DetalhesProcedimento />} />
        <Route path="/calendario" element={<Calendario />} />
        
        {/* CORREÇÃO 2: Use o nome da importação com maiúscula e como um elemento JSX <Perfil /> */}
        <Route path="/perfil" element={<Perfil />} />
        
        <Route path="/admin" element={<Admin />} />
      </Routes>
      
    </div>
  );
}