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

     // Remove listeners antigos se existirem
    selectCasa.replaceWith(selectCasa.cloneNode(true));
    selectVisitado.replaceWith(selectVisitado.cloneNode(true));
    telefoneInput.replaceWith(telefoneInput.cloneNode(true));

     // Re-referenciar após remoção
    const newSelectCasa = document.getElementById("morador");
    const newSelectVisitado = document.getElementById("visitadoNome");   
    const newTelefoneInput = document.getElementById("telefoneVisitado"); 

    // Quando muda a casa, preenche o select de moradores
    newSelectCasa.addEventListener("change", () => {
        const casaSelecionada = newSelectCasa.value;
        newSelectVisitado.innerHTML = '<option value="">Selecione o morador</option>';
        newTelefoneInput.value = "";

        const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
        if (!casa) return;

        casa.slice(1).forEach(m => {
            if (m && m.nome) {
                const opt = document.createElement("option");
                opt.value = m.nome;
                opt.textContent = m.nome;
                newselectVisitado.appendChild(opt);
            }
        });
    });

    // Quando muda o morador, preenche o telefone
    newSelectVisitado.addEventListener("change", () => {
        const casaSelecionada = newSelectCasa.value;
        const moradorSelecionado = newSelectVisitado.value;
        newtelefoneInput.value = "";

        const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
        if (!casa) return;

        const morador = casa.slice(1).find(m => m.nome === moradorSelecionado);
        if (morador) newtelefoneInput.value = morador.telefone || "";
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



