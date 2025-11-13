import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import api from "../api/http.js";
import { toast } from 'react-hot-toast';
import { formatarHorario } from "../utils/formatters";
import CalendarWidget from '../components/CalendarWidget';

// --- Imports dos Modais (NOVO) ---
import ModalConfirmarInscricao from './ConfirmacaoInscricao'; // Ajuste o caminho se necessário
import ConfirmacaoCancelamento from './ConfirmacaoCancelamento.jsx'; // Ajuste o caminho se necessário

// --- Constantes ---
const PRIMARY_BLUE = "#1E40FF";

// --- Conexão com API real ---
// (Sem alterações)

// --- Componente Header ---
const DashboardHeader = ({ profile, onOpenCalendar }) => (
  // (Sem alterações)
  <header
    className="w-full text-white p-6 rounded-b-lg shadow-md"
    style={{ backgroundColor: PRIMARY_BLUE }}
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">{profile?.tipo_usuario || 'Dashboard'}</h1>
        <p className="text-sm opacity-90">
          Matrícula: {profile ? profile.matricula : "..."} | Curso:{" "}
          {profile ? profile.curso : "..."}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onOpenCalendar} className="p-0"><Calendar size={22} className="cursor-pointer hover:opacity-80" /></button>
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
  // (Sem alterações)
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
  // (Sem alterações no JSX, apenas a lógica do onCancelar vai mudar na implementação)
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
          <Clock className="h-5 w-5" /> {formatarHorario(proc.horario)} ({proc.duracao})
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
        onClick={() => onCancelar(proc.id)} // A função onCancelar agora abre o modal
        className="px-4 py-2 text-sm text-center font-semibold text-red-600 bg-white border border-red-300 rounded-lg hover:bg-gray-50"
      >
        Cancelar
      </button>
    </div>
  </div>
);

// Card para "Disponíveis"
const ProcedimentoDisponivelItem = ({ proc, onInscrever }) => (
  // (Sem alterações no JSX, apenas a lógica do onInscrever vai mudar na implementação)
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
          <Clock className="h-5 w-5" /> {formatarHorario(proc.horario)} ({proc.duracao})
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
        onClick={() => onInscrever(proc.id)} // A função onInscrever agora abre o modal
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700"
      >
        Inscrever-se
      </button>
    </div>
  </div>
);

// Card para "Histórico"
const HistoricoItem = ({ proc }) => (
  // (Sem alterações)
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
  // (Sem alterações)
  <div className="flex justify-center items-center py-20">
    <Loader2 size={48} className="animate-spin text-blue-600" />
  </div>
);

