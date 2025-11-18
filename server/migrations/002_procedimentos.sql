-- Criação do schema se não existir
CREATE SCHEMA IF NOT EXISTS unilink;

-- Tabela de procedimentos
CREATE TABLE IF NOT EXISTS unilink.procedimentos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    requisitos TEXT,
    observacoes TEXT,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    duracao VARCHAR(20) NOT NULL,
    local VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'disponivel', -- disponivel, agendado, concluido, cancelado
    estudante_id INTEGER REFERENCES unilink.usuario(id_usuario),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inscrições
CREATE TABLE IF NOT EXISTS unilink.inscricoes (
    id SERIAL PRIMARY KEY,
    procedimento_id INTEGER REFERENCES unilink.procedimentos(id) ON DELETE CASCADE,
    voluntario_id INTEGER REFERENCES unilink.usuario(id_usuario) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'confirmado', -- confirmado, concluido, cancelado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_procedimentos_modtime
    BEFORE UPDATE ON unilink.procedimentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inscricoes_modtime
    BEFORE UPDATE ON unilink.inscricoes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();