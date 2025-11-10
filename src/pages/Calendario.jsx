import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  List,
  User,
  Bell,
  Calendar as CalendarIcon, // Renomeado para evitar conflito com o nome do componente
  Loader2,
  AlertTriangle,
} from "lucide-react";

// OBSERVAÇÃO: A importação abaixo (api) não é necessária no contexto atual
// import api from "../api/mock.js"; 

// --- Constantes ---
// Cor principal do layout da imagem
const PRIMARY_GREEN = "#00B050"; 

// --- Dados Mock do Calendário (Ajustado para Outubro 2025) ---
const mockProcedimentos = [
  {
    id: 101,
    data: "2025-10-16",
    titulo: "Limpeza e...",
    horario: "14:00",
    status: "Confirmado",
    bgColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 102,
    data: "2025-10-20",
    titulo: "Exame",
    horario: "10:00",
    status: "Confirmado",
    bgColor: "bg-green-100 text-green-800",
  },
  {
    id: 103,
    data: "2025-10-23",
    titulo: "Retorno",
    horario: "08:00",
    status: "Confirmado",
    bgColor: "bg-yellow-100 text-yellow-800",
  },
];

// --- Lógica de Datas ---
const formatarMesAno = (date) => {
  return date.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  }).replace(/ de /g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase()); // Ex: Outubro De 2025
};

const obterPrimeiroDiaDaSemana = (mes, ano) => {
    const data = new Date(ano, mes, 1);
    // Ajusta para a semana começar no Domingo (0)
    return data.getDay(); 
}

const obterTotalDiasNoMes = (mes, ano) => {
    // Meses são 0-indexed, dia 0 do próximo mês retorna o último dia do mês atual.
    return new Date(ano, mes + 1, 0).getDate();
}


