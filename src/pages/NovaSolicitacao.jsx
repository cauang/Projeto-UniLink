import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/http';
import useAuth from '../store/useAuth';
import toast from 'react-hot-toast';
import { ChevronLeft, CalendarDays, Clock, MapPin } from 'lucide-react';
import CalendarWidget from '../components/CalendarWidget';

export default function NovaSolicitacao() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    observacoes: '',
    data: '',
    horario: '',
    duracao: '45 minutos',
    local: '',
    equipamentos: [],
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const openCalendar = () => setShowCalendar(true);
  const closeCalendar = () => setShowCalendar(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const fetchAndOpenCalendar = async () => {
    try {
      const res = await api.get('/procedimentos/meus-procedimentos');
      const rows = res?.data || [];
      const ev = rows.map(r => ({ date: r.data || r.date, title: r.titulo || r.nome || r.title || 'Procedimento' }));
      setCalendarEvents(ev);
      setShowCalendar(true);
    } catch (err) {
      console.error('Erro ao carregar procedimentos do usuário', err);
      toast.error('Não foi possível carregar o calendário');
    }
  };

  const formatBRDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('pt-BR');
  };

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // opções de exemplo para equipamentos necessários
  const equipmentOptions = [
    'Espelho bucal',
    'Pinça clínica',
    'Anestésico local',
    'Sonda exploradora',
    'Material restaurador (resina composta)'
  ];

  function toggleEquipment(item) {
    setForm((f) => {
      const set = new Set(f.equipamentos || []);
      if (set.has(item)) set.delete(item);
      else set.add(item);
      return { ...f, equipamentos: Array.from(set) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return navigate('/login');

    // Basic validation
    if (!form.titulo || !form.data || !form.horario || !form.local) {
      toast.error('Preencha os campos obrigatórios (Tipo, Data, Horário, Local)');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      await api.post('/procedimentos', payload);
      toast.success('Solicitação publicada com sucesso');
      navigate('/dashboard-estudante');
    } catch (err) {
      console.error('Erro ao publicar solicitação:', err);
      toast.error(err.response?.data?.message || 'Erro ao publicar solicitação');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard-estudante')} className="p-2 rounded-full hover:bg-blue-500/40">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Nova Solicitação de Procedimento</h1>
              <p className="text-sm opacity-90">Preencha os detalhes do procedimento para encontrar voluntários</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: main form (spans 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-6 rounded-lg shadow">
                <h2 className="font-semibold text-lg mb-4">Informações do Procedimento</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Procedimento *</label>
                  <input name="titulo" value={form.titulo} onChange={onChange} className="w-full mt-2 p-3 border rounded-md bg-gray-50" placeholder="Exame Periodontal" />

                  <label className="block text-sm font-medium text-gray-700">Requisitos Específicos</label>
                  <textarea name="requisitos" value={form.requisitos} onChange={onChange} className="w-full mt-2 p-3 border rounded-md bg-gray-50" rows={4} placeholder="Descreva qualquer requisito específico que o voluntário deve atender" />
                  
                  {/* Equipamentos necessários - checkboxes de exemplo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-2">Equipamentos Necessários</label>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {equipmentOptions.map((opt) => (
                        <label key={opt} className="inline-flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={(form.equipamentos || []).includes(opt)} onChange={() => toggleEquipment(opt)} className="h-4 w-4" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Escolha os equipamentos necessários para este procedimento (opcional).</p>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Agendamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Data do Procedimento *</label>
                    <div className="mt-2">
                      <div className="relative">
                        <button type="button" onClick={fetchAndOpenCalendar} className="absolute left-3 top-3 w-6 h-6 text-gray-400 flex items-center justify-center"><CalendarDays className="w-4 h-4" /></button>
                        <input name="data" value={form.data} onChange={onChange} type="date" className="pl-10 w-full p-3 border rounded-md bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Horário de Início *</label>
                    <div className="mt-2">
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input name="horario" value={form.horario} onChange={onChange} type="time" className="pl-10 w-full p-3 border rounded-md bg-gray-50" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Duração Estimada *</label>
                    <select name="duracao" value={form.duracao} onChange={onChange} className="w-full mt-2 p-3 border rounded-md bg-gray-50">
                      <option>15 minutos</option>
                      <option>30 minutos</option>
                      <option>45 minutos</option>
                      <option>60 minutos</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Local *</label>
                    <div className="mt-2 relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input name="local" value={form.local} onChange={onChange} className="pl-10 w-full p-3 border rounded-md bg-gray-50" placeholder="Clínica Odontológica - Bloco C" />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-4">Observações Adicionais</h3>
                <textarea name="observacoes" value={form.observacoes} onChange={onChange} className="w-full mt-2 p-3 border rounded-md bg-gray-50" rows={6} placeholder="Informações extras que possam ser úteis para os voluntários" />
              </section>
            </div>

            {/* Right: summary/resume panel */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h4 className="font-semibold mb-3">Resumo da Solicitação</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Tipo:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{form.titulo || '—'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Data:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{form.data ? formatBRDate(form.data) : '—'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Horário:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{form.horario || '—'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Duração:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{form.duracao}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Local:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{form.local || '—'}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-600">Equipamentos:</span>
                    <span className="max-w-[160px] md:max-w-[220px] text-right truncate">{(form.equipamentos && form.equipamentos.length) ? form.equipamentos.join(', ') : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="text-sm text-slate-700">Resumo visual:</div>
                <div className="mt-3 text-right">
                  <div className="text-sm text-slate-500 break-words max-w-full">{form.titulo || ''}</div>
                  <div className="text-xs text-slate-500">{form.data ? formatBRDate(form.data) : ''} {form.horario ? ' • ' + form.horario : ''}</div>
                </div>
              </div>
              {form.equipamentos && form.equipamentos.length > 0 && (
                <div className="bg-white mt-4 p-3 rounded-lg text-sm text-gray-700 border">
                  <div className="font-medium mb-2">Equipamentos selecionados</div>
                  <div className="text-sm text-gray-600">{form.equipamentos.join(', ')}</div>
                </div>
              )}
            </aside>
          </div>

          {/* Action bar */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div className="text-sm text-gray-600">Preencha todos os campos obrigatórios antes de publicar.</div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate('/dashboard-estudante')} className="px-4 py-2 border rounded-md">Cancelar</button>
              <button disabled={loading} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">{loading ? 'Publicando...' : 'Publicar Solicitação'}</button>
            </div>
          </div>
        </form>
      </main>
  <CalendarWidget visible={showCalendar} onClose={closeCalendar} events={calendarEvents} />
    </div>
  );
}