const ErrorDisplay = ({ message }) => (
  // (Sem alterações)
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
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [historico, setHistorico] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Estados de Controle dos Modais (NOVO) ---
  const [modalInscricaoOpen, setModalInscricaoOpen] = useState(false);
  const [modalCancelamentoOpen, setModalCancelamentoOpen] = useState(false);
  const [procSelecionado, setProcSelecionado] = useState(null); // Guarda o 'proc' para o modal

  const fetchData = async () => {
    // (Sem alterações na lógica de fetch)
    setLoading(true);
    setError(null);
    try {
      const [
        profileRes,
        inscricoesRes,
        disponiveisRes,
        historicoRes,
      ] = await Promise.all([
        api.get("/user/profile"),
        api.get("/procedimentos/meus-agendados"),
        api.get("/procedimentos/disponiveis"),
        api.get("/procedimentos/historico"),
      ]);

      setProfile(profileRes.data);

      // Normaliza os registros vindos do backend para o formato esperado pelo dashboard
      const normalize = (row) => {
        const id = row.id || row.id_procedimento || row.procedimento_id;
        const titulo = row.titulo || row.nome_procedimento || row.nome || row.title;
        const estudante = {
          nome: (row.estudante && row.estudante.nome) || row.estudante_nome || row.nome_estudante || row.estudanteNome || null,
          email: row.estudante_email || (row.estudante && row.estudante.email) || null,
          telefone: row.estudante_telefone || (row.estudante && row.estudante.telefone) || null,
          semestre: row.estudante_semestre || (row.estudante && row.estudante.semestre) || null,
        };
        const data = row.data ? (typeof row.data === 'string' ? row.data.split('T')[0] : new Date(row.data).toISOString().split('T')[0]) : (row.date || null);
        const horario = row.horario || row.time || null;
        const duracao = row.duracao || row.duration || null;
        const local = row.local || row.localizacao || row.location || null;
        const status = row.status || row.inscricao_status || row.status_proc || null;
        return {
          id,
          titulo,
          estudante,
          data,
          horario,
          duracao,
          local,
          status,
        };
      };

      setInscricoes((inscricoesRes.data || []).map(normalize));
      setDisponiveis((disponiveisRes.data || []).map(normalize));
      setHistorico((historicoRes.data || []).map(normalize));

      // Construir summary localmente a partir dos dados disponíveis
      const agendados = Array.isArray(inscricoesRes.data)
        ? inscricoesRes.data.length
        : 0;
      const concluidos = Array.isArray(historicoRes.data)
        ? historicoRes.data.filter((p) => p.status === "concluido").length
        : 0;
      const pontos = 0; // Pontos não calculados no backend ainda
      setSummary({ agendados, concluidos, pontos });
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

  // --- Funções de Inscrição/Cancelamento (LÓGICA PRINCIPAL) ---
  // Essas funções não mudam, pois contêm a lógica de API
  const handleInscricao = async (id) => {
    // 1. Otimistamente, atualiza a UI
    const proc = disponiveis.find((p) => p.id === id);
    setDisponiveis(disponiveis.filter((p) => p.id !== id));
    setInscricoes([proc, ...inscricoes]);

    // 2. Tenta chamar a API
    try {
      await api.post("/procedimentos/inscrever", { procedimentoId: id });
      toast.success("Inscrição realizada com sucesso!");
      await fetchData(); // Recarrega os dados para garantir consistência
    } catch (err) {
      // Se falhou, reverte a mudança na UI
      setInscricoes(inscricoes.filter((p) => p.id !== id));
      setDisponiveis([proc, ...disponiveis]);
      toast.error(err.response?.data?.message || "Erro ao tentar se inscrever. Tente novamente.");
    }
  };

  const handleCancelamento = async (id) => {
    // 1. Otimistamente, atualiza a UI
    const proc = inscricoes.find((p) => p.id === id);
    setInscricoes(inscricoes.filter((p) => p.id !== id));
    setDisponiveis([proc, ...disponiveis]);

    // 2. Tenta chamar a API
    try {
      await api.post("/procedimentos/cancelar", { procedimentoId: id });
      toast.success("Inscrição cancelada com sucesso!");
      await fetchData(); // Recarrega os dados para garantir consistência
    } catch (err) {
      // Se falhou, reverte
      setDisponiveis(disponiveis.filter((p) => p.id !== id));
      setInscricoes([proc, ...inscricoes]);
      toast.error(err.response?.data?.message || "Erro ao tentar cancelar. Tente novamente.");
    }
  };

  
  // --- Funções de Controle dos Modais (NOVO) ---

  // Abre o modal de INSCRIÇÃO e define o procedimento selecionado
  const onAbrirModalInscricao = (id) => {
    console.log('[Dashboard] onAbrirModalInscricao id=', id, 'disponiveis.count=', disponiveis.length);
    const proc = disponiveis.find((p) => p.id === id || String(p.id) === String(id));
    if (proc) {
      console.log('[Dashboard] proc encontrado:', proc);
      setProcSelecionado(proc);
      setModalInscricaoOpen(true);
    } else {
      console.warn('[Dashboard] proc NÃO encontrado para id=', id);
    }
  };

  // Abre o modal de CANCELAMENTO e define o procedimento selecionado
  const onAbrirModalCancelamento = (id) => {
    console.log('[Dashboard] onAbrirModalCancelamento id=', id, 'inscricoes.count=', inscricoes.length);
    const proc = inscricoes.find((p) => p.id === id || String(p.id) === String(id));
    if (proc) {
      console.log('[Dashboard] proc encontrado para cancelamento:', proc);
      setProcSelecionado(proc);
      setModalCancelamentoOpen(true);
    } else {
      console.warn('[Dashboard] proc NÃO encontrado para cancelamento id=', id);
    }
  };

  // Fecha todos os modais e limpa a seleção
  const onFecharModais = () => {
    console.log('[Dashboard] onFecharModais');
    setModalInscricaoOpen(false);
    setModalCancelamentoOpen(false);
    setProcSelecionado(null);
  };

  // Chamado quando o usuário CONFIRMA a inscrição no modal
  const onConfirmarInscricao = () => {
    console.log('[Dashboard] onConfirmarInscricao procSelecionado=', procSelecionado);
    if (procSelecionado) {
      handleInscricao(procSelecionado.id); // Chama a lógica de API
    }
    onFecharModais(); // Fecha o modal
  };

  // Chamado quando o usuário CONFIRMA o cancelamento no modal
  const onConfirmarCancelamento = () => {
    console.log('[Dashboard] onConfirmarCancelamento procSelecionado=', procSelecionado);
    if (procSelecionado) {
      handleCancelamento(procSelecionado.id); // Chama a lógica de API
    }
    onFecharModais(); // Fecha o modal
  };


  // --- Renderização de Loading e Erro (Sem alterações) ---
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
          <DashboardHeader profile={profile} />
        ) : (
          <header
            className="w-full text-white p-6 rounded-b-lg shadow-md"
            style={{ backgroundColor: PRIMARY_BLUE }}
          >
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold">Dashboard</h1>
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

  // --- Renderização Principal ---
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader profile={profile} onOpenCalendar={openCalendar} />
      <CalendarWidget visible={showCalendar} onClose={closeCalendar} events={[...inscricoes, ...disponiveis, ...historico].map(i=>({date:i.data, title:i.titulo}))} />

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Seção de Resumo (Sem alterações) */}
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

        {/* Seção "Minhas Inscrições" (ALTERADO) */}
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
                  onCancelar={onAbrirModalCancelamento} // ALTERADO
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">
                Você não está inscrito em nenhum procedimento no momento.
              </p>
            )}
          </div>
        </section>

        {/* Seção "Procedimentos Disponíveis" (ALTERADO) */}
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
                  onInscrever={onAbrirModalInscricao} // ALTERADO
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">
                Não há procedimentos disponíveis no momento.
              </p>
            )}
          </div>
        </section>

        {/* Seção de Histórico (Sem alterações) */}
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

      {/* --- Renderização dos Modais (NOVO) --- */}
      {/* Eles ficam "escutando" os estados de visibilidade */}
      
      <ModalConfirmarInscricao
        isOpen={modalInscricaoOpen}
        onClose={onFecharModais}
        onConfirm={onConfirmarInscricao}
        proc={procSelecionado}
      />
      
      <ConfirmacaoCancelamento
        isOpen={modalCancelamentoOpen}
        onClose={onFecharModais}
        onConfirm={onConfirmarCancelamento}
        proc={procSelecionado}
      />

    </div>
  );
}