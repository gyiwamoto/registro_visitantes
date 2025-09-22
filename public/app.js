const express = require("express");
const app = express();
const path = require("path");

app.use(express.json()); // Middleware para interpretar JSON

const visitantes = []; // Armazena os visitantes cadastrados

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota para servir o formulário
app.get("/visitantes", (req, res) => {
    res.sendFile(path.join(__dirname, "formulario.html"));
});

// Rota para cadastrar visitantes
app.post("/visitantes", (req, res) => {
    const { nome, documento, dataVisita } = req.body;

    // Verifica se todos os campos obrigatórios foram enviados
    if (!nome || !documento || !dataVisita) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Verifica se o visitante já foi cadastrado
    const visitanteExistente = visitantes.find(
        (visitante) => visitante.documento === documento
    );

    if (visitanteExistente) {
        return res.status(400).json({ message: "Visitante já cadastrado!" });
    }

    // Adiciona o visitante ao array
    visitantes.push({ nome, documento, dataVisita });
    console.log("Visitantes cadastrados:", visitantes);

    res.status(201).json({ message: "Visitante cadastrado com sucesso!" });
});

// Rota para listar todos os visitantes cadastrados
app.get("/visitantes/listar", (req, res) => {
    res.status(200).json(visitantes);
});

// Inicia o servidor
app.listen(8080, () => {
    console.log("Servidor rodando em http://localhost:8080");
});
