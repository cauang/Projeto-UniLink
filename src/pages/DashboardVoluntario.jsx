import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Award, 
  Bell, 
  User, 
  CalendarDays, 
  Clock, 
  MapPin, 
  History,
  Check,
  Info,
  X,
  Loader2,
  AlertTriangle,
  Users // Ícone para "Pontos de Colaboração" da nova imagem
} from 'lucide-react';

// --- Mock API para fins de demonstração ---
// Simula o banco de dados
const mockDB = {
  inscricoes: [
    {
      id: "restauracao-123",
      titulo: "Restauração",
      estudante: "Pedro Oliveira",
      data: "19 de out. de 2025",
      hora: "09:00 (2h)",
      local: "Clínica Odontológica - Bloco C",
      status: "Confirmado"
    }
  ],
  disponiveis: [
    {
      id: "limpeza-456",
      titulo: "Limpeza e Profilaxia",
      estudante: "Maria Silva",
      data: "18 de out. de 2025",
      hora: "14:00 (1h30min)",
      local: "Clínica Odontológica - Bloco A",
      status: "Disponível"
    },
    {
      id: "exame-789",
      titulo: "Exame Periodontal",
      estudante: "João Santos",
      data: "20 de out. de 2025",
      hora: "10:00 (1h)",
      local: "Clínica Odontológica - Bloco B",
      status: "Disponível"
    },
    {
      id: "fluor-101",
      titulo: "Aplicação de Flúor",
      estudante: "Ana Costa",
      data: "22 de out. de 2025",
      hora: "15:30 (45min)",
      local: "Clínica Odontológica - Bloco A",
      status: "Disponível"
    }
  ],
  historico: [
    { id: "h1", titulo: "Limpeza e Profilaxia", data: "15 de set. de 2025", status: "Confirmado" },
    { id: "h2", titulo: "Exame Clínico", data: "20 de ago. de 2025", status: "Confirmado" },
    { id: "h3", titulo: "Aplicação de Flúor", data: "10 de jul. de 2025", status: "Confirmado" },
  ],
  summary: {
    agendados: 1,
    concluidos: 3,
    pontos: 30
  }
};

// Simula a API
const mockApi = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/meus-agendados')) {
          resolve({ data: mockDB.inscricoes });
        } else if (url.includes('/disponiveis')) {
          resolve({ data: mockDB.disponiveis });
        } else if (url.includes('/historico')) {
          resolve({ data: mockDB.historico });
        } else if (url.includes('/summary')) {
          resolve({ data: mockDB.summary });
        }
      }, 500);
    });
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/inscrever')) {
          const item = mockDB.disponiveis.find(p => p.id === data.id);
          mockDB.disponiveis = mockDB.disponiveis.filter(p => p.id !== data.id);
          mockDB.inscricoes.push(item);
          mockDB.summary.agendados++;
          resolve({ data: item });
        }
        if (url.includes('/cancelar')) {
          const item = mockDB.inscricoes.find(p => p.id === data.id);
          mockDB.inscricoes = mockDB.inscricoes.filter(p => p.id !== data.id);
          mockDB.disponiveis.push(item);
          mockDB.summary.agendados--;
          resolve({ data: item });
        }
      }, 300);
    });
  }
};

// --- Fim da Mock API ---

// Para testar, usamos a mockApi
const api = mockApi;
// Para produção, comente 'const api = mockApi;' e descomente a linha abaixo
// import api from '../api/http';


// Componente para o Header
const DashboardHeader = () => (
  <header className="bg-[#1E40FF] text-white p-4 shadow-md flex justify-between items-center">
    {/* Lado Esquerdo: Título e Matrícula */}
    <div>
      <h1 className="text-lg font-bold">Voluntário</h1>
      <p className="text-sm opacity-90">Matrícula: Voluntário</p>
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

// Componente para os Cards de Resumo
const ResumoCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
  </div>
);

