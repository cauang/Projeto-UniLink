import React, { useState, useEffect } from "react";
// 1. ADIÇÃO: Importar useNavigate para navegação programática
import { Link, useNavigate } from "react-router-dom"; 
import {
  Calendar,
  CheckCircle2,
  Award,
  Bell,
  MessageCircle,
  User,
  CalendarDays,
  Clock,
  MapPin,
  BadgeCheck,
  History,
  Loader2,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import api from "../api/mock.js";
import ConfirmacaoInscricao from "./ConfirmacaoInscricao";
import ConfirmacaoCancelamento from "./ConfirmacaoCancelamento";

// --- Constantes ---
const PRIMARY_BLUE = "#1E40FF";

// --- Componente Header ---
// Mantenho a propriedade onCalendarClick
const DashboardHeader = ({ profile, onCalendarClick }) => (
  <header
    className="w-full text-white p-6 rounded-b-lg shadow-md"
    style={{ backgroundColor: PRIMARY_BLUE }}
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Voluntário</h1>
        <p className="text-sm opacity-90">
          Matrícula: {profile ? profile.matricula : "..."} | Curso:{" "}
          {profile ? profile.curso : "..."}
        </p>
      </div>
      <div className="flex items-center gap-6">
        {/* APLICAR A FUNÇÃO DE CLIQUE AQUI */}
        <Calendar 
          size={22} 
          className="cursor-pointer hover:opacity-80" 
          onClick={onCalendarClick} // <--- NOVO ONCLICK
        />
        <div className="relative">
          <Bell size={22} className="cursor-pointer hover:opacity-80" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </div>
        <Link
          to="/perfil"
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <User size={22} />
          <span>Perfil</span>
        </Link>
      </div>
    </div>
  </header>
);

// --- Componentes dos Cards ---
const ResumoCard = ({ icon, title, value, color }) => (
  <div
    className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center justify-between"
  >
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
  </div>
);

// Card para "Minhas Inscrições"
const ProcedimentoInscritoItem = ({ proc, onCancelar }) => (
  <div
    className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    {/* Informações Principais */}
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl font-semibold text-gray-800">{proc.titulo}</h3>
      <p className="text-sm text-gray-600">Estudante: {proc.estudante.nome}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-blue-700">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" /> {proc.data}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> {proc.horario} ({proc.duracao})
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-5 w-5" /> {proc.local}
        </span>
      </div>
    </div>
    {/* Ações */}
    <div className="flex flex-col items-stretch gap-2 w-full mt-3 md:w-auto md:mt-0 md:items-end">
      <span className="flex items-center justify-center gap-1.5 text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
        <BadgeCheck className="h-4 w-4" />
        {proc.status}
      </span>
      <Link
        to={`/procedimento/${proc.id}`}
        className="px-4 py-2 text-sm text-center font-semibold text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-gray-50"
      >
        Ver Detalhes
      </Link>
      <button
        onClick={() => onCancelar(proc.id)}
        className="px-4 py-2 text-sm text-center font-semibold text-red-600 bg-white border border-red-300 rounded-lg hover:bg-gray-50"
      >
        Cancelar
      </button>
    </div>
  </div>
);

// Card para "Disponíveis"
const ProcedimentoDisponivelItem = ({ proc, onInscrever }) => (
  <div
    className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
  >
    {/* Informações Principais */}
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl font-semibold text-gray-800">{proc.titulo}</h3>
      <p className="text-sm text-gray-600">Estudante: {proc.estudante.nome}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-blue-700">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" /> {proc.data}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-5 w-5" /> {proc.horario} ({proc.duracao})
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-5 w-5" /> {proc.local}
        </span>
      </div>
    </div>
    {/* Ações */}
    <div className="flex flex-col items-stretch gap-2 w-full mt-3 md:w-auto md:mt-0 md:items-end">
      <span className="flex items-center justify-center gap-1.5 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
        <BadgeCheck className="h-4 w-4" />
        {proc.status}
      </span>
      <button
        onClick={() => onInscrever(proc.id)}
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700"
      >
        Inscrever-se
      </button>
    </div>
  </div>
);

// Card para "Histórico"
const HistoricoItem = ({ proc }) => (
  <div
    className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center justify-between"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 rounded-full">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{proc.titulo}</h3>
        <p className="text-sm text-gray-500">{proc.data}</p>
      </div>
    </div>
    <span className="text-sm font-medium text-green-600">{proc.status}</span>
  </div>
);

// Componente de Loading/Erro
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <Loader2 size={48} className="animate-spin text-blue-600" />
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center py-20 px-6">
    <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
      <AlertTriangle size={24} />
      <p>
        <strong>Erro:</strong> {message}
      </p>
    </div>
  </div>
);

