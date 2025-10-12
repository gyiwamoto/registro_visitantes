// =======================
// script.js atualizado e funcional
// =======================

import { 
    salvarVisitante as salvarAPI, 
    listarVisitantes as listarAPI, 
    editarVisitante as editarAPI, 
    deletarVisitante as deletarAPI 
} from "./apiVisitantes.js";

const moradores = window.moradores;

// =======================
// Exibir mensagens
// =======================
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

// =======================
// Limpar formulário
// =======================
function limparFormulario() {
    const campos = [
        "nome","cpf","condominio","contato","endereco",
        "dataVisita","razao","morador","visitadoNome",
        "telefoneVisitado","autorizadorInput","autorizadorSelect"
    ];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.value = "";
            if(id === "autorizadorInput") el.classList.add("d-none");
        }
    });

    const form = document.getElementById("visitanteForm");
    if (form) form.classList.remove("was-validated");

    const mensagemEl = document.getElementById("mensagem");
    if (mensagemEl) {
        mensagemEl.innerText = "";
        mensagemEl.classList.remove("alert-success","alert-danger","alert-warning","alert-info");
    }
}

// =======================
// Atualizar select de moradores e telefone automaticamente
// =======================

document.addEventListener("DOMContentLoaded", () => {
    const selectCasa = document.getElementById("morador");
    const selectVisitado = document.getElementById("visitadoNome");
    const telefoneInput = document.getElementById("telefoneVisitado");

    if (!selectCasa || !selectVisitado || !telefoneInput || !window.moradores) return;

    // Quando muda a casa, preenche o select de moradores
    selectCasa.addEventListener("change", () => {
        const casaSelecionada = selectCasa.value;
        selectVisitado.innerHTML = '<option value="">Selecione o morador</option>';
        telefoneInput.value = "";

        const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
        if (!casa) return;

        casa.slice(1).forEach(m => {
            if (m && m.nome) {
                const opt = document.createElement("option");
                opt.value = m.nome;
                opt.textContent = m.nome;
                selectVisitado.appendChild(opt);
            }
        });
    });

    // Quando muda o morador, preenche o telefone
    selectVisitado.addEventListener("change", () => {
        const casaSelecionada = selectCasa.value;
        const moradorSelecionado = selectVisitado.value;
        telefoneInput.value = "";

        const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
        if (!casa) return;

        const morador = casa.slice(1).find(m => m.nome === moradorSelecionado);
        if (morador) telefoneInput.value = morador.telefone || "";
    });
});

// =======================
// Eventos de selects
// =======================

// Preencher select de moradores assim que a casa for selecionada
const selectCasa = document.getElementById("morador");
const selectVisitado = document.getElementById("visitadoNome");

selectCasa?.addEventListener("change", () => {
    const casaSelecionada = selectCasa.value;
    if (!casaSelecionada || !window.moradores) {
        selectVisitado.innerHTML = '<option value="">Selecione o morador</option>';
        return;
    }

    // Limpa e adiciona opção padrão
    selectVisitado.innerHTML = '<option value="">Selecione o morador</option>';

    // Busca os moradores da casa selecionada
    const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
    if (!casa) return;

    // Popula o select de visitado
    casa.slice(1).forEach(m => {
        if (m && m.nome) {
            const opt = document.createElement("option");
            opt.value = m.nome;
            opt.textContent = m.nome;
            selectVisitado.appendChild(opt);
        }
    });
});

// Atualiza campo do autorizador ao escolher do select
document.getElementById("autorizadorSelect")?.addEventListener("change", function() {
    const input = document.getElementById("autorizadorInput");
    if(this.value === "Outro") {
        input.classList.remove("d-none");
        input.value = "";
        input.focus();
    } else {
        input.classList.add("d-none");
        input.value = this.value;
    }
});

// =======================
// Envio do formulário
// =======================
document.getElementById("visitanteForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const visitante = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        condominio: document.getElementById("condominio").value.trim(),
        contato: document.getElementById("contato").value.trim(),
        endereco: document.getElementById("endereco").value.trim(),
        dataVisita: document.getElementById("dataVisita").value,
        razao: document.getElementById("razao").value.trim(),
        morador: document.getElementById("morador").value,
        visitadoNome: document.getElementById("visitadoNome").value,
        telefoneVisitado: document.getElementById("telefoneVisitado").value,
        autorizador: document.getElementById("autorizadorInput").classList.contains("d-none") 
                     ? document.getElementById("autorizadorSelect").value
                     : document.getElementById("autorizadorInput").value.trim()
    };

    try {
        await salvarAPI(visitante);
        exibirMensagem("Visitante salvo com sucesso!", "success");
        limparFormulario();
    } catch (err) {
        console.error("Erro ao salvar visitante:", err);
        exibirMensagem(`Erro ao salvar visitante: ${err.message}`, "error");
    }
});



