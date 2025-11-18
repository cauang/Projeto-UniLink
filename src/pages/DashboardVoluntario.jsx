import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Award,
  User,
  CalendarDays,
  Clock,
  MapPin,
  BadgeCheck,
  History,
  Loader2,
  AlertTriangle,
  LogOut,
} from "lucide-react";
import api from "../api/http.js";
import { toast } from 'react-hot-toast';
import CalendarWidget from '../components/CalendarWidget';
import ModalConfirmarInscricao from './ConfirmacaoInscricao';
import ConfirmacaoCancelamento from './ConfirmacaoCancelamento.jsx';

const PRIMARY_BLUE = "#1E40FF";

// --- Componente Header ---
const DashboardHeader = ({ profile, onOpenCalendar, onLogout }) => (
  <header
    className="w-full text-white p-6 rounded-b-lg shadow-md"
    style={{ backgroundColor: PRIMARY_BLUE }}
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      {/* LADO ESQUERDO: Botão Sair + Título */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onLogout} 
          className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer transform scale-x-[-1]" // Adicionado cursor-pointer
          title="Sair / Logout"
        >
          <LogOut size={28} />
        </button>
        
        <div>
          <h1 className="text-3xl font-bold">{profile?.tipo_usuario || 'Dashboard'}</h1>
          <p className="text-sm opacity-90">
            Matrícula: {profile ? profile.matricula : "..."} | Curso:{" "}
            {profile ? profile.curso : "..."}
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Apenas Calendário e Perfil */}
      <div className="flex items-center gap-6">
        <button onClick={onOpenCalendar} className="p-0 cursor-pointer" title="Calendário"> {/* Adicionado cursor-pointer */}
            <Calendar size={22} className="hover:opacity-80" />
        </button>
        
        <Link
          to="/perfil"
          className="flex items-center gap-2 hover:opacity-80 cursor-pointer" // Já tinha, mantido
        >
          <User size={22} />
          <span>Perfil</span>
        </Link>
      </div>
    </div>
  </header>
);

const ResumoCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
  </div>
);

const ProcedimentoInscritoItem = ({ proc, onCancelar }) => (
  <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl font-semibold text-gray-800">{proc.titulo}</h3>
      <p className="text-sm text-gray-600">Estudante: {proc.estudante.nome}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-blue-700">
        <span className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> {proc.data}</span>
        <span className="flex items-center gap-2"><Clock className="h-5 w-5" /> {proc.horario} ({proc.duracao})</span>
        <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {proc.local}</span>
      </div>
    </div>
    <div className="flex flex-col items-stretch gap-2 w-full mt-3 md:w-auto md:mt-0 md:items-end">
      <span className="flex items-center justify-center gap-1.5 text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium"><BadgeCheck className="h-4 w-4" />{proc.status}</span>
      <Link to={`/procedimento/${proc.id}`} className="px-4 py-2 text-sm text-center font-semibold text-blue-600 bg-white border border-blue-300 rounded-lg hover:bg-gray-50 cursor-pointer">Ver Detalhes</Link> {/* Adicionado cursor-pointer */}
      <button onClick={() => onCancelar(proc.id)} className="px-4 py-2 text-sm text-center font-semibold text-red-600 bg-white border border-red-300 rounded-lg hover:bg-gray-50 cursor-pointer">Cancelar</button> {/* Adicionado cursor-pointer */}
    </div>
  </div>
);

