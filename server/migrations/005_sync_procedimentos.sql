-- Sync singular table 'procedimento' into 'procedimentos' (copy rows if missing)
DO $$
BEGIN
  -- Copy rows from unilink.procedimento (if any) into unilink.procedimentos preserving id
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'unilink' AND table_name = 'procedimento') THEN
    INSERT INTO unilink.procedimentos (id, titulo, descricao, requisitos, observacoes, data, horario, duracao, local, status, estudante_id, created_at, updated_at)
    SELECT id_procedimento, nome_procedimento, descricao, requisitos_especificos, observacao, data, horario, duracao, local, status, estudante_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM unilink.procedimento p
    WHERE NOT EXISTS (SELECT 1 FROM unilink.procedimentos pr WHERE pr.id = p.id_procedimento);
  END IF;
END
$$;

-- Ensure sequences for unilink.procedimentos are set after explicit inserts
SELECT setval(pg_get_serial_sequence('unilink.procedimentos','id'), COALESCE((SELECT MAX(id) FROM unilink.procedimentos), 1));
