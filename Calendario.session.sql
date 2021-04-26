-- @block
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome varchar(30) UNIQUE NOT NULL,
  senha char(60) NOT NULL
);

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
DROP TABLE eventos;
DROP TABLE usuarios;

