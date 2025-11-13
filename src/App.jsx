import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Sobre from "./pages/Sobre.jsx";
import Cadastro from "./pages/cadastro.jsx";
import DashboardVoluntario from "./pages/DashboardVoluntario.jsx";
import DashboardEstudante from "./pages/DashboardEstudante.jsx";
import NovaSolicitacao from "./pages/NovaSolicitacao.jsx";
import useAuth from "./store/useAuth";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import DetalhesProcedimento from "./pages/DetalhesProcedimento.jsx";
import Perfil from "./pages/perfil.jsx";

export default function App() {
  // Decide qual dashboard renderizar baseado no tipo do usuário
  const user = useAuth((state) => state.user);
  const DashboardRoute = () => {
    // Prioriza o tipo de usuário retornado pelo backend
    // Se o backend retornar `tipo_usuario: 'Estudante'` -> renderiza DashboardEstudante
    // Caso contrário (e.g. 'Voluntario') -> renderiza DashboardVoluntario
    const tipo = user?.tipo_usuario;
    if (tipo === 'Estudante') return <DashboardEstudante />;
    return <DashboardVoluntario />;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/voluntarios" element={<DashboardVoluntario />} />
        {/* Rota explícita para o dashboard do estudante (usada após login) */}
        <Route path="/dashboard-estudante" element={<DashboardEstudante />} />
        <Route path="/nova-solicitacao" element={<NovaSolicitacao />} />
  <Route path="/dashboard" element={<DashboardRoute />} />
  <Route path="/procedimento/:id" element={<DetalhesProcedimento />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    </div>
  );
}
