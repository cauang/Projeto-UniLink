import bcrypt from 'bcrypt';

const gerarHash = async (senha) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(senha, salt);
  console.log('Senha original:', senha);
  console.log('Senha criptografada:', hash);
};

// Gera hash para a senha fornecida abaixo
// gerarHash('12345');

export { gerarHash };