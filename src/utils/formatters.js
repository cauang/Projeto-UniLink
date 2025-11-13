const formatarData = (dataString) => {
  if (!dataString) return '';
  const data = new Date(dataString);
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatarHorario = (horarioString) => {
  if (!horarioString) return '';
  return horarioString.substring(0, 5); // Retorna apenas HH:MM
};

export { formatarData, formatarHorario };