// --- Componente Principal ---
export default function DashboardVoluntario() {
  const [selectedProc, setSelectedProc] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelProc, setSelectedCancelProc] = useState(null);
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [historico, setHistorico] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 2. ADIÇÃO: Inicializar hook de navegação
  const navigate = useNavigate();

  // 3. ADIÇÃO: Função de clique para o Calendário
  const handleCalendarClick = () => {
    // Redireciona para a rota '/calendario'
    navigate("/calendario"); 
  };


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Usando a API importada (centralizada)
      const [
        profileRes,
        summaryRes,
        inscricoesRes,
        disponiveisRes,
        historicoRes,
      ] = await Promise.all([
        api.get("/auth/me"),
        api.get("/dashboard/summary"),
        api.get("/dashboard/meus-agendados"),
        api.get("/dashboard/disponiveis"),
        api.get("/dashboard/historico"),
      ]);

      setProfile(profileRes.data);
      setSummary(summaryRes.data);
      setInscricoes(inscricoesRes.data);
      setDisponiveis(disponiveisRes.data);
      setHistorico(historicoRes.data);
    } catch (err) {
      setError(
        err.message || "Não foi possível carregar os dados do dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModalConfirmacao = (id) => {
    const proc = disponiveis.find((p) => p.id === id);
    setSelectedProc(proc);
    setShowConfirmModal(true);
  };

  const confirmInscricao = async () => {
    setShowConfirmModal(false);
    const id = selectedProc.id;
    await handleInscricao(id);
    setSelectedProc(null);
  };

  const openModalCancelamento = (id) => {
    const proc = inscricoes.find((p) => p.id === id);
    setSelectedCancelProc(proc);
    setShowCancelModal(true);
  };

  const confirmCancelamento = async () => {
    setShowCancelModal(false);
    const id = selectedCancelProc.id;
    await handleCancelamento(id); // aqui você chama sua função que cancela
    setSelectedCancelProc(null);
  };

  // --- Funções de Inscrição/Cancelamento (Simuladas) ---
  const handleInscricao = async (id) => {
    // 1. Otimistamente, atualiza a UI
    const proc = disponiveis.find((p) => p.id === id);
    setDisponiveis(disponiveis.filter((p) => p.id !== id));
    setInscricoes([proc, ...inscricoes]);

    // 2. Tenta chamar a API
    try {
      await api.post("/procedimentos/inscrever", { id });
      // Se deu certo, ótimo!
    } catch (err) {
      // Se falhou, reverte a mudança na UI e mostra um erro
      setInscricoes(inscricoes.filter((p) => p.id !== id));
      setDisponiveis([proc, ...disponiveis]);
      alert("Erro ao tentar se inscrever. Tente novamente.");
    }
  };

  const handleCancelamento = async (id) => {
    // 1. Otimistamente, atualiza a UI
    const proc = inscricoes.find((p) => p.id === id);
    setInscricoes(inscricoes.filter((p) => p.id !== id));
    setDisponiveis([proc, ...disponiveis]);

    // 2. Tenta chamar a API
    try {
      await api.post("/procedimentos/cancelar", { id });
      // Se deu certo, ótimo!
    } catch (err) {
      // Se falhou, reverte
      setDisponiveis(disponiveis.filter((p) => p.id !== id));
      setInscricoes([proc, ...inscricoes]);
      alert("Erro ao tentar cancelar. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header
          className="w-full text-white p-6 rounded-b-lg shadow-md"
          style={{ backgroundColor: PRIMARY_BLUE }}
        >
          {/* Header de Carregamento */}
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-8 bg-blue-500 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-blue-500 rounded w-1/2"></div>
          </div>
        </header>
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Mesmo com erro, tentamos mostrar o header se o profile carregou */}
        {profile ? (
          // CORRIGIDO: Passar a função de calendário no caso de erro (se o profile carregou)
          <DashboardHeader profile={profile} onCalendarClick={handleCalendarClick} />
        ) : (
          <header
            className="w-full text-white p-6 rounded-b-lg shadow-md"
            style={{ backgroundColor: PRIMARY_BLUE }}
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">Voluntário</h1>
              <p className="text-sm opacity-90">Erro ao carregar dados.</p>
            </div>
          </header>
        )}
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <ErrorDisplay message={error} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 4. PASSAR A FUNÇÃO PARA O HEADER NO RENDER NORMAL */}
      <DashboardHeader profile={profile} onCalendarClick={handleCalendarClick} />

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Seção de Resumo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ResumoCard
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            title="Procedimentos Agendados"
            value={summary.agendados}
            color="bg-blue-100"
          />
          <ResumoCard
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            title="Procedimentos Concluídos"
            value={summary.concluidos}
            color="bg-green-100"
          />
          <ResumoCard
            icon={<Award className="h-6 w-6 text-purple-600" />}
            title="Pontos de Colaboração"
            value={summary.pontos}
            color="bg-purple-100"
          />
        </section>

        {/* Seção "Minhas Inscrições" */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Minhas Inscrições
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Procedimentos em que você está inscrito
          </p>
          <div className="space-y-4">
            {inscricoes.length > 0 ? (
              inscricoes.map((proc) => (
                <ProcedimentoInscritoItem
                  key={proc.id}
                  proc={proc}
                  onCancelar={openModalCancelamento}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">
                Você não está inscrito em nenhum procedimento no momento.
              </p>
            )}
          </div>
        </section>

        {/* Seção "Procedimentos Disponíveis" */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Procedimentos Disponíveis
          </h2>
          <div className="space-y-4">
            {disponiveis.length > 0 ? (
              disponiveis.map((proc) => (
                <ProcedimentoDisponivelItem
                  key={proc.id}
                  proc={proc}
                  onInscrever={() => openModalConfirmacao(proc.id)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">
                Não há procedimentos disponíveis no momento.
              </p>
            )}
          </div>
        </section>

        {/* Seção de Histórico */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <History className="h-6 w-6" />
            Histórico de Participações
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Procedimentos que você já participou
          </p>
          <div className="space-y-4">
            {historico.length > 0 ? (
              historico.map((proc) => (
                <HistoricoItem key={proc.id} proc={proc} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">
                Você ainda não participou de nenhum procedimento.
              </p>
            )}
          </div>
        </section>
      </main>
      <ConfirmacaoInscricao 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmInscricao}
        proc={selectedProc}
      />
      <ConfirmacaoCancelamento
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelamento}
        proc={selectedCancelProc}
      />
    </div>
  );
}