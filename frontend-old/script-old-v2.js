import { moradores } from "./script_moradores.js"; // Importa a variável moradores de script_moradores.js
import { salvarVisitante, listarVisitantes as listarAPI, editarVisitante as editarAPI, deletarVisitante as deletarAPI } from "./apiVisitantes.js";

// ---------- Exibir mensagens ----------
function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById("mensagem");
    if (!mensagemEl) return;
    mensagemEl.innerText = texto;
    mensagemEl.classList.remove("alert-success", "alert-danger", "alert-warning", "alert-info");
    switch (tipo) {
        case "success": mensagemEl.classList.add("alert-success"); break;
        case "error": mensagemEl.classList.add("alert-danger"); break;
        case "warning": mensagemEl.classList.add("alert-warning"); break;
        default: mensagemEl.classList.add("alert-info");
    }
}

// ---------- Limpar formulário ----------
function limparFormulario() {
    const campos = ["nome", "cpf", "condominio", "contato", "endereco", "dataVisita", "razao", "morador", "visitadoNome", "telefoneVisitado", "autorizador"];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    const form = document.getElementById("visitanteForm");
    if (form) form.classList.remove("was-validated");
    const mensagemEl = document.getElementById("mensagem");
    if (mensagemEl) {
        mensagemEl.innerText = "";
        mensagemEl.classList.remove("alert-success", "alert-danger", "alert-warning", "alert-info");
    }
}

// ---------- Cadastro ----------
document.getElementById("visitanteForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    const visitante = {
        nome: document.getElementById("nome")?.value.trim(),
        cpf: document.getElementById("cpf")?.value.trim(),
        condominio: document.getElementById("condominio")?.value.trim() || "Particular",
        contato: document.getElementById("contato")?.value.trim(),
        endereco: document.getElementById("endereco")?.value.trim(),
        dataVisita: document.getElementById("dataVisita")?.value.trim(),
        razao: document.getElementById("razao")?.value.trim(),
        morador: document.getElementById("morador")?.value.trim(),
        visitadoNome: document.getElementById("visitadoNome")?.value.trim(),
        telefoneVisitado: document.getElementById("telefoneVisitado")?.value.trim(),
        autorizador: document.getElementById("autorizador")?.value.trim()
    };

    const camposObrigatorios = ["nome", "cpf", "contato", "endereco", "dataVisita", "razao", "morador", "visitadoNome", "telefoneVisitado", "autorizador"];
    const camposVazios = camposObrigatorios.filter(c => !visitante[c]);
    if (camposVazios.length > 0) {
        exibirMensagem("⚠️ Preencha todos os campos obrigatórios antes de salvar.", "warning");
        return;
    }

    try {
        const data = await salvarVisitante(visitante);
        if (data) {
            exibirMensagem("✅ Visitante cadastrado com sucesso!", "success");
            limparFormulario();
            listarVisitantes(); // Certifique-se de que essa função está sendo chamada corretamente.
        }
    } catch (error) {
        console.error(error);
        exibirMensagem("❌ Erro ao salvar visitante!", "error");
    }
});

// ---------- Cancelar formulário ----------
document.getElementById("cancelar-btn")?.addEventListener("click", () => {
    limparFormulario();
    exibirMensagem("🧹 Formulário limpo.", "info");
});

// ---------- Listar visitantes ----------
async function listarVisitantes(filtroCasa = "", filtroData = "") {
    try {
        let visitantes = await listarAPI();

        // Aplicar filtros
        if (filtroCasa) visitantes = visitantes.filter(v => v.morador && v.morador.toLowerCase().includes(filtroCasa.toLowerCase()));
        if (filtroData) visitantes = visitantes.filter(v => v.dataVisita === filtroData);

        const tbody = document.querySelector("#tabelaVisitantes tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        visitantes.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${v.nome}</td>
                <td>${v.cpf}</td>
                <td>${v.condominio || "Particular"}</td>
                <td>${v.contato}</td>
                <td>${v.endereco || ""}</td>
                <td>${v.dataVisita || ""}</td>
                <td>${v.razao || ""}</td>
                <td>${v.morador || ""}</td>
                <td>${v.visitadoNome || ""}</td>
                <td>${v.telefoneVisitado || ""}</td>
                <td>${v.autorizador || ""}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editarVisitante(${v.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarVisitante(${v.id})">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        exibirMensagem(`✅ Listados ${visitantes.length} visitantes`, "success");
    } catch (error) {
        console.error(error);
        exibirMensagem("❌ Erro ao listar visitantes!", "error");
    }
}

// ---------- Deletar visitante ----------
async function deletarVisitante(id) {
    if (!confirm("Deseja realmente deletar este visitante?")) return;
    try {
        await deletarAPI(id);
        listarVisitantes();
        exibirMensagem("✅ Visitante deletado com sucesso!", "success");
    } catch (error) {
        console.error(error);
        exibirMensagem("❌ Erro ao deletar visitante!", "error");
    }
}

// ---------- Editar visitante ----------
async function editarVisitante(id) {
    try {
        const visitantes = await listarAPI();
        const v = visitantes.find(v => v.id === id);
        if (!v) {
            exibirMensagem("❌ Visitante não encontrado!", "error");
            return;
        }

        const nome = prompt("Novo nome:", v.nome);
        if (nome === null) return;

        const dados = { ...v, nome };
        await editarAPI(id, dados);
        listarVisitantes();
        exibirMensagem("✅ Visitante atualizado com sucesso!", "success");
    } catch (error) {
        console.error(error);
        exibirMensagem("❌ Erro ao editar visitante!", "error");
    }
}

// ---------- Filtros ----------
document.getElementById("btnListarVisitantes")?.addEventListener("click", () => {
    const filtroCasa = document.getElementById("filtroCasa")?.value || "";
    const filtroData = document.getElementById("filtroData")?.value || "";
    listarVisitantes(filtroCasa, filtroData);
});

// ---------- Inicialização ----------
window.addEventListener("DOMContentLoaded", () => {
    listarVisitantes();
});

// ---------- Tornar funções globais para os botões de editar/deletar ----------
window.deletarVisitante = deletarVisitante;
window.editarVisitante = editarVisitante;
