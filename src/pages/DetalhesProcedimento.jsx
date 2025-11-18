import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/http';
import { 
  ArrowLeft, Calendar, User, Clock, MapPin, 
  Clipboard, AlertCircle, Mail, Phone, Info, 
  CheckCircle, CalendarPlus, X 
} from 'lucide-react';

 
import { formatarData, formatarHorario } from '../utils/formatters';
import useAuth from '../store/useAuth';

import CalendarWidget from '../components/CalendarWidget'; 

// =================================================================
const ConfirmacaoCancelamento = ({ 
  isOpen, onClose, onConfirm, proc, isLoading, pendingActionType 
}) => {
  if (!isOpen || !proc) return null;

  const isSolicitacao = pendingActionType === 'solicitacao';
  
  // Textos dinâmicos baseados no tipo de ação
  const title = isSolicitacao ? 'Cancelar Solicitação' : 'Cancelar Inscrição';
  const description = isSolicitacao
    ? 'Tem certeza que deseja cancelar este procedimento? Isso removerá o evento do sistema.'
    : `Tem certeza que deseja cancelar sua inscrição no procedimento "${proc.titulo || 'selecionado'}"?`;
  const infoNote = isSolicitacao
    ? 'Ao confirmar, o sistema removerá este agendamento. Estudantes e voluntários serão notificados.'
    : 'Ao confirmar, o estudante será notificado sobre o cancelamento, e sua vaga ficará disponível.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabeçalho Visual */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full text-red-600">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-bold text-red-900">{title}</h2>
          
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-red-300 hover:text-red-600 transition-colors rounded-full p-1 hover:bg-red-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6">
          <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>

          {/* Card de Detalhes do Procedimento */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-[#1E40FF]" />
              <span className="font-medium">Data:</span> 
              <span className="text-slate-600">{formatarData(proc.data)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Clock className="w-4 h-4 text-[#1E40FF]" />
              <span className="font-medium">Horário:</span> 
              <span className="text-slate-600">{formatarHorario(proc.horario)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <User className="w-4 h-4 text-[#1E40FF]" />
              <span className="font-medium">Estudante:</span> 
              <span className="text-slate-600">{proc.estudante_nome || 'Não informado'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mb-6">{infoNote}</p>

          {/* Botões de Ação */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Manter {isSolicitacao ? 'Procedimento' : 'Inscrição'}
            </button>

            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md shadow-red-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Cancelando...
                </>
              ) : (
                `Confirmar Cancelamento`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const DetalhesHeader = ({ to = '/dashboard', onOpenCalendar }) => (
  <header className="bg-[#1E40FF] text-white shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between h-36 px-6 md:px-10">
      <div className='flex items-center gap-4'>
        <Link to={to} className="flex items-center gap-2 hover:opacity-90 text-white">
          <ArrowLeft className="h-6 w-6" />
          <span className="hidden sm:inline">Voltar</span>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Detalhes do Procedimento</h1>
          <p className="text-sm opacity-90 hidden md:block">Informações completas sobre o procedimento agendado</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={onOpenCalendar} className="p-0"><Calendar size={22} className="cursor-pointer hover:opacity-80" /></button>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90">
          <Link to="/perfil"><User className="h-6 w-6" />
          
          </Link>
          <span className="font-medium hidden sm:inline">Perfil</span>
        </div>
      </div>
    </div>
  </header>
);

// Generic person card (Voluntário / Estudante)
const PersonCard = ({ person, role = 'Voluntário' }) => {
  const nome = person?.voluntario_nome || person?.estudante_nome || person?.nome || '—';
  const curso = person?.curso || person?.estudante_semestre || person?.semestre || '';
  const matricula = person?.voluntario_matricula || person?.estudante_matricula || person?.matricula || '—';
  const email = person?.voluntario_email || person?.estudante_email || person?.email || '—';
  const telefone = person?.voluntario_telefone || person?.estudante_telefone || person?.telefone || '—';
  const initials = nome.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{role}</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold ring-4 ring-green-50">
          {initials || '—'}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{nome}</p>
          {curso ? <p className="text-sm text-gray-500">{curso}</p> : null}
          <p className="text-sm text-gray-500">Mat: {matricula}</p>
        </div>
      </div>
      <hr className="border-t border-gray-100 my-3" />
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{telefone}</span>
        </div>
      </div>
    </div>
  );
};

// Card de Ações (com estilização dos botões de cancelamento atualizada)
const AcoesCard = ({ procedimento, onAddCalendar, onSendMessage, onCancel, onInscrever, onCancelSolicitacao, isStudent = false, currentUser = {} }) => {
  const status = (procedimento?.status || '').toLowerCase();
  const userId = currentUser?.id_usuario || currentUser?.id || currentUser?.usuario_id || currentUser?.idUser;
  const ownerId = procedimento?.estudante_id || procedimento?.estudante || procedimento?.estudante_usuario_id || procedimento?.usuario_id || procedimento?.id_usuario;
  const isOwner = String(userId) && String(ownerId) && String(userId) === String(ownerId);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
      <div className="space-y-3">
        <button onClick={onAddCalendar} className="w-full bg-[#1E40FF] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
          <CalendarPlus className="h-5 w-5" />
          Adicionar ao Calendário
        </button>

        {!isStudent && (
          <button onClick={onSendMessage} className="w-full bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Enviar Mensagem
          </button>
        )}

        {isStudent ? (
          isOwner ? (
            <button 
                onClick={onCancelSolicitacao} 
                className="w-full bg-white text-red-600 font-semibold py-3 px-4 rounded-lg border border-red-300 hover:bg-red-50 hover:border-red-400 flex items-center justify-center gap-2 transition-all group"
            >
              <X className="h-5 w-5 text-red-500 group-hover:text-red-700 transition-colors" />
              Cancelar Solicitação
            </button>
          ) : (
            null
          )
        ) : (
          (status === 'disponivel' && onInscrever) ? (
            <button onClick={onInscrever} className="w-full bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700">
              Inscrever-se
            </button>
          ) : (
            <button 
                onClick={onCancel} 
                className="w-full bg-white text-red-600 font-semibold py-3 px-4 rounded-lg border border-red-300 hover:bg-red-50 hover:border-red-400 flex items-center justify-center gap-2 transition-all group"
            >
              <AlertCircle className="h-5 w-5 text-red-500 group-hover:text-red-700 transition-colors" />
              Cancelar Inscrição
            </button>
          )
        )}
      </div>
    </div>
  );
};

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

export default function DetalhesProcedimento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const tipoNormalized = (user?.tipo_usuario || user?.tipo || '').toString().toLowerCase();
  const dashboardTo = tipoNormalized.includes('estud') ? '/dashboard-estudante' : '/dashboard';
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [procedimento, setProcedimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ESTADO DO MODAL E AÇÕES
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [pendingActionType, setPendingActionType] = useState(null); // 'inscricao' ou 'solicitacao'
  const [actionLoading, setActionLoading] = useState(false);

  const openCancelModal = (type) => {
    setPendingActionType(type);
    setIsCancelModalOpen(true);
  };
  
  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setPendingActionType(null);
  };

  const handleConfirmCancel = async () => {
    setActionLoading(true);
    
    try {
      if (pendingActionType === 'inscricao') {
        await api.post('/procedimentos/cancelar', { procedimentoId: id });
        toast.success('Inscrição cancelada com sucesso!');
      } 
      else if (pendingActionType === 'solicitacao') {
        try {
          await api.post('/procedimentos/cancelar-solicitacao', { procedimentoId: id });
        } catch {
          await api.post('/procedimentos/cancelar', { procedimentoId: id });
        }
        toast.success('Solicitação cancelada com sucesso!');
      }
      
      closeCancelModal();
      navigate(dashboardTo);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao cancelar');
      closeCancelModal();
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleInscrever = async () => {
    try {
      await api.post('/procedimentos/inscrever', { procedimentoId: id });
      toast.success('Inscrição realizada com sucesso!');
      navigate(dashboardTo);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao realizar inscrição');
    }
  };


  const formatICSTime = (d) => new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const parseDurationToMinutes = (dur) => {
    if (!dur) return 60;
    if (typeof dur === 'number') return dur;
    const s = String(dur).toLowerCase();
    const mMatch = s.match(/(\d+)\s*min/);
    if (mMatch) return parseInt(mMatch[1], 10);
    const hMatch = s.match(/(\d+(?:\.\d+)?)\s*h/);
    if (hMatch) return Math.round(parseFloat(hMatch[1]) * 60);
    const onlyNumber = s.match(/^(\d+)$/);
    if (onlyNumber) return parseInt(onlyNumber[1], 10);
    return 60;
  };

  const handleAdicionarCalendario = () => {
    try {
      const datePart = procedimento.data; 
      const timePart = procedimento.horario || '09:00';
      const start = new Date(`${datePart}T${timePart}`);
      const minutes = parseDurationToMinutes(procedimento.duracao);
      const end = new Date(start.getTime() + minutes * 60000);

      const ics = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
        `UID:procedimento-${procedimento.id}@unilink`, `DTSTAMP:${formatICSTime(new Date())}`,
        `DTSTART:${formatICSTime(start)}`, `DTEND:${formatICSTime(end)}`,
        `SUMMARY:${procedimento.titulo || 'Procedimento'}`,
        `DESCRIPTION:${(procedimento.requisitos || procedimento.observacoes || '').replace(/\n/g, ' ')}`,
        `LOCATION:${procedimento.local || ''}`, 'END:VEVENT', 'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(procedimento.titulo || 'evento').replace(/\s+/g,'_')}.ics`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      toast.success('Arquivo .ics gerado — importe no seu calendário.');
    } catch (err) {
      console.error('Erro ao gerar calendário', err);
      toast.error('Não foi possível gerar o calendário');
    }
  };

  const handleEnviarMensagem = () => {
    const to = procedimento.voluntario_email || procedimento.estudante_email || procedimento.email || '';
    const subject = encodeURIComponent(`Sobre o procedimento: ${procedimento.titulo || ''}`);
    const body = encodeURIComponent(`Olá,\n\nReferente ao procedimento "${procedimento.titulo || ''}" marcado para ${formatarData(procedimento.data)} às ${procedimento.horario || ''}.\n\n`);
    if (!to) {
      toast('Email do contato não disponível.');
      return;
    }
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!procedimento) return <div className="min-h-screen flex items-center justify-center">Procedimento não encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* CHAMADA DO MODAL */}
      <ConfirmacaoCancelamento
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleConfirmCancel}
        proc={procedimento}
        isLoading={actionLoading}
        pendingActionType={pendingActionType}
      />

      <DetalhesHeader to={dashboardTo} onOpenCalendar={async () => {
        try {
          const tipo = tipoNormalized;
          let res;
          if (tipo.includes('estud')) res = await api.get('/procedimentos/meus-procedimentos');
          else res = await api.get('/procedimentos/meus-agendados');
          const rows = res?.data || [];
          const ev = rows.map(r => ({ date: r.data || r.date, title: r.titulo || r.nome || r.title || 'Procedimento' }));
          setCalendarEvents(ev);
          setShowCalendar(true);
        } catch (err) {
          console.error(err);
          toast.error('Não foi possível carregar o calendário.');
        }
      }} />
      <CalendarWidget visible={showCalendar} onClose={() => setShowCalendar(false)} events={calendarEvents.length ? calendarEvents : [{date: procedimento.data, title: procedimento.titulo}]} />

      <main className="p-6 md:p-10 max-w-7xl mx-auto -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              {/* Título e Status */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">{procedimento.titulo || 'Procedimento'}</h2>
                  <p className="text-sm text-gray-500 mt-1">ID: {procedimento.id || id}</p>
                </div>
                <span className={`${procedimento.status === 'confirmado' || procedimento.status === 'agendado' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'} inline-flex items-center gap-2 font-medium px-3 py-1 rounded-lg text-sm`}> 
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {procedimento.status ? procedimento.status.charAt(0).toUpperCase() + procedimento.status.slice(1) : '—'}
                </span>
              </div>

              {/* Box de Informações */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <div className="flex items-start gap-4">
                   <div className="bg-blue-50 border border-blue-100 text-blue-600 rounded-md p-2 flex items-center justify-center"><Calendar className="h-5 w-5" /></div>
                   <div><p className="text-sm text-gray-500">Data</p><p className="font-semibold text-gray-800">{formatarData(procedimento.data)}</p></div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-blue-50 border border-blue-100 text-blue-600 rounded-md p-2 flex items-center justify-center"><Clock className="h-5 w-5" /></div>
                   <div><p className="text-sm text-gray-500">Horário</p><p className="font-semibold text-gray-800">{formatarHorario(procedimento.horario)}</p><p className="text-xs text-gray-500">Duração: {procedimento.duracao || '—'}</p></div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="bg-blue-50 border border-blue-100 text-blue-600 rounded-md p-2 flex items-center justify-center"><MapPin className="h-5 w-5" /></div>
                   <div><p className="text-sm text-gray-500">Local</p><p className="font-semibold text-gray-800">{procedimento.local || '—'}</p></div>
                </div>
              </div>

              <hr className="my-6 border-gray-100" />

              {/* Requisitos */}
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-md flex items-start gap-4">
                <Clipboard className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div><h3 className="text-lg font-semibold text-blue-800 mb-2">Requisitos Específicos</h3><p className="text-sm text-blue-700">{procedimento.requisitos || '—'}</p></div>
              </div>
              
              {/* Observações */}
              <div className="bg-orange-50 border border-orange-100 p-5 rounded-md flex items-start gap-4 mt-6">
                <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div><h3 className="text-lg font-semibold text-orange-800 mb-2">Observações Importantes</h3><p className="text-sm text-orange-700">{procedimento.observacoes || '—'}</p></div>
              </div>

              {/* Equipamentos Necessários */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipamentos Necessários</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(() => {
                    const raw = procedimento.equipamentos || procedimento.equipamentos_necessarios || procedimento.equipamento || procedimento.equipamentos_list || '';
                    let items = [];
                    if (Array.isArray(raw)) items = raw;
                    else if (typeof raw === 'string' && raw.trim().length > 0) items = raw.split(/[,;\n]\s*/).map(s => s.trim()).filter(Boolean);
                    if (items.length === 0) items = procedimento.itens_equipamento || procedimento.equipamentos_text || [];
                    return (items.length === 0) ? (<p className="text-sm text-gray-600">—</p>) : (
                      items.map((it, idx) => (<div key={idx} className="flex items-center gap-3 text-sm text-gray-700"><CheckCircle className="h-4 w-4 text-green-500" /><span>{it}</span></div>))
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita (Sidebar) */}
          <div className="lg:col-span-1 space-y-6">
            <PersonCard person={procedimento} role={procedimento.voluntario_nome ? 'Voluntário' : 'Estudante Responsável'} />
            <AcoesCard
              procedimento={procedimento}
              onAddCalendar={handleAdicionarCalendario}
              onSendMessage={handleEnviarMensagem}
              // PASSANDO A FUNÇÃO QUE ABRE O MODAL
              onCancel={() => openCancelModal('inscricao')}
              onInscrever={handleInscrever}
              onCancelSolicitacao={() => openCancelModal('solicitacao')}
              isStudent={tipoNormalized.includes('estud')}
              currentUser={user}
            />
            <LembreteCard />
          </div>
        </div>
      </main>
    </div>
  );
}