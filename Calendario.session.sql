SELECT * FROM usuarios;
-- @block
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome varchar(30) UNIQUE NOT NULL,
  senha char(60) NOT NULL
);


-- @block
DROP TABLE eventos;
DROP TABLE usuarios;

-- @block
INSERT INTO usuarios(nome, senha) VALUES ('felipe', '123');

-- @block
CREATE TABLE eventos (
  id SERIAL PRIMARY KEY,
  usuario INT REFERENCES usuarios(id),
  titulo VARCHAR(30) NOT NULL,
  dia DATE NOT NULL,
  inicio TIME NOT NULL,
  fim TIME NOT NULL,
  descr TEXT
);

-- @block
SELECT id, titulo, descr, to_char(dia, 'YYYY MM DD') as dia, inicio,fim FROM eventos WHERE usuario = 1 ORDER BY dia, inicio;