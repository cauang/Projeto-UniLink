import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, User } from 'lucide-react'; // Adicionado User
import { useNavigate } from 'react-router-dom'; // Adicionado useNavigate

// Cores do tema
const THEME = {
  primary: '#00A63E',        // Verde Principal
  white: '#FFFFFF',
  pendingBg: '#FEF9C2',      // Amarelo claro
  pendingText: '#854D0E',    // Texto amarelo escuro para contraste
  confirmedBg: '#DCFCE7',    // Verde claro
  confirmedText: '#166534',  // Texto verde escuro
  todayBg: '#E0F2FE',        // Azul claro
  todayText: '#0284C7',
};

function monthName(date) {
  const name = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getMonthMatrixFromDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const matrix = [];
  let week = new Array(7).fill(null);
  let day = 1;
  const startWeekday = first.getDay();
  
  for (let i = 0; i < startWeekday; i++) week[i] = null;
  for (let i = startWeekday; i < 7; i++) {
    week[i] = day++;
  }
  matrix.push(week);
  
  while (day <= last.getDate()) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= last.getDate(); i++) {
      week[i] = day++;
    }
    matrix.push(week);
  }
  return matrix;
}

function toYMD(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return null;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CalendarWidget({ visible, onClose, events = [] }) {
  const [current, setCurrent] = useState(() => new Date());
  const [selected, setSelected] = useState(null);
  const ref = useRef(null);
  const navigate = useNavigate(); // Hook de navegação

  // Close on ESC
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  // Prevent background scroll
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [visible]);

  const eventsByDate = useMemo(() => {
    const map = {};
    (events || []).forEach((ev) => {
      const k = toYMD(ev.date || ev.data);
      if (!k) return;
      map[k] = map[k] || [];
      map[k].push(ev);
    });
    return map;
  }, [events]);

  const summary = useMemo(() => {
    let total = 0;
    let confirmados = 0;
    let pendentes = 0;

    const currentMonthStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;

    events.forEach(ev => {
      const evDate = toYMD(ev.date || ev.data);
      if (evDate && evDate.startsWith(currentMonthStr)) {
        total++;
        const status = (ev.status || '').toLowerCase();
        if (status.includes('pendente') || status.includes('aguardando')) {
          pendentes++;
        } else {
          confirmados++;
        }
      }
    });

    return { total, confirmados, pendentes };
  }, [events, current]);

  const matrix = useMemo(() => getMonthMatrixFromDate(current), [current]);
  const monthLabel = monthName(current);
  const todayKey = toYMD(new Date());

  if (!visible) return null;

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const onDayClick = (dayNum) => {
    if (!dayNum) return;
    const y = current.getFullYear();
    const m = current.getMonth();
    const dt = new Date(y, m, dayNum);
    setSelected(dt);
  };

  const selectedKey = selected ? toYMD(selected) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
      <div 
        ref={ref} 
        className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* --- HEADER --- */}
        <div 
          className="text-white p-6 flex items-center justify-between shrink-0"
          style={{ backgroundColor: THEME.primary }}
        >
          <div>
            <h3 className="text-2xl font-bold">Calendário de Procedimentos</h3>
            <p className="text-sm opacity-90 mt-1">Visualize todos os seus agendamentos</p>
          </div>
          <div className="flex items-center gap-4">
             {/* Link de Perfil ATUALIZADO */}
            <div 
                className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/perfil')}
            >
               <User size={20} /> {/* Ícone trocado para User */}
               <span className="font-medium">Perfil</span>
            </div>
            
            <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* --- CORPO --- */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            
            {/* COLUNA ESQUERDA: CALENDÁRIO GRID */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-800 capitalize">{monthLabel}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-600 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-7 mb-2">
                  {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d) => (
                    <div key={d} className="text-sm text-gray-400 font-medium text-center py-2 border-b border-gray-100">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr gap-2 h-[calc(100%-3rem)]">
                  {matrix.map((week, i) => (
                    week.map((day, j) => {
                      if (!day) return <div key={`${i}-${j}`} className="p-2" />;

                      const dateObj = new Date(current.getFullYear(), current.getMonth(), day);
                      const key = toYMD(dateObj);
                      const dayEvents = eventsByDate[key] || [];
                      const isToday = key === todayKey;
                      const isSelected = key === selectedKey;

                      return (
                        <div 
                          key={`${i}-${j}`} 
                          onClick={() => onDayClick(day)}
                          className={`
                            relative border rounded-lg p-2 cursor-pointer transition-all flex flex-col justify-between min-h-[80px]
                            ${isSelected ? 'ring-2 ring-[#00A63E] border-transparent z-10' : 'border-gray-200 hover:border-[#00A63E]/50'}
                            ${isToday ? 'bg-blue-50' : 'bg-white'}
                          `}
                        >
                          <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                            {day}
                          </span>
                          
                          <div className="flex flex-col gap-1 mt-1">
                            {dayEvents.slice(0, 2).map((ev, idx) => {
                                const status = (ev.status || '').toLowerCase();
                                const isPending = status.includes('pendente');
                                return (
                                    <div 
                                    key={idx} 
                                    className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium text-white"
                                    style={{ backgroundColor: isPending ? '#EAB308' : THEME.primary }}
                                    >
                                    {ev.horario ? `${ev.horario.split(':')[0]}:00` : ''} {ev.title || ev.titulo}
                                    </div>
                                )
                            })}
                            {dayEvents.length > 2 && (
                                <span className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 2} mais</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border border-blue-200 bg-blue-50 rounded"></div>
                    <span>Hoje</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#00A63E]"></div>
                    <span>Procedimento agendado</span>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: DETALHES E RESUMO */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
                <div 
                    className="px-6 py-3 text-white font-medium flex items-center gap-2"
                    style={{ backgroundColor: THEME.primary }}
                >
                    <CalendarIcon size={18} />
                    {selected 
                        ? selected.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
                        : 'Selecione um dia'
                    }
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-center">
                    {selected ? (
                        <div className="h-full">
                            {(eventsByDate[selectedKey] || []).length === 0 ? (
                                <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full gap-3">
                                    <CalendarIcon size={48} strokeWidth={1} className="opacity-20" />
                                    <p>Nenhum procedimento para este dia.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                                    {(eventsByDate[selectedKey] || []).map((ev, idx) => (
                                        <div key={idx} className="p-3 rounded-lg border border-l-4 border-gray-100 hover:shadow-md transition-shadow" style={{ borderLeftColor: THEME.primary }}>
                                            <h5 className="font-bold text-gray-800">{ev.title || ev.titulo}</h5>
                                            <div className="flex items-center justify-between mt-1 text-sm text-gray-500">
                                                <span>{ev.horario}</span>
                                                <span 
                                                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                                                    style={{ 
                                                        backgroundColor: (ev.status || '').includes('pendente') ? THEME.pendingBg : THEME.confirmedBg,
                                                        color: (ev.status || '').includes('pendente') ? THEME.pendingText : THEME.confirmedText
                                                    }}
                                                >
                                                    {ev.status || 'Confirmado'}
                                                </span>
                                            </div>
                                            {ev.estudante?.nome && <p className="text-xs text-gray-400 mt-2">Aluno: {ev.estudante.nome}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 flex flex-col items-center gap-4">
                            <CalendarIcon size={64} strokeWidth={1} className="text-gray-200" />
                            <p className="max-w-[200px] mx-auto leading-relaxed">
                                Clique em um dia no calendário para ver os detalhes
                            </p>
                        </div>
                    )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Resumo do Mês</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Total de Procedimentos</span>
                        <span className="text-2xl font-bold" style={{ color: THEME.primary }}>{summary.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Confirmados</span>
                        <span 
                            className="px-3 py-1 rounded-md font-bold text-sm"
                            style={{ backgroundColor: THEME.confirmedBg, color: THEME.confirmedText }}
                        >
                            {summary.confirmados}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Pendentes</span>
                        <span 
                            className="px-3 py-1 rounded-md font-bold text-sm"
                            style={{ backgroundColor: THEME.pendingBg, color: THEME.pendingText }}
                        >
                            {summary.pendentes}
                        </span>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}