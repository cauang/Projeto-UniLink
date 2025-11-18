import { Suspense, lazy } from "react"; 
import { Routes, Route } from "react-router-dom";
import useAuth from "./store/useAuth"; 
import LoadingSpinner from "./components/LoadingSpinner"; 

const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Sobre = lazy(() => import("./pages/Sobre.jsx"));
const Cadastro = lazy(() => import("./pages/cadastro.jsx"));
const DashboardVoluntario = lazy(() => import("./pages/DashboardVoluntario.jsx"));
const DashboardEstudante = lazy(() => import("./pages/DashboardEstudante.jsx"));
const NovaSolicitacao = lazy(() => import("./pages/NovaSolicitacao.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const DetalhesProcedimento = lazy(() => import("./pages/DetalhesProcedimento.jsx"));
const Perfil = lazy(() => import("./pages/perfil.jsx"));


export default function App() {

  const user = useAuth((state) => state.user);

  const DashboardRoute = () => {
    const tipo = user?.tipo_usuario;
    if (tipo === 'Estudante') return <DashboardEstudante />;
    return <DashboardVoluntario />;
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* 4. Envolver as rotas com Suspense e passar o LoadingSpinner como fallback */}
      <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/sobre" element={<Sobre />} />
          
          {/* Rotas protegidas/Dashboards */}
          <Route path="/voluntarios" element={<DashboardVoluntario />} />
          <Route path="/dashboard-estudante" element={<DashboardEstudante />} />
          <Route path="/nova-solicitacao" element={<NovaSolicitacao />} />
          
          {/* Rota lógica que decide qual dashboard mostrar */}
          <Route path="/dashboard" element={<DashboardRoute />} />
          
          <Route path="/procedimento/:id" element={<DetalhesProcedimento />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/perfil" element={<Perfil />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
    </div>
  );
}