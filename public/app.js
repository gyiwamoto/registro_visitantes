const express = require("express");
const app = express();
const path = require("path");

app.use(express.json()); // Middleware para interpretar JSON

const visitantes = []; // Armazena os visitantes cadastrados

// Tabela de casas e moradores
const casas = Array.from({ length: 20 }, (_, i) => ({
    casa: `C${i + 1}`, // Casa (C1, C2, ..., C20)
    moradores: [] // Lista de moradores
}));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota para servir o formulário
app.get("/visitantes", (req, res) => {
    res.sendFile(path.join(__dirname, "formulario.html"));
});

// Rota para cadastrar visitantes
app.post("/visitantes", (req, res) => {
    const { nome, documento, dataVisita, casa, visitado, autorizador } = req.body;

    // Log para depuração: Verificar os dados recebidos
    console.log("Dados recebidos:", req.body);

    // Padronizar o campo documento para evitar problemas de comparação
    const documentoPadronizado = documento.trim();

    // Verifica se todos os campos obrigatórios foram enviados
    if (!nome || !documentoPadronizado || !dataVisita || !casa || !visitado || !autorizador) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    // Log do estado atual do array visitantes
    console.log("Estado atual do array visitantes:", visitantes);

    // Verifica se o visitante já foi cadastrado (baseado no documento padronizado)
    const visitanteExistente = visitantes.find(
        (visitante) => visitante.documento === documentoPadronizado
    );

    if (visitanteExistente) {
        console.log(`Visitante com documento ${documentoPadronizado} já cadastrado.`);
        return res.status(400).json({ message: "Não foi possível cadastrar, o visitante já foi cadastrado anteriormente." });
    }

    // Verifica se a casa existe
    const casaEncontrada = casas.find((c) => c.casa === casa);
    if (!casaEncontrada) {
        return res.status(404).json({ message: "Casa não encontrada!" });
    }

    // Verifica se o morador pertence à casa
    const moradorEncontrado = casaEncontrada.moradores.includes(visitado);
    if (!moradorEncontrado) {
        return res.status(400).json({ message: "Morador inexistente." });
    }

    // Adiciona o visitante ao array
    visitantes.push({ nome, documento: documentoPadronizado, dataVisita, casa, visitado, autorizador });
    console.log("Visitante adicionado com sucesso!");
    console.log("Estado atualizado do array visitantes:", visitantes);

    res.status(201).json({ message: "Visitante cadastrado com sucesso!" });
});

// Rota para listar todos os visitantes cadastrados
app.get("/visitantes/listar", (req, res) => {
    console.log("Requisição recebida em /visitantes/listar");
    console.log("Visitantes cadastrados:", visitantes);
    res.status(200).json(visitantes);
});

// Rota para listar todas as casas e moradores
app.get("/casas", (req, res) => {
    console.log("Requisição recebida em /casas");
    console.log("Casas cadastradas:", casas);
    res.status(200).json(casas);
});

// Rota para adicionar ou atualizar moradores de uma casa
app.post("/casas/:casa/moradores", (req, res) => {
    const { casa } = req.params;
    const { moradores } = req.body;

    // Verifica se a casa existe
    const casaEncontrada = casas.find((c) => c.casa === casa);
    if (!casaEncontrada) {
        return res.status(404).json({ message: "Casa não encontrada!" });
    }

    // Verifica se os moradores foram enviados corretamente
    if (!moradores || !Array.isArray(moradores)) {
        return res.status(400).json({ message: "Moradores devem ser uma lista!" });
    }

    // Atualiza os moradores da casa
    casaEncontrada.moradores = moradores.slice(0, 8); // Limita a 8 moradores
    console.log(`Moradores atualizados para a casa ${casa}:`, casaEncontrada.moradores);

    res.status(200).json({ message: "Moradores atualizados com sucesso!", casa: casaEncontrada });
});

// Inicia o servidor
app.listen(8080, () => {
    console.log("Servidor rodando em http://localhost:8080");
});
