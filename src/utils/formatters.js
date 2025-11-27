const formatarData = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  // Opções para o formato: "24 de nov de 2025"
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  // O formato pt-BR pode incluir um ponto na abreviação do mês (ex: "nov."), então o removemos.
  return new Intl.DateTimeFormat('pt-BR', options)
    .format(data)
    .replace('.', '');
};

const formatarHorario = (horarioString) => {
  if (!horarioString) return '';
  return horarioString.substring(0, 5); // Retorna apenas HH:MM
};

export { formatarData, formatarHorario };