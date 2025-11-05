// --- Este é o seu "Banco de Dados" de teste centralizado ---

// 1. Dados do Usuário
const mockUserData = {
  id: 123,
  nome: "Cauan Gomes dos Santos Barbosa",
  curso: "Ciencia da Computação",
  tipo: "Voluntário",
  matricula: "2420519",
  iniciais: "CGSB",
  email: "cauan.barbosa@edu.unifor.br",
  telefone: "(85) 98765-4321",
  semestre: "4º Semestre",
  biografia: "Estudante de Ciência da Computação na Unifor, entusiasta de novas tecnologias e pronto para ajudar!",
  role: "Voluntario"
};

// 2. Dados de Estatísticas
const mockStatsData = {
  procedimentos: 8,
  pontos: 80,
  avaliacao: 4.9,
};

// 3. Dados dos Procedimentos (combinando tudo)
const mockProcedimentos = {
  "restauracao": {
    id: "restauracao",
    titulo: "Restauração",
    status: "Disponivel",
    data: "Domingo, 19 de outubro de 2025",
    horario: "09:00",
    duracao: "2h",
    local: "Clínica Odontológica - Bloco C",
    requisitos: "Paciente com cárie em dente anterior ou posterior que necessite de restauração. Não pode ter alergia a anestésicos locais.",
    observacoes: "Por favor, chegue 15 minutos antes do horário marcado para preenchimento da ficha de anamnese. Não se alimente 2 horas antes do procedimento.",
    estudante: {
      nome: "Pedro Oliveira",
      semestre: "8º semestre",
      matricula: "ODONTO456",
      email: "pedro.oliveira@edu.unifor.br",
      telefone: "(85) 99876-5432",
      iniciais: "PO"
    }
  },
  "limpeza-profilaxia": {
    id: "limpeza-profilaxia",
    titulo: "Limpeza e Profilaxia",
    status: "Disponível",
    data: "Domingo, 18 de outubro de 2025",
    horario: "14:00",
    duracao: "1h 30min",
    local: "Clínica Odontológica - Bloco A",
    requisitos: "Nenhum requisito específico. Aberto a todos os voluntários.",
    observacoes: "Chegar com 15 minutos de antecedência. Não é necessário jejum.",
    estudante: {
      nome: "Maria Sousa",
      semestre: "6º semestre",
      matricula: "ODONTO123",
      email: "maria.sousa@edu.unifor.br",
      telefone: "(85) 91234-5678",
      iniciais: "MS"
    }
  },
  "exame-periodontal": {
    id: "exame-periodontal",
    titulo: "Exame Periodontal",
    status: "Disponível",
    data: "Segunda, 20 de outubro de 2025",
    horario: "10:00",
    duracao: "1h",
    local: "Clínica Odontológica - Bloco B",
    requisitos: "Voluntário com histórico de sensibilidade gengival, se possível.",
    observacoes: "Preenchimento de ficha de anamnese na chegada.",
    estudante: {
      nome: "João Silva",
      semestre: "7º semestre",
      matricula: "ODONTO789",
      email: "joao.silva@edu.unifor.br",
      telefone: "(85) 98765-4321",
      iniciais: "JS"
    }
  },
  "aplicacao-fluor": {
    id: "aplicacao-fluor",
    titulo: "Aplicação de Flúor",
    status: "Disponível",
    data: "Quarta, 22 de outubro de 2025",
    horario: "15:30",
    duracao: "45min",
    local: "Clínica Odontológica - Bloco A",
    requisitos: "Aberto a todos.",
    observacoes: "Não comer ou beber por 30 minutos após o procedimento.",
    estudante: {
      nome: "Ana Costa",
      semestre: "5º semestre",
      matricula: "ODONTO555",
      email: "ana.costa@edu.unifor.br",
      telefone: "(85) 95555-4321",
      iniciais: "AC"
    }
  },
  "historico-limpeza": {
    id: "historico-limpeza",
    titulo: "Limpeza e Profilaxia",
    data: "15 de set. de 2025",
    status: "Confirmado"
  },
  "historico-exame": {
    id: "historico-exame",
    titulo: "Exame Clínico",
    data: "20 de ago. de 2025",
    status: "Confirmado"
  },
};

// 4. O Objeto API centralizado
const api = {
  get: (url) => {
    return new Promise((resolve, reject) => {
      console.log(`[Mock API GET]: ${url}`);
      setTimeout(() => {
        // --- Perfil ---
        if (url === "/perfil/me") {
          resolve({ data: mockUserData });
        } 
        else if (url === "/perfil/estatisticas") {
          resolve({ data: mockStatsData });
        }
        // --- Dashboard ---
        else if (url === "/auth/me") {
          resolve({ data: mockUserData }); // Retorna o usuário logado
        }
        else if (url === "/dashboard/summary") {
          resolve({ data: { agendados: 1, concluidos: 3, pontos: 80 } }); // Mock das estatísticas do dashboard
        }
        else if (url === "/dashboard/meus-agendados") {
          resolve({ data: [mockProcedimentos["restauracao"]] }); // O que está em "Minhas Inscrições"
        }
        else if (url === "/dashboard/disponiveis") {
          resolve({ data: [mockProcedimentos["limpeza-profilaxia"], mockProcedimentos["exame-periodontal"], mockProcedimentos["aplicacao-fluor"]] });
        }
        else if (url === "/dashboard/historico") {
           resolve({ data: [mockProcedimentos["historico-limpeza"], mockProcedimentos["historico-exame"]] });
        }
        // --- Detalhes do Procedimento ---
        else if (url.startsWith("/procedimentos/")) {
          const id = url.split('/').pop();
          const procedure = mockProcedimentos[id];
          if (procedure) {
            resolve({ data: procedure });
          } else {
            reject({ response: { data: { message: "Procedimento não encontrado" } } });
          }
        }
        // --- URL não encontrada ---
        else {
          reject(new Error(`URL não encontrada na Mock API: ${url}`));
        }
      }, 800);
    });
  },

  post: (url, data) => {
    return new Promise((resolve, reject) => {
      console.log(`[Mock API POST]: ${url}`, data);
      setTimeout(() => {
        // --- Login ---
        if (url === "/auth/login") {
          if (data.matricula === "123456" && data.senha === "123456") {
            resolve({
              data: {
                token: "fake-jwt-token-cauan-12345",
                user: mockUserData // Retorna o usuário centralizado
              },
            });
          } else {
            reject({ response: { data: { message: "Matrícula ou senha inválida (simulado)" } } });
          }
        }
        // --- Cadastro ---
        else if (url === "/auth/register") {
          if (data.email && data.email.includes("error")) {
             reject({ response: { data: { message: "Email já cadastrado (simulado)" } } });
          } else {
            resolve({ data: { message: "Cadastro realizado com sucesso!" } });
          }
        }
        // --- Ações do Dashboard (Inscrição/Cancelamento) ---
        else if (url === "/procedimentos/inscrever") {
            // Lógica de inscrição (aqui apenas retorna sucesso)
            const procedure = mockProcedimentos[data.id];
            resolve({ data: { message: `Inscrito em ${procedure.titulo} com sucesso!` } });
        }
        else if (url === "/procedimentos/cancelar") {
            // Lógica de cancelamento (aqui apenas retorna sucesso)
            const procedure = mockProcedimentos[data.id];
            resolve({ data: { message: `Inscrição em ${procedure.titulo} cancelada.` } });
        }
        // --- URL não encontrada ---
        else {
          reject(new Error(`URL não encontrada na Mock API: ${url}`));
        }
      }, 1000);
    });
  },
};

export default api;