import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/http';
import { 
  ArrowLeft, 
  Calendar, 
  Bell, 
  User, 
  Clock, 
  MapPin, 
  Clipboard, 
  AlertCircle, 
  Mail, 
  Info, 
  CheckCircle,
  CalendarPlus
} from 'lucide-react';

// Header
const DetalhesHeader = () => (
  <header className="bg-[#1E40FF] text-white p-4 shadow-md flex justify-between items-center">
    {/* Lado Esquerdo: Voltar e Título */}
    <div className='flex items-center gap-4'>
      <Link to="/voluntarios" className="flex items-center gap-2 hover:opacity-80">
        <ArrowLeft className="h-6 w-6" />
        <span className="hidden sm:inline">Voltar</span>
      </Link>
      <div>
        <h1 className="text-lg font-bold">Detalhes do Procedimento</h1>
        <p className="text-sm opacity-90 hidden sm:block">Informações completas sobre o procedimento agendado</p>
      </div>
    </div>
    
    {/* Lado Direito: Ícones */}
    <div className="flex items-center gap-6">
      <Calendar className="h-6 w-6 cursor-pointer hover:opacity-80" />
      <Bell className="h-6 w-6 cursor-pointer hover:opacity-80" />
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
        <User className="h-6 w-6" />
        <span className="font-medium hidden sm:inline">Perfil</span>
      </div>
    </div>
  </header>
);

// Card do Estudante
const EstudanteCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Estudante Responsável</h3>
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
        PO
      </div>
      <div>
        <p className="font-semibold text-gray-800">Pedro Oliveira</p>
        <p className="text-sm text-gray-500">8º semestre</p>
        <p className="text-sm text-gray-500">Matr: ODONTO456</p>
      </div>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <p>pedro.oliveira@edu.unifor.br</p>
      <p>(85) 99876-5432</p>
    </div>
  </div>
);

// Card de Ações
const AcoesCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
    <div className="space-y-3">
      <button className="w-full bg-[#1E40FF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
        <CalendarPlus className="h-5 w-5" />
        Adicionar ao Calendário
      </button>
      <button className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
        <Mail className="h-5 w-5" />
        Enviar Mensagem
      </button>
      <button className="w-full bg-white text-red-600 font-semibold py-3 px-4 rounded-lg border border-red-300 hover:bg-red-50">
        Cancelar Inscrição
      </button>
    </div>
  </div>
);

// Card de Lembrete
const LembreteCard = () => (
  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start gap-3">
    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
    <div className="text-sm text-blue-700">
      <h4 className="font-semibold mb-1">Lembrete</h4>
      <p>Você receberá uma notificação 24 horas antes do procedimento.</p>
    </div>
  </div>
);

// Importa utilitários de formatação
import { formatarData, formatarHorario } from '../utils/formatters';

// Componente Principal
export default function DetalhesProcedimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [procedimento, setProcedimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProcedimento = async () => {
      try {
        const response = await api.get(`/procedimentos/${id}`);
        setProcedimento(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erro ao carregar procedimento');
        toast.error('Erro ao carregar procedimento');
      } finally {
        setLoading(false);
      }
    };

    fetchProcedimento();
  }, [id]);

  const handleCancelarInscricao = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua inscrição?')) return;
    
    try {
      await api.post('/procedimentos/cancelar', { procedimentoId: id });
      toast.success('Inscrição cancelada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao cancelar inscrição');
    }
  };

  const handleInscrever = async () => {
    try {
      await api.post('/procedimentos/inscrever', { procedimentoId: id });
      toast.success('Inscrição realizada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao realizar inscrição');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>;

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">
    {error}
  </div>;

  if (!procedimento) return <div className="min-h-screen flex items-center justify-center">
    Procedimento não encontrado
  </div>;
  return (
    <div className="min-h-screen bg-gray-100">
      <DetalhesHeader />

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Esquerda (Principal) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Título e Status */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Restauração</h2>
                <p className="text-sm text-gray-500">ID: 4</p>
              </div>
              <span className="flex items-center gap-2 text-green-600 bg-green-100 font-medium px-3 py-1 rounded-full">
                <CheckCircle className="h-4 w-4" />
                Confirmado
              </span>
            </div>

            {/* Box de Informações */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-semibold text-gray-800">Domingo, 19 de outubro de 2025</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-semibold text-gray-800">09:00</p>
                  <p className="text-xs text-gray-500">Duração: 2h</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Local</p>
                  <p className="font-semibold text-gray-800">Clínica Odontológica - Bloco C</p>
                </div>
              </div>
            </div>

            {/* Box de Requisitos */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg flex items-start gap-4">
              <Clipboard className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Requisitos Específicos</h3>
                <p className="text-sm text-blue-700">
                  Paciente com cárie em dente anterior ou posterior que necessite de restauração. Não pode ter alergia a anestésicos locais.
                </p>
              </div>
            </div>

            {/* Box de Observações */}
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">Observações Importantes</h3>
                <p className="text-sm text-orange-700">
                  Por favor, chegue 15 minutos antes do horário marcado para preenchimento da ficha de anamnese. Não se alimente 2 horas antes do procedimento.
                </p>
              </div>
            </div>

          </div>

          {/* Coluna Direita (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <EstudanteCard />
            <AcoesCard />
            <LembreteCard />
          </div>

        </div>
      </main>
    </div>
  );
}