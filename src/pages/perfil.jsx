import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  User,
  ShieldCheck,
  Star,
  Mail, // Ícone de e-mail (para Notificações por E-mail)
  Clock, // Ícone para Lembretes
  Maximize, // Ícone genérico para Push, para diferenciar do sino do header
  Edit, // Ícone de caneta para o botão "Editar Perfil"
} from "lucide-react";

// --- Constantes de Cor ---
const PRIMARY_BLUE = "#1E40FF"; // Azul principal
const BUTTON_GREEN = "#22C55E"; // Verde da tag 'Voluntário'
const LIGHT_GRAY_BG = "#F9FAFB"; // Fundo geral

// --- Componente de Botão de Alternância (Toggle Switch) - Refinado ---
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={checked}
      onChange={onChange}
    />
    {/* Barra de fundo do Toggle */}
    <div
      className={`w-10 h-6 rounded-full peer-focus:outline-none transition-colors duration-300
        ${checked ? `bg-blue-500` : `bg-gray-300`}
        peer-checked:bg-blue-600`}
    ></div>
    {/* Círculo/Bola do Toggle */}
    <div
      className={`absolute start-[2px] top-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-all duration-300 shadow-sm
        ${checked ? `translate-x-full border-white` : ``}
        peer-checked:translate-x-4`}
    ></div>
  </label>
);

