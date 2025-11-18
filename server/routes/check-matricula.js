import { findByMatricula } from '../repositories/users.js';

export async function checkMatricula(matricula) {
  try {
    const user = await findByMatricula(matricula);
    if (!user) {
      return {
        exists: false,
        isOdonto: false
      };
    }
    
    return {
      exists: true,
      isOdonto: user.curso === 'Odontologia'
    };
  } catch (err) {
    console.error('Erro ao verificar matrícula:', err);
    throw err;
  }
}