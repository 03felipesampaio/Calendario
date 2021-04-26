const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/public'));
app.set("view engine", "ejs");

// Numero de camadas para a encriptacao de senha
const saltRounds = 10;

let usuario = undefined;

app.get('/', (req, res) => {
    res.redirect('login');
});

app.get('/user/:id', (req, res) => {
    res.status(200).send(usuario);
});

// *** LOGIN ***

app.get('/login', (req, res) => {
    res.render('login', {mensagem: null});
});

app.post('/login', (req, res) => {
    const { nome, senha } = req.body;

    const comando = 'SELECT * FROM usuarios WHERE nome = $1';
    const parametros = [nome];

    let mensagemErro = undefined;

    db.query(comando, parametros, (err, dbRes) => {
        if (err) {
            console.error(err);
            return err;
        }

        const { rows } = dbRes;

        if (rows.length === 0) {
            mensagemErro = "Usuario não encontrado"
            res.render("login", {mensagem: mensagemErro});
            return;
        }

        const usuarioEncontrado = rows[0];

        if (bcrypt.compareSync(senha, usuarioEncontrado.senha)) {
            usuario = usuarioEncontrado;
            res.redirect('/user/' + usuario.id + '/evento');
        } else {
            mensagemErro = "Senha incorreta"
            res.render("login", {mensagem: mensagemErro});
        }
    });
});

// Criar conta

app.post('/create', (req, res) => {
    const { nome, senha } = req.body;

    const senhaEncriptada = bcrypt.hashSync(senha, saltRounds);

    const comando = 'INSERT INTO usuarios(nome, senha) VALUES ($1, $2)';
    const parametros = [nome, senhaEncriptada];

    let mensagemErro = undefined;

    db.query(comando, parametros, (err, dbRes) => {
        if (err) {
            mensagemErro = "Usuario ja existe, tente outro nome"
            res.render("login", {mensagem: mensagemErro});
            console.error(err);
            return;
        }

        
        res.redirect('/user/' + usuario.id + '/evento');
    });
});

// *** EVENTOS ***

// Mostra todos os eventos do usuario
app.get('/user/:id/evento', (req, res) => {
    if (Number(req.params.id) !== usuario.id) {
        // res.render('/erro', {mensagem: 'Voce nao esta autorizado'});
        res.status(404).send(req.params.id + ' ' + usuario.id);
    }

    const comando = "SELECT id, titulo, descr, to_char(dia, 'YYYY MM DD') as dia, inicio,fim FROM eventos WHERE usuario = $1 ORDER BY dia, inicio";
    const parametros = [req.params.id];

    db.query(comando, parametros, (err, dbRes) => {
        if (err) {
            console.error(err);
            return;
        }

        res.render('home', { usuario: usuario, eventos: dbRes.rows});
    });
});

// Cria novo evento
app.post('/user/:id/evento', (req, res) => {
    const { titulo, descricao, dia, inicio, fim } = req.body;

    const comando = 'INSERT INTO eventos (usuario, titulo, descr, dia, inicio, fim) VALUES ($1, $2, $3, $4, $5, $6)';
    const parametros = [usuario.id, titulo, descricao, dia, inicio, fim];

    db.query(comando, parametros, (err, dbRes) => {
        if (err) {
            console.error(err);
            return;
        }

        res.redirect('/user/' + usuario.id + '/evento');
    });
});

// Altera evento
app.post('/user/:id/evento/:eventoID/alterar', (req, res) => {
    const { titulo, descricao, inicio, fim } = req.body;
    
    const comando = "UPDATE eventos SET (titulo, descr, inicio, fim) = ($1, $2, $3, $4) WHERE id = $5";
    const parametros = [titulo, descricao, inicio, fim, req.params.eventoID];
    
    db.query(comando, parametros, (err, dbRes) => {
        if (err) {
            console.error(err);
            return;
        }

        res.redirect('/user/' + usuario.id + '/evento');
    });
});

// Deleta evento
app.post('/user/:id/evento/:eventoID/delete', (req, res) => {
    if (Number(req.params.id) === usuario.id) {
        const comando = 'DELETE FROM eventos WHERE id = $1';
        const parametros = [req.params.eventoID];

        db.query(comando, parametros, (err, dbRes) => {
            if (err) {
                console.error(err);
                return;
            }

            res.redirect('/user/' + usuario.id + '/evento');
        });
    }
});



module.exports = app;