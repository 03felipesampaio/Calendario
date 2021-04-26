const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: 'felipe',
    database: 'calendario'
});

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
}

function criarUsuario(nome, senhaEncriptada) {
    const comando = 'INSERT INTO usuarios(nome, senha) VALUES ($1, $2)';
    const parametros = [nome, senhaEncriptada];
    
    pool.query(comando, parametros, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('Usuario adicionado com sucesso');
    });
}

function logar(nome, senha) {
    const comando = 'SELECT * FROM usuarios WHERE nome = $1';
    const parametros = [nome];
    
    pool.query(comando, parametros, (err, res) => {
        if (err) {
            console.error(err);
            return err;
        }

        const {rows} = res;

        if (rows.length === 0) {
            console.log('Usuario nao encontrado');
            return;
        }

        const usuarioEncontrado = rows[0];

        if (bcrypt.compareSync(senha, usuarioEncontrado.senha)) {
            console.log(usuarioEncontrado);
        }
    });
}

function criarEvento(usuario, evento) {

}

function listarEventos(userID) {
    // Dar um jeito de retornar rows
}

function deletarEvento(usuario, evento) {
    
}

function alterarEvento (usuario, evento) {

}


module.exports = {
    query,
    criarUsuario, 
    logar, 
    criarEvento, 
    listarEventos, 
    deletarEvento, 
    alterarEvento
}


