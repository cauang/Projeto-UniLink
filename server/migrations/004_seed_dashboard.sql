-- Seed dashboard sample data: students, a volunteer, procedures and inscriptions
-- Safe to run multiple times (uses WHERE NOT EXISTS guards)

CREATE SCHEMA IF NOT EXISTS unilink;

-- Insert sample students
INSERT INTO unilink.usuario (nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia, horas_complementares, avaliacao)
SELECT 'Maria Silva', '20250001', 'Odontologia', 'maria.silva@edu.unifor.br', '(85)99999-0001', 6, 'senha_placeholder', 'Estudante', 'Estudante de Odontologia', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM unilink.usuario WHERE matricula = '20250001');

INSERT INTO unilink.usuario (nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia, horas_complementares, avaliacao)
SELECT 'João Santos', '20250002', 'Odontologia', 'joao.santos@edu.unifor.br', '(85)99999-0002', 5, 'senha_placeholder', 'Estudante', 'Estudante de Odontologia', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM unilink.usuario WHERE matricula = '20250002');

INSERT INTO unilink.usuario (nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia, horas_complementares, avaliacao)
SELECT 'Ana Costa', '20250003', 'Odontologia', 'ana.costa@edu.unifor.br', '(85)99999-0003', 4, 'senha_placeholder', 'Estudante', 'Estudante de Odontologia', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM unilink.usuario WHERE matricula = '20250003');

-- Insert a volunteer account used for demo (if not exists)
INSERT INTO unilink.usuario (nome, matricula, curso, email, telefone, semestre, senha, tipo_usuario, biografia, horas_complementares, avaliacao)
SELECT 'Voluntário Demo', '20259999', 'Ciência da Computação', 'voluntario.demo@edu.unifor.br', '(85)99999-9999', 7, 'senha_placeholder', 'Voluntario', 'Conta de demonstração para voluntários', 0, 0
WHERE NOT EXISTS (SELECT 1 FROM unilink.usuario WHERE matricula = '20259999');

-- Insert sample procedimentos (available)
INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Limpeza e Profilaxia', 'Procedimento de higiene bucal', '', '', '2025-10-18', '14:00:00', '1h30min', 'Clínica Odontológica - Bloco A', 'disponivel', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250001')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Limpeza e Profilaxia' AND data = '2025-10-18');

INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Exame Periodontal', 'Avaliação periodontal', '', '', '2025-10-20', '10:00:00', '1h', 'Clínica Odontológica - Bloco B', 'disponivel', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250002')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Exame Periodontal' AND data = '2025-10-20');

INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Aplicação de Flúor', 'Aplicação tópica de flúor', '', '', '2025-10-22', '15:30:00', '45min', 'Clínica Odontológica - Bloco A', 'disponivel', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250003')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Aplicação de Flúor' AND data = '2025-10-22');

-- Insert histórico (procedimentos já concluídos pelo voluntário demo)
-- Use the volunteer demo id
INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Limpeza e Profilaxia (Histórico)', 'Procedimento histórico', '', '', '2025-09-15', '09:00:00', '1h', 'Clínica Odontológica - Bloco A', 'concluido', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250001')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Limpeza e Profilaxia (Histórico)' AND data = '2025-09-15');

INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Exame Clínico (Histórico)', 'Procedimento histórico', '', '', '2025-08-20', '11:00:00', '1h', 'Clínica Odontológica - Bloco B', 'concluido', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250002')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Exame Clínico (Histórico)' AND data = '2025-08-20');

INSERT INTO unilink.procedimentos (titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id)
SELECT 'Aplicação de Flúor (Histórico)', 'Procedimento histórico', '', '', '2025-07-10', '14:00:00', '45min', 'Clínica Odontológica - Bloco A', 'concluido', (SELECT id_usuario FROM unilink.usuario WHERE matricula='20250003')
WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos WHERE titulo='Aplicação de Flúor (Histórico)' AND data = '2025-07-10');

-- Create inscricoes for the volunteer demo linking to the historical procedimentos
INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status, created_at, updated_at)
SELECT (SELECT id FROM unilink.procedimentos WHERE titulo='Limpeza e Profilaxia (Histórico)' LIMIT 1), (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'), 'concluido', '2025-09-15', '2025-09-15'
WHERE NOT EXISTS (SELECT 1 FROM unilink.inscricoes i JOIN unilink.procedimentos p ON i.procedimento_id = p.id WHERE p.titulo = 'Limpeza e Profilaxia (Histórico)' AND i.voluntario_id = (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'));

INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status, created_at, updated_at)
SELECT (SELECT id FROM unilink.procedimentos WHERE titulo='Exame Clínico (Histórico)' LIMIT 1), (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'), 'concluido', '2025-08-20', '2025-08-20'
WHERE NOT EXISTS (SELECT 1 FROM unilink.inscricoes i JOIN unilink.procedimentos p ON i.procedimento_id = p.id WHERE p.titulo = 'Exame Clínico (Histórico)' AND i.voluntario_id = (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'));

INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status, created_at, updated_at)
SELECT (SELECT id FROM unilink.procedimentos WHERE titulo='Aplicação de Flúor (Histórico)' LIMIT 1), (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'), 'concluido', '2025-07-10', '2025-07-10'
WHERE NOT EXISTS (SELECT 1 FROM unilink.inscricoes i JOIN unilink.procedimentos p ON i.procedimento_id = p.id WHERE p.titulo = 'Aplicação de Flúor (Histórico)' AND i.voluntario_id = (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'));

-- Optionally, link the volunteer to one of the available procedures as a current inscription (example)
INSERT INTO unilink.inscricoes (procedimento_id, voluntario_id, status)
SELECT (SELECT id FROM unilink.procedimentos WHERE titulo='Limpeza e Profilaxia' LIMIT 1), (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'), 'confirmado'
WHERE NOT EXISTS (SELECT 1 FROM unilink.inscricoes i JOIN unilink.procedimentos p ON i.procedimento_id = p.id WHERE p.titulo = 'Limpeza e Profilaxia' AND i.voluntario_id = (SELECT id_usuario FROM unilink.usuario WHERE matricula='20259999'));

-- End of seed
