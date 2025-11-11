import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  User,
  BadgeCheck,
  ChevronRight,
  Bell,
  Users,
  PlusCircle,
} from "lucide-react";
import CalendarWidget from '../components/CalendarWidget';
import { toast } from 'react-hot-toast';
import { formatarData, formatarHorario } from "../utils/formatters";
import api from "../api/http";
import useAuth from "../store/useAuth";

export default function DashboardEstudante() {
  const [procedimentos, setProcedimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  useEffect(() => {
    if (!user || user.tipo_usuario !== "Estudante") {
      navigate("/login");
      return;
    }

    const fetchProcedimentos = async () => {
      try {
        const res = await api.get("/procedimentos/meus-procedimentos");
        setProcedimentos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar procedimentos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedimentos();
  }, [navigate, user]);

  // Header interactions
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);

  const openNotifications = () => {
    // If you have a notifications page, navigate to it. For now, show toast.
    // navigate('/notificacoes');
    toast('Notificações — funcionalidade em desenvolvimento');
  };

  const openProfile = () => {
    navigate('/perfil');
  };

  // resumo
  // Backend may use 'confirmado' or 'agendado' for scheduled procedures — count both
  const agendados = procedimentos.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === "confirmado" || s === "agendado";
  }).length;
  // Aguardando pode aparecer como 'disponivel' or contain 'aguard'/'pend'
  const aguardando = procedimentos.filter((p) => {
    const s = (p.status || "").toLowerCase();
    return s === 'disponivel' || s.includes("aguard") || s.includes("pend");
  }).length;
  const totalVoluntarios = procedimentos.reduce((acc, p) => acc + (p.voluntarios_count || p.voluntarios || p.inscricoes_count || 0), 0);

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header azul maior */}
      <header className="w-full text-white shadow-md" style={{ backgroundColor: '#1E40FF' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold">Odontologia</h1>
            <p className="text-sm opacity-90">Bem-vindo, {user?.nome?.split(' ')[0]?.toUpperCase() || 'ESTUDANTE'}!</p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/nova-solicitacao')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Nova Solicitação
            </button>
            <div className="flex items-center gap-4">
              <button onClick={openCalendar} className="text-white opacity-95 hover:opacity-75"><CalendarDays className="h-6 w-6" /></button>
              <div className="relative">
                <button onClick={openNotifications} className="text-white opacity-95 hover:opacity-75"><Bell className="h-6 w-6" /></button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
              </div>
              <button onClick={openProfile} className="text-white opacity-95 hover:opacity-75 flex items-center gap-2"><User className="h-6 w-6" /><span className="hidden sm:inline">Perfil</span></button>
            </div>
          </div>
        </div>
      </header>

  <CalendarWidget visible={showCalendar} onClose={closeCalendar} events={procedimentos.map(p=>({date: p.data || p.date, title: p.titulo || p.nome || p.title || 'Procedimento'}))} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Minhas Solicitações</h2>
            <p className="text-sm text-gray-500">Gerencie seus procedimentos e voluntários</p>
          </div>
        </div>

        {/* Cards resumo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Procedimentos Agendados</p>
              <p className="text-3xl font-bold text-blue-800 mt-2">{agendados}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Aguardando Voluntários</p>
              <p className="text-3xl font-bold text-yellow-700 mt-2">{aguardando}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <BadgeCheck className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Voluntários</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{totalVoluntarios}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </section>

        {/* Lista de procedimentos grandes */}
        <section className="space-y-6">
          {procedimentos.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">Nenhum procedimento encontrado.</div>
          ) : (
            procedimentos.map((proc) => (
              <div key={proc.id} className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg" onClick={() => navigate(`/procedimento/${proc.id}`)}>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{proc.titulo || proc.nome || 'Procedimento'}</h3>
                        <p className="text-sm text-gray-500 mt-1">{proc.local || proc.localizacao || ''}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${((proc.status||'').toLowerCase().includes('confirm') || (proc.status||'').toLowerCase().includes('agend')) ? 'bg-green-100 text-green-800' : ((proc.status||'').toLowerCase().includes('aguard') || (proc.status||'').toLowerCase().includes('disp') ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800')}`}>
                        {proc.status || '—'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white mt-4 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-semibold text-gray-800">{proc.data ? formatarData(proc.data) : '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-semibold text-gray-800">{proc.horario ? formatarHorario(proc.horario) : '—'}</p>
                        <p className="text-xs text-gray-500">Duração: {proc.duracao ? proc.duracao : '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Voluntários</p>
                        <p className="font-semibold text-gray-800">{proc.voluntarios_count || proc.voluntarios || proc.inscricoes_count || 0}/1 voluntário(s)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex-shrink-0 flex flex-col items-end gap-4">
                  <button onClick={(e)=>{e.stopPropagation(); navigate(`/procedimento/${proc.id}`);}} className="px-4 py-2 bg-white border rounded-lg">Ver Detalhes</button>
                  <button onClick={(e)=>{e.stopPropagation(); navigate(`/procedimento/${proc.id}`);}} className="p-2 rounded-full bg-gray-50 border"><ChevronRight /></button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}