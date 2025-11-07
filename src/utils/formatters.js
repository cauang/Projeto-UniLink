const formatarData = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(data);
};

const formatarHorario = (horarioString) => {
  if (!horarioString) return '';
  return horarioString.substring(0, 5); // Retorna apenas HH:MM
};

export { formatarData, formatarHorario };