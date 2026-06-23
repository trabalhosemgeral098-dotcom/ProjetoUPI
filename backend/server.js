const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "UPI"
});

app.get("/", (req, res) => {
    res.json({
        mensagem: "API funcionando"
    });
});

app.post("/cadastro", async (req, res) => {

    const { nome, email, telefone } = req.body;

    if (!nome || !email || !telefone) {
        return res.status(400).json({
            erro: "Preencha todos os campos."
        });
    }

    if (nome.length < 3) {
        return res.status(400).json({
            erro: "Nome muito pequeno."
        });
    }

    try {

        const [existe] = await db.query(
            "SELECT * FROM cadastros WHERE email = ?",
            [email]
        );

        if (existe.length > 0) {
            return res.status(400).json({
                erro: "Já existe cadastro com este email."
            });
        }

        const [resultado] = await db.query(
            "INSERT INTO cadastros (nome, email, telefone, ativo) VALUES (?, ?, ?, ?)",
            [nome, email, telefone, true]
        );

        res.status(201).json({
            mensagem: "Cadastro realizado.",
            id: resultado.insertId
        });

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

app.get("/cadastro", async (req, res) => {

    try {

        const [cadastros] = await db.query(
            "SELECT * FROM cadastros"
        );

        res.json(cadastros);

    } catch (erro) {

        res.status(500).json({
            erro: erro.message
        });

    }

});

let incorretas = 0;
let bloqueado = false;

app.post("/admin", async(req, res) => {
    try{
        console.log(req.body);
        const{email, senha} = req.body;
        const[resultado] = await db.execute(
            "SELECT * FROM administradores WHERE email = ? AND senha = ?", [email, senha]);
            if(resultado.length > 0){
                res.json({
                    sucesso: true,
                    mensagem: "O login foi realizado com sucesso!"
                })
            } else {
                res.json({
                    sucesso: false,
                    mensagem: "Email ou senha incorretos!"
                });
            }
    } catch (erro){
        console.error(erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro no server"
        });
    }
});

app.listen(3000, () => {

    console.log("Servidor rodando em http://localhost:3000");

});