const ProcedimentoDisponivelItem = ({ proc, onInscrever }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl font-semibold text-gray-800">{proc.titulo}</h3>
      <p className="text-sm text-gray-600">Estudante: {proc.estudante.nome}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-blue-700">
        <span className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> {proc.data}</span>
        <span className="flex items-center gap-2"><Clock className="h-5 w-5" /> {proc.horario} ({proc.duracao})</span>
        <span className="flex items-center gap-2"><MapPin className="h-5 w-5" /> {proc.local}</span>
      </div>
    </div>
    <div className="flex flex-col items-stretch gap-2 w-full mt-3 md:w-auto md:mt-0 md:items-end">
      <span className="flex items-center justify-center gap-1.5 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium"><BadgeCheck className="h-4 w-4" />{proc.status}</span>
      <button onClick={() => onInscrever(proc.id)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer">Inscrever-se</button> {/* Adicionado cursor-pointer */}
    </div>
  </div>
);

const HistoricoItem = ({ proc }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 rounded-full"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
      <div><h3 className="font-semibold text-gray-800">{proc.titulo}</h3><p className="text-sm text-gray-500">{proc.data}</p></div>
    </div>
    <span className="text-sm font-medium text-green-600">{proc.status}</span>
  </div>
);

const LoadingSpinner = () => (<div className="flex justify-center items-center py-20"><Loader2 size={48} className="animate-spin text-blue-600" /></div>);
const ErrorDisplay = ({ message }) => (<div className="flex justify-center items-center py-20 px-6"><div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700"><AlertTriangle size={24} /><p><strong>Erro:</strong> {message}</p></div></div>);

// --- Componente Principal ---
export default function DashboardVoluntario() {
  const navigate = useNavigate();
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
  const [modalInscricaoOpen, setModalInscricaoOpen] = useState(false);
  const [modalCancelamentoOpen, setModalCancelamentoOpen] = useState(false);
  const [procSelecionado, setProcSelecionado] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Sessão encerrada.");
    navigate("/");
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, inscricoesRes, disponiveisRes, historicoRes] = await Promise.all([
        api.get("/user/profile"),
        api.get("/procedimentos/meus-agendados"),
        api.get("/procedimentos/disponiveis"),
        api.get("/procedimentos/historico"),
      ]);
      setProfile(profileRes.data);
      
      const normalize = (row) => {
        const id = row.id || row.id_procedimento || row.procedimento_id;
        const titulo = row.titulo || row.nome_procedimento || row.nome || row.title;
        const estudante = {
          nome: (row.estudante && row.estudante.nome) || row.estudante_nome || null,
          email: row.estudante_email || (row.estudante && row.estudante.email) || null,
          telefone: row.estudante_telefone || (row.estudante && row.estudante.telefone) || null,
          semestre: row.estudante_semestre || (row.estudante && row.estudante.semestre) || null,
        };
        const data = row.data ? (typeof row.data === 'string' ? row.data : new Date(row.data).toLocaleDateString()) : (row.date || null);
        const horario = row.horario || row.time || null;
        const duracao = row.duracao || row.duration || null;
        const local = row.local || row.localizacao || row.location || null;
        const status = row.status || row.inscricao_status || row.status_proc || null;
        return { id, titulo, estudante, data, horario, duracao, local, status };
      };

      setInscricoes((inscricoesRes.data || []).map(normalize));
      setDisponiveis((disponiveisRes.data || []).map(normalize));
      setHistorico((historicoRes.data || []).map(normalize));

      const agendados = Array.isArray(inscricoesRes.data) ? inscricoesRes.data.length : 0;
      const concluidos = Array.isArray(historicoRes.data) ? historicoRes.data.filter((p) => p.status === "concluido").length : 0;
      setSummary({ agendados, concluidos, pontos: 0 });
    } catch (err) {
      setError(err.message || "Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInscricao = async (id) => {
    const proc = disponiveis.find((p) => p.id === id);
    setDisponiveis(disponiveis.filter((p) => p.id !== id));
    setInscricoes([proc, ...inscricoes]);
    try {
      await api.post("/procedimentos/inscrever", { procedimentoId: id });
      toast.success("Inscrição realizada com sucesso!");
      await fetchData();
    } catch (err) {
      setInscricoes(inscricoes.filter((p) => p.id !== id));
      setDisponiveis([proc, ...disponiveis]);
      toast.error(err.response?.data?.message || "Erro ao tentar se inscrever.");
    }
  };

  const handleCancelamento = async (id) => {
    const proc = inscricoes.find((p) => p.id === id);
    setInscricoes(inscricoes.filter((p) => p.id !== id));
    setDisponiveis([proc, ...disponiveis]);
    try {
      await api.post("/procedimentos/cancelar", { procedimentoId: id });
      toast.success("Inscrição cancelada com sucesso!");
      await fetchData();
    } catch (err) {
      setDisponiveis(disponiveis.filter((p) => p.id !== id));
      setInscricoes([proc, ...inscricoes]);
      toast.error(err.response?.data?.message || "Erro ao tentar cancelar.");
    }
  };

  const onAbrirModalInscricao = (id) => {
    const proc = disponiveis.find((p) => p.id === id);
    if (proc) { setProcSelecionado(proc); setModalInscricaoOpen(true); }
  };

  const onAbrirModalCancelamento = (id) => {
    const proc = inscricoes.find((p) => p.id === id);
    if (proc) { setProcSelecionado(proc); setModalCancelamentoOpen(true); }
  };

  const onFecharModais = () => { setModalInscricaoOpen(false); setModalCancelamentoOpen(false); setProcSelecionado(null); };
  const onConfirmarInscricao = () => { if (procSelecionado) handleInscricao(procSelecionado.id); onFecharModais(); };
  const onConfirmarCancelamento = () => { if (procSelecionado) handleCancelamento(procSelecionado.id); onFecharModais(); };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="w-full text-white p-6 rounded-b-lg shadow-md" style={{ backgroundColor: PRIMARY_BLUE }}>
          <div className="max-w-7xl mx-auto animate-pulse"><div className="h-8 bg-blue-500 rounded w-1/4 mb-2"></div><div className="h-4 bg-blue-500 rounded w-1/2"></div></div>
        </header>
        <main className="p-6 md:p-10 max-w-7xl mx-auto"><LoadingSpinner /></main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        {profile ? <DashboardHeader profile={profile} onLogout={handleLogout} /> : (
          <header className="w-full text-white p-6 rounded-b-lg shadow-md" style={{ backgroundColor: PRIMARY_BLUE }}>
            <div className="max-w-7xl mx-auto"><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-sm opacity-90">Erro ao carregar dados.</p></div>
          </header>
        )}
        <main className="p-6 md:p-10 max-w-7xl mx-auto"><ErrorDisplay message={error} /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader profile={profile} onOpenCalendar={openCalendar} onLogout={handleLogout} />
      <CalendarWidget visible={showCalendar} onClose={closeCalendar} events={[...inscricoes, ...disponiveis, ...historico].map(i=>({date:i.data, title:i.titulo}))} />
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ResumoCard icon={<Calendar className="h-6 w-6 text-blue-600" />} title="Procedimentos Agendados" value={summary.agendados} color="bg-blue-100" />
          <ResumoCard icon={<CheckCircle2 className="h-6 w-6 text-green-600" />} title="Procedimentos Concluídos" value={summary.concluidos} color="bg-green-100" />
          <ResumoCard icon={<Award className="h-6 w-6 text-purple-600" />} title="Pontos de Colaboração" value={summary.pontos} color="bg-purple-100" />
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Minhas Inscrições</h2>
          <p className="text-sm text-gray-600 mb-4">Procedimentos em que você está inscrito</p>
          <div className="space-y-4">
            {inscricoes.length > 0 ? inscricoes.map((proc) => (<ProcedimentoInscritoItem key={proc.id} proc={proc} onCancelar={onAbrirModalCancelamento} />)) : (<p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">Você não está inscrito em nenhum procedimento no momento.</p>)}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Procedimentos Disponíveis</h2>
          <div className="space-y-4">
            {disponiveis.length > 0 ? disponiveis.map((proc) => (<ProcedimentoDisponivelItem key={proc.id} proc={proc} onInscrever={onAbrirModalInscricao} />)) : (<p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">Não há procedimentos disponíveis no momento.</p>)}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><History className="h-6 w-6" /> Histórico de Participações</h2>
          <p className="text-sm text-gray-600 mb-4">Procedimentos que você já participou</p>
          <div className="space-y-4">
            {historico.length > 0 ? historico.map((proc) => (<HistoricoItem key={proc.id} proc={proc} />)) : (<p className="text-gray-500 text-center py-6 bg-white rounded-lg shadow border border-gray-200">Você ainda não participou de nenhum procedimento.</p>)}
          </div>
        </section>
      </main>
      <ModalConfirmarInscricao isOpen={modalInscricaoOpen} onClose={onFecharModais} onConfirm={onConfirmarInscricao} proc={procSelecionado} />
      <ConfirmacaoCancelamento isOpen={modalCancelamentoOpen} onClose={onFecharModais} onConfirm={onConfirmarCancelamento} proc={procSelecionado} />
    </div>
  );
}