// --- Componente Detalhes do Dia (Card Lateral) ---
const DetalhesDoDia = ({ dataSelecionada, procedimentosDoDia }) => {
    const dataFormatada = dataSelecionada 
        ? dataSelecionada.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Selecione um dia';

    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden h-full">
            <h3 className="text-lg font-semibold text-white p-4" style={{ backgroundColor: PRIMARY_GREEN }}>
                {dataFormatada}
            </h3>
            <div className="p-6">
                {procedimentosDoDia && procedimentosDoDia.length > 0 ? (
                    <div className="space-y-4">
                        {procedimentosDoDia.map(proc => (
                            <div key={proc.id} className="p-3 bg-gray-50 border rounded-lg">
                                <p className="font-semibold text-gray-800">{proc.titulo}</p>
                                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                    <Clock size={14} /> {proc.horario}
                                </p>
                                <span className="inline-block text-xs font-medium px-2 py-0.5 mt-2 rounded-full"
                                    style={{ 
                                        backgroundColor: proc.status === 'Confirmado' ? '#D1FAE5' : '#FEF3C7',
                                        color: proc.status === 'Confirmado' ? '#059669' : '#D97706'
                                    }}
                                >
                                    {proc.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
                        <CalendarIcon size={48} className="mb-4" />
                        <p>
                            Clique em um dia no calendário
                            <br />
                            para ver os detalhes
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Componente Principal ---
export default function Calendario() {
  // Ajustamos a data inicial para OUTUBRO DE 2025 (mês 9) para replicar a imagem
  const [dataAtual, setDataAtual] = useState(new Date(2025, 9, 1)); 
  const [procedimentos, setProcedimentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const mes = dataAtual.getMonth();
  const ano = dataAtual.getFullYear();
  const totalDias = obterTotalDiasNoMes(mes, ano);
  const primeiroDiaSemana = obterPrimeiroDiaDaSemana(mes, ano);

  // Array representando os dias do mês
  const diasDoMes = Array.from({ length: totalDias }, (_, i) => new Date(ano, mes, i + 1));
  
  // Array de nomes dos dias da semana (PT-BR)
  const nomesDiasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const totalConfirmados = mockProcedimentos.filter(p => p.status === 'Confirmado').length;
  const totalPendentes = mockProcedimentos.filter(p => p.status === 'Pendente').length;
  
  // --- Funções de Data e Procedimentos ---
  
  const buscarProcedimentos = async () => {
    // Mantemos a mockagem simples, mas em produção chamaria a API
    setLoading(true);
    setError(null);
    try {
      // Simula um delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 300));
      setProcedimentos(mockProcedimentos);
    } catch (err) {
      setError("Falha ao carregar procedimentos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProcedimentos();
    // Limpa o dia selecionado ao mudar de mês
    setDiaSelecionado(null); 
  }, [mes, ano]);


  const irParaMesAnterior = () => {
    setDataAtual(new Date(ano, mes - 1, 1));
  };

  const irParaProximoMes = () => {
    setDataAtual(new Date(ano, mes + 1, 1));
  };
  
  // Mapeia os procedimentos por data para facilitar a renderização
  const procedimentosPorData = procedimentos.reduce((acc, proc) => {
    const parts = proc.data.split('-'); // Espera formato YYYY-MM-DD
    const dataKey = `${parseInt(parts[2])}`; // Chave será o dia do mês (ex: "16")
    if (!acc[dataKey]) {
      acc[dataKey] = [];
    }
    acc[dataKey].push(proc);
    return acc;
  }, {});
  
  // Função para checar se há agendamentos para um dia específico
  const getProcedimentosDoDia = (date) => {
    const dia = date.getDate().toString();
    return procedimentosPorData[dia] || [];
  };
  
  const handleDiaClick = (date) => {
      setDiaSelecionado(date);
  };
  
  const procedimentosDiaSelecionado = diaSelecionado 
      ? getProcedimentosDoDia(diaSelecionado)
      : [];


  // --- Renderização do Componente ---
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Fixo - Ajustado para o design da imagem */}
      <header className="w-full text-white p-4 shadow-md" style={{ backgroundColor: PRIMARY_GREEN }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/voluntarios" // ✅ CORRIGIDO: Agora aponta para a rota definida no App.jsx
              className="text-white hover:opacity-80 flex items-center"
            >
              <ChevronLeft size={24} />
              Voltar
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">
              Calendário de Procedimentos
            </h1>
            <p className="text-sm opacity-90 hidden sm:block">
              Visualize todos os seus agendamentos
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell size={22} className="cursor-pointer hover:opacity-80" />
              {/* Notificação Simples */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
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
      
      {/* Conteúdo Principal */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna 1: Calendário */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xl border border-gray-200 p-6">
            
            {/* Controles do Calendário */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 uppercase">
                {formatarMesAno(dataAtual)}
              </h2>
              <div className="flex gap-1 border border-gray-300 rounded-lg divide-x divide-gray-300">
                <button
                  onClick={irParaMesAnterior}
                  className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-l-lg"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={irParaProximoMes}
                  className="p-2 text-gray-600 hover:bg-gray-100 transition rounded-r-lg"
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 border-b border-gray-300 pb-2">
              {nomesDiasSemana.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Espaços vazios para o início da semana */}
              {[...Array(primeiroDiaSemana)].map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Dias do Mês */}
              {diasDoMes.map((date) => {
                const isCurrentDay = date.toDateString() === new Date().toDateString();
                const isSelected = diaSelecionado && date.toDateString() === diaSelecionado.toDateString();
                const proceds = getProcedimentosDoDia(date);
                
                // Formato YYYY-MM-DD para comparação com mockProcedimentos
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                const dataKey = `${yyyy}-${mm}-${dd}`;
                
                const classes = [
                    'aspect-square', 'py-1', 'flex', 'flex-col', 'items-center', 'justify-start', 'rounded-sm', 'cursor-pointer', 'text-xs', 'transition', 'duration-150', 'text-gray-800'
                ];
                
                if (isCurrentDay) {
                    classes.push('bg-blue-50', 'border-2', 'border-blue-300');
                } else if (isSelected) {
                    classes.push('bg-blue-100', 'border', 'border-blue-400');
                } else {
                    classes.push('hover:bg-gray-100');
                }


                return (
                  <div
                    key={date.toDateString()}
                    className={classes.join(' ')}
                    onClick={() => handleDiaClick(date)}
                  >
                    <span className={`font-semibold text-sm w-full text-left pl-1 pb-1 ${isCurrentDay ? 'text-blue-700' : ''}`}>
                        {date.getDate()}
                    </span>
                    {proceds.map(proc => (
                        <div key={proc.id} 
                             className="w-[95%] p-0.5 text-center truncate rounded-sm font-medium" 
                             style={{ backgroundColor: PRIMARY_GREEN, color: 'white', opacity: 0.9 }}>
                            <p className="text-[10px] leading-tight">{proc.horario} {proc.titulo}</p>
                        </div>
                    ))}
                  </div>
                );
              })}
            </div>
            
            {/* Legenda */}
            <div className="mt-6 flex gap-4 text-sm text-gray-600">
                <label className="flex items-center gap-1">
                    <input type="checkbox" checked={true} readOnly className="form-checkbox text-blue-500 h-4 w-4 rounded" />
                    Hoje
                </label>
                <label className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: PRIMARY_GREEN }}></div>
                    Procedimento agendado
                </label>
            </div>
          </div>
          
          {/* Coluna 2: Detalhes do Dia e Resumo */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Detalhes do Dia */}
            <DetalhesDoDia 
                dataSelecionada={diaSelecionado} 
                procedimentosDoDia={procedimentosDiaSelecionado} 
            />

            {/* Resumo do Mês */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <h3 className="text-lg font-semibold text-white p-4" style={{ backgroundColor: PRIMARY_GREEN }}>
                    Resumo do Mês
                </h3>
                <div className="p-6 space-y-3 text-gray-700">
                    <div className="flex justify-between items-center text-base font-semibold">
                        <span>Total de Procedimentos</span>
                        <span className="text-xl font-bold">{mockProcedimentos.length}</span>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: PRIMARY_GREEN }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t pt-3">
                        <span>Confirmados</span>
                        <span className="font-medium text-green-600">{totalConfirmados}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Pendentes</span>
                        <span className="font-medium text-yellow-600">{totalPendentes}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}