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

// Inicializa flag global para controlar listeners
window.listenersAtivos = window.listenersAtivos || {};

const moradorSelect = document.getElementById('morador');
if (moradorSelect && !window.listenersAtivos.morador) {
    moradorSelect.addEventListener('change', atualizarMoradores);
    window.listenersAtivos.morador = true;
}




const visitadoSelect = document.getElementById("visitadoNome");
if (visitadoSelect && !window.listenersAtivos.visitadoNome) {
    visitadoSelect.addEventListener("change", () => {
        const moradorSelecionado = visitadoSelect.value;
        const casaSelecionada = document.getElementById("morador").value;
        const telefoneInput = document.getElementById("telefoneVisitado");

        telefoneInput.value = "";
        const casa = window.moradores.find(c => String(c[0]) === String(casaSelecionada));
        if (!casa) return;

        const morador = casa.slice(1).find(m => m.nome === moradorSelecionado);
        if (morador) telefoneInput.value = morador.telefone || "";
    });
    window.listenersAtivos.visitadoNome = true;
}


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

// ----------------------------
// ADIÇÃO: Listener para popular moradores ao selecionar uma casa
// ----------------------------
const casaSelect = document.getElementById('morador');
const visitadoSelect = document.getElementById('visitadoNome');

if (casaSelect) {
    casaSelect.addEventListener('change', () => {
        const numeroCasa = casaSelect.value;

        // Preenche select de moradores da casa
        window.popularMoradores(numeroCasa, visitadoSelect);

        // Limpa telefone do visitado
        document.getElementById('telefoneVisitado').value = '';
    });
}


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



