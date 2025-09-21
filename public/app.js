const express = require("express");
const app = express();
const path = require("path");

// Middleware para servir arquivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Rota para servir o formulário
app.get("/visitantes", (req, res) => {
    res.sendFile(path.join(__dirname, "formulario.html"));
});

// Rota para receber os dados do formulário
app.post("/visitantes", express.json(), (req, res) => {
    const visitante = req.body;
    console.log("Dados recebidos:", visitante);
    res.status(201).send({ message: "Visitante cadastrado com sucesso!" });
});

// Inicia o servidor
app.listen(8080, () => {
    console.log("Servidor rodando em http://localhost:8080");
});
