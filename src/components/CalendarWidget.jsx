import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Simple Calendar widget modal with improved behavior and responsiveness.
// Props:
// - visible: boolean
// - onClose: fn
// - events: optional array of { date: 'YYYY-MM-DD' | Date, title }

function monthName(date) {
  return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
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

  // Close on ESC
  useEffect(() => {
    if (!visible) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  // prevent background scroll while visible
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [visible]);

  // map events by full date string YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};
    (events || []).forEach((ev) => {
      const k = toYMD(ev.date || ev);
      if (!k) return;
      map[k] = map[k] || [];
      map[k].push(ev);
    });
    return map;
  }, [events]);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div ref={ref} className="relative w-full max-w-6xl mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#1E40FF] text-white p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold">Calendário de Procedimentos</h3>
                <p className="text-sm opacity-90">Visualize todos os seus agendamentos</p>
              </div>
              <div>
                <button onClick={onClose} className="text-white opacity-90 hover:opacity-70">Fechar</button>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-gray-50">
            <div className="lg:col-span-2 bg-white rounded-lg p-4 md:p-6 shadow-sm max-h-[70vh] overflow-auto">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-semibold">{monthLabel}</h4>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} aria-label="Mês anterior" className="border rounded p-2 hover:bg-gray-100">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button onClick={nextMonth} aria-label="Próximo mês" className="border rounded p-2 hover:bg-gray-100">
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm">
                {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d) => (
                  <div key={d} className="text-xs text-gray-500 text-center font-medium">{d}</div>
                ))}

                {matrix.map((week, i) => (
                  week.map((day, j) => {
                    const key = day ? toYMD(new Date(current.getFullYear(), current.getMonth(), day)) : null;
                    const hasEvents = key && eventsByDate[key] && eventsByDate[key].length > 0;
                    const isToday = key === todayKey;
                    const isSelected = key === selectedKey;
                    return (
                      <div key={`${i}-${j}`} className="min-h-[68px] border border-gray-100 rounded p-2 bg-white">
                        {day ? (
                          <div className={`flex flex-col h-full cursor-pointer ${isSelected ? 'ring-2 ring-blue-200 rounded' : ''}`} onClick={() => onDayClick(day)}>
                            <div className="flex items-center justify-between">
                              <div className={`text-xs font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</div>
                              {hasEvents && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="mt-2 space-y-1">
                              {(eventsByDate[key] || []).slice(0,2).map((ev, idx) => (
                                <div key={idx} className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded inline-block truncate max-w-full">{ev.title}</div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full" />
                        )}
                      </div>
                    );
                  })
                ))}
              </div>

              <div className="mt-4 text-xs text-gray-500 flex items-center gap-3">
                <label className="flex items-center gap-2"><input type="checkbox" /> Hoje</label>
                <span className="inline-flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full" /> Procedimento agendado</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-0 md:p-4 shadow-sm overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-2 font-medium">{selected ? new Date(selected).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }) : 'Selecione um dia'}</div>
                <div className="p-4 text-gray-700">
                  {selected ? (
                    <div>
                      {(eventsByDate[selectedKey] || []).length === 0 ? (
                        <div className="text-sm text-gray-500">Nenhum procedimento neste dia.</div>
                      ) : (
                        <ul className="space-y-3">
                          {(eventsByDate[selectedKey] || []).map((ev, idx) => (
                            <li key={idx} className="p-3 border rounded bg-gray-50">
                              <div className="font-medium">{ev.title}</div>
                              {ev.horario && <div className="text-sm text-gray-500">{ev.horario}</div>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Clique em um dia no calendário para ver os detalhes
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="text-lg font-semibold mb-2">Resumo do Mês</h4>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between py-2 border-b"><span>Total de Procedimentos</span><strong className="text-blue-600">{events.length}</strong></div>
                  <div className="flex items-center justify-between py-2 border-b"><span>Confirmados</span><span className="text-green-600">3</span></div>
                  <div className="flex items-center justify-between py-2"><span>Pendentes</span><span className="text-yellow-600">1</span></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
