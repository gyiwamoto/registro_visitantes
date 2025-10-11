const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch"); // npm install node-fetch@2

// Middleware para servir arquivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Rota para tela de login/boas-vindas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});


// Rota para receber login de usuários
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(401).json({ error: data.error });
        }
        res.json(data); // retorna dados do usuário logado
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no login" });
    }
});

// Rota para registrar novos usuários
app.post("/register", async (req, res) => {
    try {
        const { email, password, adminPassword } = req.body;
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, adminPassword })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(400).json({ error: data.error });
        }
        res.json(data); // retorna dados do usuário registrado
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro no registro" });
    }
});

// Rota para servir o formulário de visitantes
app.get("/visitantes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "formulario.html"));
});

// Rota para receber dados do formulário de visitantes
app.post("/visitantes", (req, res) => {
    const visitante = req.body;
    console.log("Dados recebidos:", visitante);
    res.status(201).send({ message: "Visitante cadastrado com sucesso!" });
});

// Inicia o servidor
app.listen(8081, () => {
    console.log("Servidor frontend rodando em http://localhost:8081");
});
