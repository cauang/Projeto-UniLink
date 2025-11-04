import React from 'react';
import { Calendar, CheckCircle2, Award, Bell, User, CalendarDays, Clock, MapPin, BadgeCheck, History } from 'lucide-react';

// Componente para o Header (CORRIGIDO)
// - Removido o erro PRIMARY_BLUE e refeito para parecer com o screenshot
const DashboardHeader = () => (
  <header className="bg-[#1E40FF] text-white p-4 shadow-md flex justify-between items-center">
    {/* Lado Esquerdo: Título e Curso */}
    <div>
      <h1 className="text-lg font-bold">Dashboard - Voluntário</h1>
      <p className="text-sm opacity-90">Matrícula: ODONTO</p>
    </div>
    
    {/* Lado Direito: Ícones */}
    <div className="flex items-center gap-6">
      <Calendar className="h-6 w-6 cursor-pointer hover:opacity-80" />
      <Bell className="h-6 w-6 cursor-pointer hover:opacity-80" />
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
        <User className="h-6 w-6" />
        <span className="font-medium">Perfil</span>
      </div>
    </div>
  </header>
);


// Componente para os Cards de Resumo (Sem alterações)
const ResumoCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
  </div>
);

// Componente para o Item de Procedimento (Disponível) (Sem alterações)
const ProcedimentoDisponivelItem = ({ titulo, estudante, data, hora, duracao, local }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="flex-1">
      <h3 className="font-semibold text-lg text-gray-800">{titulo}</h3>
      <p className="text-sm text-gray-600">Estudante: {estudante}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <CalendarDays className="h-4 w-4" />
        <span>{data}</span>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Clock className="h-4 w-4" />
      <div>
        <p className="font-medium">{hora}</p>
        <p className="text-xs">({duracao})</p>
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <MapPin className="h-4 w-4" />
      <span>{local}</span>
    </div>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-3 md:mt-0">
      <span className="flex items-center justify-center gap-1 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full w-full sm:w-auto">
        <BadgeCheck className="h-3 w-3" />
        Disponível
      </span>
      <button className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
        Inscreva-se
      </button>
    </div>
  </div>
);

// Componente para o Item do Histórico (Sem alterações)
const HistoricoItem = ({ titulo, data }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 rounded-full">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{titulo}</h3>
        <p className="text-sm text-gray-500">{data}</p>
      </div>
    </div>
    <span className="text-sm font-medium text-green-600">Concluído</span>
  </div>
);


export default function DashboardVoluntario() {
  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Seção de Resumo (Sem alterações) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <ResumoCard 
            icon={<Calendar className="h-6 w-6 text-blue-600" />}
            title="Procedimentos Agendados"
            value="1"
            color="bg-blue-100"
          />
          <ResumoCard 
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            title="Procedimentos Concluídos"
            value="3"
            color="bg-green-100"
          />
          <ResumoCard 
            icon={<Award className="h-6 w-6 text-purple-600" />}
            title="Pontos de Colaboração"
            value="30"
            color="bg-purple-100"
          />
        </section>

        {/* Seção de Procedimentos Disponíveis (Sem alterações) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Procedimentos Disponíveis</h2>
          <div className="space-y-4">
            <ProcedimentoDisponivelItem 
              titulo="Limpeza e Profilaxia"
              estudante="Maria"
              data="18 de out. de 2025"
              hora="14:00"
              duracao="indefinido"
              local="Clínica Odontológica - Bloco A"
            />
            <ProcedimentoDisponivelItem 
              titulo="Exame Periodontal"
              estudante="João"
              data="20 de out. de 2025"
              hora="10:00"
              duracao="1hr"
              local="Clínica Odontológica - Bloco B"
            />
            <ProcedimentoDisponivelItem 
              titulo="Aplicação de Flúor"
              estudante="Ana"
              data="22 de out. de 2025"
              hora="15:30"
              duracao="45min"
              local="Clínica Odontológica - Bloco A"
            />
          </div>
        </section>

        {/* Seção de Histórico (Sem alterações) */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Participações
          </h2>
          <p className="text-sm text-gray-500 mb-4">Procedimentos que você já participou</p>
          <div className="space-y-4">
            <HistoricoItem 
              titulo="Limpeza e Profilaxia"
              data="15 de set. de 2025"
            />
            <HistoricoItem 
              titulo="Exame Clínico"
              data="20 de ago. de 2025"
            />
            <HistoricoItem 
              titulo="Aplicação de Flúor"
              data="10 de jul. de 2025"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