// Componente para o Item de "Minhas Inscrições"
const ProcedimentoInscritoItem = ({ item, onCancelar }) => (
  // Fundo azul claro e borda azul
  <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
      {/* Informações Principais */}
      <div className="flex-1">
        {/* Título grande */}
        <h3 className="font-semibold text-2xl text-gray-800 mb-1">{item.titulo}</h3>
        {/* Estudante em linha separada */}
        <p className="text-sm text-gray-600 mb-4">Estudante: {item.estudante}</p>
        
        {/* Informações de data, hora e local com ícones azuis */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-blue-700">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" /> {item.data}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> {item.hora}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" /> {item.local}
          </span>
        </div>
      </div>
      
      {/* Ações (agora empilhadas verticalmente) */}
      <div className="flex flex-col items-stretch gap-2 w-full md:w-auto">
        {/* Badge "Confirmado" (no topo das ações) */}
        <span className="flex items-center justify-center gap-1 text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full w-full">
          <Check className="h-4 w-4" /> {item.status}
        </span>
        
        {/* Botão "Ver Detalhes" com borda azul */}
        <Link 
          to={`/procedimento/${item.id}`} // Link para detalhes
          className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-50 text-center"
        >
          Ver Detalhes
        </Link>
        
        {/* Botão "Cancelar" com borda vermelha */}
        <button 
          onClick={() => onCancelar(item.id)} // Ação de cancelar
          className="bg-white text-red-600 font-semibold px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 flex items-center justify-center gap-1"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>
      </div>
    </div>
  </div>
);

// Componente para o Item de "Procedimentos Disponíveis"
const ProcedimentoDisponivelItem = ({ item, onInscrever }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Informações */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800">{item.titulo}</h3>
        <p className="text-sm text-gray-600">Estudante: {item.estudante}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
          <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {item.data}</span>
          <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {item.hora}</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {item.local}</span>
        </div>
      </div>
      
      {/* Ação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto mt-3 md:mt-0">
        <span className="flex items-center justify-center gap-1 text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full w-full sm:w-auto">
          <Info className="h-3 w-3" /> {item.status}
        </span>
        <button 
          onClick={() => onInscrever(item.id)} // Ação de inscrever
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
        >
          Inscrever-se
        </button>
      </div>
    </div>
  </div>
);

// Componente para o Item do Histórico
const HistoricoItem = ({ item }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 rounded-full">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{item.titulo}</h3>
        <p className="text-sm text-gray-500">{item.data}</p>
      </div>
    </div>
    <span className="text-sm font-medium text-green-600">{item.status}</span>
  </div>
);

// Componente de Carregamento
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[60vh]">
    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
  </div>
);

// Componente de Erro
const ErrorDisplay = ({ message }) => (
  <div className="flex flex-col justify-center items-center h-[60vh] text-red-600 bg-red-50 p-6 rounded-lg">
    <AlertTriangle className="h-12 w-12 mb-4" />
    <h2 className="text-xl font-semibold mb-2">Erro ao carregar dados</h2>
    <p>{message}</p>
  </div>
);

// Componente Principal do Dashboard
export default function DashboardVoluntario() {
  const [summary, setSummary] = useState({ agendados: 0, concluidos: 0, pontos: 0 });
  const [inscricoes, setInscricoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para buscar todos os dados na montagem
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, inscricoesRes, disponiveisRes, historicoRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/meus-agendados'),
          api.get('/dashboard/disponiveis'),
          api.get('/dashboard/historico')
        ]);
        setSummary(summaryRes.data);
        setInscricoes(inscricoesRes.data);
        setDisponiveis(disponiveisRes.data);
        setHistorico(historicoRes.data);
      } catch (err) {
        setError("Não foi possível carregar os dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Função para se inscrever
  const handleInscricao = async (id) => {
    try {
      // Chama a API para se inscrever
      await api.post('/procedimentos/inscrever', { id });
      
      // Atualiza o estado local para refletir a mudança
      const itemMovido = disponiveis.find(p => p.id === id);
      if (itemMovido) {
        setDisponiveis(disponiveis.filter(p => p.id !== id));
        setInscricoes([itemMovido, ...inscricoes]); // Adiciona no topo da lista
        setSummary({ ...summary, agendados: summary.agendados + 1 });
      }
    } catch (err) {
      console.error("Erro ao inscrever:", err);
      // Aqui você pode adicionar um toast de erro
    }
  };

  // Função para cancelar inscrição
  const handleCancelamento = async (id) => {
    try {
      // Chama a API para cancelar
      await api.post('/procedimentos/cancelar', { id });
      
      // Atualiza o estado local
      const itemMovido = inscricoes.find(p => p.id === id);
      if (itemMovido) {
        setInscricoes(inscricoes.filter(p => p.id !== id));
        setDisponiveis([itemMovido, ...disponiveis]); // Adiciona de volta
        setSummary({ ...summary, agendados: summary.agendados - 1 });
      }
    } catch (err) {
      console.error("Erro ao cancelar:", err);
      // Aqui você pode adicionar um toast de erro
    }
  };

  // Função para renderizar o conteúdo principal
  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;

    return (
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
            icon={<Users className="h-6 w-6 text-purple-600" />} // Ícone atualizado
            title="Pontos de Colaboração"
            value={summary.pontos}
            color="bg-purple-100"
          />
        </section>

        {/* Seção de Minhas Inscrições */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Minhas Inscrições</h2>
          <p className="text-sm text-gray-500 mb-4">Procedimentos em que você está inscrito</p>
          <div className="space-y-4">
            {inscricoes.length > 0 ? (
              inscricoes.map(item => (
                <ProcedimentoInscritoItem 
                  key={item.id} 
                  item={item} 
                  onCancelar={handleCancelamento} 
                />
              ))
            ) : (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">Você não está inscrito em nenhum procedimento.</p>
            )}
          </div>
        </section>

        {/* Seção de Procedimentos Disponíveis */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Procedimentos Disponíveis</h2>
          <div className="space-y-4">
            {disponiveis.length > 0 ? (
              disponiveis.map(item => (
                <ProcedimentoDisponivelItem 
                  key={item.id} 
                  item={item} 
                  onInscrever={handleInscricao} 
                />
              ))
            ) : (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">Nenhum procedimento disponível no momento.</p>
            )}
          </div>
        </section>

        {/* Seção de Histórico */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Participações
          </h2>
          <p className="text-sm text-gray-500 mb-4">Procedimentos que você já participou</p>
          <div className="space-y-4">
            {historico.length > 0 ? (
              historico.map(item => (
                <HistoricoItem key={item.id} item={item} />
              ))
            ) : (
              <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">Seu histórico está vazio.</p>
            )}
          </div>
        </section>
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />
      {renderContent()}
    </div>
  );
}


