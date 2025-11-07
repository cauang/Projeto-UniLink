import bcrypt from 'bcrypt';

// Função para criar uma senha criptografada
export const criarSenhaCriptografada = async (senha) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(senha, salt);
};

// Exemplo de uso:
const exemplo = async () => {
  const senha = '12345';
  const senhaCriptografada = await criarSenhaCriptografada(senha);
  console.log('Senha original:', senha);
  console.log('Senha criptografada:', senhaCriptografada);
  
  // Exemplo de como verificar a senha
  const senhaCorreta = await bcrypt.compare(senha, senhaCriptografada);
  console.log('Senha está correta?', senhaCorreta);
};

// Descomentar a linha abaixo para gerar uma senha criptografada
// exemplo();