// --- Componente Principal (Perfil) ---
const Perfil = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Notificações"); // Começando em Notificações conforme a imagem

  // Simulação de dados do usuário
  const user = {
    nome: "João Pedro Santos",
    curso: "Engenharia da Computação",
    status: "Voluntário",
    matricula: "ODONTO",
    stats: {
      procedimentos: 8,
      pontos: 80,
      avaliacao: 4.9,
    },
    notificacoes: {
      email: true, // Começa ligado
      push: false, // Começa desligado
      lembretes: true, // Começa ligado
    },
  };

  const [notifSettings, setNotifSettings] = useState(user.notificacoes);

  const handleToggle = (key) => {
    setNotifSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Dados para a aba "Notificações" - Ícones Ajustados
  const notificationOptions = [
    {
      key: "email",
      title: "Notificações por E-mail",
      description: "Receba atualizações importantes por e-mail",
      icon: Mail,
    },
    {
      key: "push",
      title: "Notificações Push",
      description: "Receba notificações em tempo real no navegador",
      icon: Maximize, // Usando um ícone que represente "notificação"
    },
    {
      key: "lembretes",
      title: "Lembretes de Agendamento",
      description: "Receba lembretes antes dos procedimentos agendados",
      icon: Clock,
    },
  ];

  // Componente de layout da opção de notificação
  const NotificationOption = ({ item }) => (
    <div className="flex items-start justify-between py-4 border-b last:border-b-0">
      <div className="flex items-center space-x-3">
        {/* Ícone ao lado da descrição, conforme a imagem */}
        <item.icon size={20} className="text-gray-500 mt-1" /> 
        <div className="flex flex-col">
          <h4 className="text-sm font-semibold text-gray-800 flex items-center">
            {item.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        </div>
      </div>
      <div className="flex-shrink-0 pt-1">
        <ToggleSwitch
          checked={notifSettings[item.key]}
          onChange={() => handleToggle(item.key)}
        />
      </div>
    </div>
  );

  // Renderiza o conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "Informações":
        return (
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Dados Pessoais
            </h3>
            {/* Campos de formulário com estilo mais clean */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome Completo"
                defaultValue={user.nome}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
              <input
                type="text"
                placeholder="Matrícula"
                defaultValue={user.matricula}
                disabled
                className="w-full p-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
               {/* Adicionando campo de curso/área para preencher a lacuna */}
              <input
                type="text"
                placeholder="Curso"
                defaultValue={user.curso}
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition w-auto text-sm"
              // Botão azul 'Salvar Preferências' copiado da aba de notificações
            >
              Salvar Alterações
            </button>
          </div>
        );
      case "Notificações":
        return (
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Preferências de Notificação
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Gerencie como você deseja receber notificações
            </p>
            <div className="space-y-1">
              {notificationOptions.map((item) => (
                <NotificationOption key={item.key} item={item} />
              ))}
            </div>
            {/* Botão Salvar Preferências - Estilo do Protótipo */}
            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition w-auto text-sm"
            >
              Salvar Preferências
            </button>
          </div>
        );
      case "Segurança":
        return (
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Configurações de Segurança
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h4 className="font-semibold text-gray-800 text-sm">
                  Alterar Senha
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Mantenha sua conta segura redefinindo sua senha regularmente.
                </p>
                <button className="mt-3 text-blue-600 font-medium hover:text-blue-700 transition text-sm">
                  Alterar Senha
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <h4 className="font-semibold text-gray-800 text-sm">
                  Autenticação de Dois Fatores
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Adicione uma camada extra de proteção à sua conta.
                </p>
                <button className="mt-3 text-blue-600 font-medium hover:text-blue-700 transition text-sm">
                  Configurar 2FA
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Navegação por abas
  const tabs = [
    { name: "Informações", icon: User },
    { name: "Notificações", icon: Bell },
    { name: "Segurança", icon: ShieldCheck },
  ];

  const TabButton = ({ name, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(name)}
      // Estilos ajustados para a aparência minimalista das abas
      className={`px-4 py-3 text-sm font-medium transition-colors duration-200 flex-1 sm:flex-none
        ${
          activeTab === name
            ? "text-gray-900 border-b-2 border-blue-600" // Aba ativa
            : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent" // Aba inativa
        }`}
    >
      {name}
    </button>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: LIGHT_GRAY_BG }}>
      {/* --- HEADER SUPERIOR AZUL --- */}
      <header
        className="py-4 md:py-6 text-white"
        style={{ backgroundColor: PRIMARY_BLUE }}
      >
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
            {/* Voltar ao Dashboard - Ícone e Texto Brancos */}
            <Link
                to="/voluntarios" 
                className="flex items-center text-white hover:text-gray-200 transition text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault(); 
                  if (window.history.length > 1) {
                    navigate(-1); // Tenta voltar na história (se existir)
                  } else {
                    // FALLBACK: Se não houver histórico, navegue para a rota correta
                    navigate("/voluntarios");
                  }
                }}
            >
                <ArrowLeft size={18} className="mr-2" />
                Voltar ao Dashboard
            </Link>
            {/* Ícones de Notificação e Perfil no Header */}
            <div className="flex items-center space-x-4">
                <Bell size={24} className="text-white hover:text-gray-200 cursor-pointer relative">
                    {/* Indicador de Notificação (se necessário) */}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-blue-600"></span>
                </Bell>
                <User size={24} className="text-white hover:text-gray-200 cursor-pointer" />
            </div>
        </div>
      </header>
      
      {/* --- SEÇÃO DE TÍTULO (BRANCA) --- */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
          <p className="text-sm text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
      </div>

      {/* --- CONTEÚDO PRINCIPAL EM GRID (Desktop) / FLEX (Mobile) --- */}
      <main className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          
          {/* 1. COLUNA ESQUERDA: PERFIL E ESTATÍSTICAS */}
          <div className="lg:col-span-1 space-y-8 mb-8 lg:mb-0">
            
            {/* CARD DE PERFIL */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
              {/* Avatar JPS */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md"
                style={{ backgroundColor: PRIMARY_BLUE }}
              >
                JPS
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                {user.nome}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{user.curso}</p>

              {/* Tag de Status */}
              <span
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white mb-4"
                style={{ backgroundColor: BUTTON_GREEN }}
              >
                {user.status}
              </span>

              <p className="text-sm text-gray-600 mb-6">
                Matrícula: <span className="font-medium">{user.matricula}</span>
              </p>

              {/* Botão Editar Perfil - Estilo do Protótipo */}
              <button
                className="w-full py-2 border border-blue-600 text-blue-600 font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition flex items-center justify-center text-sm"
                onClick={() => setActiveTab("Informações")}
              >
                <Edit size={16} className="mr-1" />
                Editar Perfil
              </button>
            </div>

            {/* CARD DE ESTATÍSTICAS */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Estatísticas
              </h3>
              <div className="space-y-3 text-gray-700">
                <StatItem
                  label="Procedimentos Participados"
                  value={user.stats.procedimentos}
                />
                <StatItem
                  label="Pontos de Colaboração"
                  value={user.stats.pontos}
                  icon={<Star size={16} className="text-yellow-500" />}
                />
                <StatItem
                  label="Avaliação Média"
                  value={user.stats.avaliacao}
                  icon={<Star size={16} className="text-yellow-500" />}
                />
              </div>
            </div>
          </div>

          {/* 2. COLUNA DIREITA: ABAS DE CONTEÚDO */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 min-h-[400px]">
              {/* NAVEGAÇÃO POR ABAS */}
              <div className="flex justify-start border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <TabButton key={tab.name} {...tab} />
                ))}
              </div>

              {/* CONTEÚDO DA ABA ATIVA */}
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente auxiliar para item de Estatística
const StatItem = ({ label, value, icon }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center font-bold text-blue-600"> {/* Valores em azul */}
      {icon && <span className="mr-1">{icon}</span>}
      {value}
    </div>
  </div>
);

export default Perfil;