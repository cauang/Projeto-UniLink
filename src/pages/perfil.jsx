import React, { useState, useEffect } from "react";
import api from '../api/http';
import { toast } from 'react-hot-toast';
import CalendarWidget from '../components/CalendarWidget';
import { Link } from "react-router-dom";
import useAuth from "../store/useAuth";
import {
  ChevronLeft,
  Calendar,
  Bell,
  User,
  Edit,
  Star,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  BookText,
  CalendarDays, // Para aba de notificações
} from "lucide-react";

// --- Constantes ---
const PRIMARY_BLUE = "#1E40FF";

// --- DADOS PADRÃO / FALLBACK ---
// Caso o usuário não esteja carregado no store, usamos valores de fallback.
const profileFallback = {
  nome: "Usuário Sem Nome",
  curso: "-",
  tipo: "-",
  matricula: "-",
  iniciais: "US",
  email: "-",
  telefone: "-",
  semestre: "-",
  biografia: "",
};

const statsFallback = {
  procedimentos: 0,
  pontos: 0,
  avaliacao: 0,
};
// --- FIM DOS DADOS ESTÁTICOS ---

// --- Componente Header ---
const PerfilHeader = ({ onOpenCalendar }) => (
  <header
    className="w-full text-white p-6 rounded-b-lg shadow-md"
    style={{ backgroundColor: PRIMARY_BLUE }}
  >
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div>
        <Link
          to="/voluntarios" // Link de volta ao Dashboard
          className="flex items-center gap-2 text-sm text-white hover:opacity-80 transition"
        >
          <ChevronLeft size={18} />
          Voltar ao Dashboard
        </Link>
        <h1 className="text-3xl font-bold mt-2">Meu Perfil</h1>
        <p className="text-sm opacity-90">
          Gerencie suas informações pessoais e preferências
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

// --- Componente Card de Perfil (apenas info) ---
const ProfileCard = ({ profile }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
        {profile.iniciais}
      </div>
      <h2 className="text-xl font-bold text-gray-800">{profile.nome}</h2>
      <p className="text-sm text-gray-500 mb-3">{profile.curso}</p>
      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full mb-4">
        {profile.tipo}
      </span>
      <p className="text-sm text-gray-600">
        Matrícula:{" "}
        <span className="font-medium text-gray-800">{profile.matricula}</span>
      </p>
      <button
        onClick={() => console.log("Clicou em: Editar Perfil")}
        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <Edit size={16} />
        Editar Perfil
      </button>
    </div>
  </div>
);

// --- Componente Card de Estatísticas ---
const StatsCard = ({ stats }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estatísticas</h3>
    <ul className="space-y-3 text-sm">
      <li className="flex justify-between items-center text-gray-600">
        <span>Procedimentos Participados</span>
        <span className="font-bold text-gray-800">{stats.procedimentos}</span>
      </li>
      <li className="flex justify-between items-center text-gray-600">
        <span>Pontos de Colaboração</span>
        <span className="font-bold text-blue-600">{stats.pontos}</span>
      </li>
      <li className="flex justify-between items-center text-gray-600">
        <span>Avaliação Média</span>
        <span className="font-bold text-yellow-500 flex items-center gap-1">
          <Star size={16} fill="currentColor" /> {stats.avaliacao}
        </span>
      </li>
    </ul>
  </div>
);

// --- Componente Abas (ESTILO ATUALIZADO E CORRIGIDO) ---
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Informações", "Notificações", "Segurança"];
  return (
    // Container cinza e arredondado (rounded-full)
    <nav
      className="w-full p-1.5 rounded-full flex items-center justify-around" // <-- 'rounded-full' e 'justify-around'
      style={{ backgroundColor: "#ECECF0" }} // <-- COR EXATA APLICADA
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => {
            console.log("Clicou na aba:", tab);
            setActiveTab(tab);
          }}
          className={`text-center px-6 py-2 text-sm font-medium transition rounded-full ${ // <-- 'rounded-full'
            activeTab === tab
              ? "bg-white shadow-sm text-gray-900" // Estilo Ativo: Botão branco
              : "text-gray-600 hover:text-gray-700" // Estilo Inativo: Transparente
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

// --- Componente de Conteúdo (para a aba "Informações") ---
const InfoContent = ({ profile }) => (
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-800">
      Informações Pessoais
    </h3>
    <p className="text-sm text-gray-500 mb-6">
      Suas informações básicas e de contato
    </p>
    <div className="space-y-6">
      {/* Nome Completo */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Nome Completo
        </label>
        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
          <span className="text-sm text-gray-700">{profile.nome}</span>
        </div>
      </div>

      {/* Grid: E-mail e Telefone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            E-mail
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <Mail size={16} className="text-gray-400" />
            <span className="text-sm text-gray-700">{profile.email}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Telefone
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <Phone size={16} className="text-gray-400" />
            <span className="text-sm text-gray-700">{profile.telefone}</span>
          </div>
        </div>
      </div>

      {/* Grid: Curso e Semestre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Curso
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-700">{profile.curso}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Semestre
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-700">{profile.semestre}</span>
          </div>
        </div>
      </div>

      {/* Biografia */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">
          Biografia
        </label>
        <div className="flex items-start gap-2 p-3 bg-gray-100 rounded-lg min-h-[80px]">
          <p className="text-sm text-gray-500 italic">{profile.biografia}</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Componente Toggle Switch ---
const ToggleSwitch = ({ enabled, setEnabled }) => (
  <button
    onClick={() => {
      console.log("Clicou no Toggle Switch!");
      setEnabled(!enabled);
    }}
    className={`relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      aria-hidden="true"
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        enabled ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// --- Componente de Conteúdo (para a aba "Notificações") ---
const NotificationContent = () => {
  // Estados para controlar cada toggle
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [lembretes, setLembretes] = useState(true);

  const items = [
    {
      icon: Mail,
      title: "Notificações por E-mail",
      description: "Receba atualizações importantes por e-mail",
      enabled: emailNotif,
      setEnabled: setEmailNotif,
    },
    {
      icon: Bell,
      title: "Notificações Push",
      description: "Receba notificações em tempo real no navegador",
      enabled: pushNotif,
      setEnabled: setPushNotif,
    },
    {
      icon: CalendarDays, // Ícone atualizado
      title: "Lembretes de Agendamento",
      description: "Receba lembretes antes dos procedimentos agendados",
      enabled: lembretes,
      setEnabled: setLembretes,
    },
  ];

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Preferências de Notificação
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Gerencie como você deseja receber notificações
      </p>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="text-sm font-medium text-gray-800">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
            <ToggleSwitch enabled={item.enabled} setEnabled={item.setEnabled} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Componente de Conteúdo (para as outras abas) ---
const PlaceholderContent = ({ tab }) => (
  <div className="p-6 text-center text-gray-500">
    <h3 className="text-xl font-semibold mb-2">Conteúdo de {tab}</h3>
    <p>Esta seção está em desenvolvimento.</p>
  </div>
);

// --- Componente Principal ---
export default function Perfil() {
  const [activeTab, setActiveTab] = useState("Informações");
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const fetchAndOpenCalendar = async () => {
    try {
      const tipo = (user?.tipo_usuario || user?.tipo || '').toString().toLowerCase();
      let res;
      if (tipo.includes('estud')) {
        res = await api.get('/procedimentos/meus-procedimentos');
      } else {
        res = await api.get('/procedimentos/meus-agendados');
      }
      const rows = res?.data || [];
      const ev = rows.map(r => ({ date: r.data || r.date, title: r.titulo || r.nome || r.title || 'Procedimento' }));
      setCalendarEvents(ev);
      setShowCalendar(true);
    } catch (err) {
      console.error('Erro ao carregar procedimentos do usuário', err);
      toast.error('Não foi possível carregar o calendário');
    }
  };

  // Pegar o usuário logado do store (setado no login)
  const user = useAuth((state) => state.user);

  // Local state for real procedimentos count
  const [localProcedimentosCount, setLocalProcedimentosCount] = useState(user?.procedimentos || statsFallback.procedimentos);

  // Construir o objeto de profile que o componente espera, com fallback
  const profile = {
    nome: user?.nome || profileFallback.nome,
    curso: user?.curso || profileFallback.curso,
    tipo: user?.tipo_usuario || user?.tipo || profileFallback.tipo,
    matricula: user?.matricula || profileFallback.matricula,
    iniciais:
      (user?.nome && user.nome.split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase()) ||
      profileFallback.iniciais,
    email: user?.email || profileFallback.email,
    telefone: user?.telefone || profileFallback.telefone,
    semestre: user?.semestre ? `${user.semestre}º Semestre` : profileFallback.semestre,
    biografia: user?.biografia || profileFallback.biografia,
  };

  const stats = {
    procedimentos: localProcedimentosCount,
    pontos: user?.pontos || statsFallback.pontos,
    avaliacao: user?.avaliacao || statsFallback.avaliacao,
  };

  // Load real counts for procedimentos when the profile mounts
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const tipo = (user?.tipo_usuario || user?.tipo || '').toString().toLowerCase();
        let res;
        if (tipo.includes('estud')) {
          res = await api.get('/procedimentos/meus-procedimentos');
        } else {
          res = await api.get('/procedimentos/meus-agendados');
        }
        if (!mounted) return;
        const count = Array.isArray(res?.data) ? res.data.length : 0;
        setLocalProcedimentosCount(count);
      } catch (err) {
        console.error('Erro ao buscar procedimentos para perfil', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
  <PerfilHeader onOpenCalendar={fetchAndOpenCalendar} />
  <CalendarWidget visible={showCalendar} onClose={closeCalendar} events={calendarEvents} />
      {/* CORREÇÃO: Adicionado 'relative z-10' para garantir que o 'main'
          fique "em cima" do header e possa receber cliques. */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          {/* Coluna da Esquerda (com os dois cards) */}
          <div className="w-full lg:w-1/3 xl:w-1/4 space-y-6 mb-6 lg:mb-0">
            <ProfileCard profile={profile} />
            <StatsCard stats={stats} />
          </div>

          {/* Coluna da Direita (Abas + Conteúdo) */}
          <div className="w-full lg:flex-1 space-y-6">
            {/* As abas ficam do lado de fora */}
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* O conteúdo da aba fica em um card branco */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              {activeTab === "Informações" && <InfoContent profile={profile} />}
              {activeTab === "Notificações" && (
                <NotificationContent />
              )}
              {activeTab === "Segurança" && (
                <PlaceholderContent tab="Segurança" />
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}