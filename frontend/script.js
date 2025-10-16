// =======================
// script.js - listeners únicos e campo autorizador dinâmico
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

    // Removido: Limpeza da mensagem de sucesso daqui para que ela possa ser vista.
    // A mensagem será limpa por uma nova interação ou recarregamento da página.
}

// =======================
// Inicialização central dos listeners únicos
// =======================
window.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded iniciado...");

    // Popular o select de Casa Visitada
    const selectCasa = document.getElementById("morador");
    if (selectCasa && window.moradores) {
        selectCasa.innerHTML = '<option value="">Selecione a casa</option>';
        window.moradores.forEach(c => {
            const option = document.createElement('option');
            option.value = c[0];
            option.text = c[0];
            selectCasa.appendChild(option);
        });
    }

    // Anexar listeners APÓS popular os selects
    if (selectCasa) {
        selectCasa.addEventListener('change', function() {
            console.log("Casa selecionada (change event disparado):", this.value);
            window.popularMoradores(this.value, document.getElementById('visitadoNome'));
            window.popularAutorizador(this.value);
            const telefoneInput = document.getElementById('telefoneVisitado');
            if (telefoneInput) telefoneInput.value = '';
        });
    }

    // Nome do visitado
    let visitadoSelect = document.getElementById('visitadoNome');
    if (visitadoSelect) {
        visitadoSelect.addEventListener('change', function() {
            const numeroCasa = document.getElementById('morador').value;
            const nomeMorador = this.value;
            const telefoneInput = document.getElementById('telefoneVisitado');
            telefoneInput.value = "";
            if (!numeroCasa || !nomeMorador || !window.moradores) return;
            const casa = window.moradores.find(c => c[0] === numeroCasa);
            if (!casa) return;
            const morador = casa.slice(1).find(m => m.nome === nomeMorador);
            if (morador) telefoneInput.value = morador.telefone;
        });
    }

    // Botão cancelar
    let cancelarBtn = document.getElementById("cancelar-btn");
    if (cancelarBtn) {
        cancelarBtn.addEventListener("click", limparFormulario);
    }

    // Envio do formulário de visitante
    let visitanteForm = document.getElementById("visitanteForm");
    if (visitanteForm) {
        visitanteForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            // Obter valor do autorizador: select ou input "Outro"
            let autorizador = "";
            const autorizadorSelect = document.getElementById("autorizadorSelect");
            const autorizadorInput = document.getElementById("autorizadorInput");
            if (autorizadorSelect) {
                if (autorizadorSelect.value === "Outro" && autorizadorInput) {
                    autorizador = autorizadorInput.value;
                } else {
                    autorizador = autorizadorSelect.value;
                }
            } else if (autorizadorInput) {
                autorizador = autorizadorInput.value;
            }

            // Coletar dados do formulário
            const visitante = {
                nome: document.getElementById("nome").value.trim(),
                cpf: document.getElementById("cpf").value.trim(),
                documento: document.getElementById("documento").value.trim(),
                condominio: document.getElementById("condominio").value.trim(),
                contato: document.getElementById("contato").value.trim(),
                endereco: document.getElementById("endereco").value.trim(),
                dataVisita: document.getElementById("dataVisita").value,
                razao: document.getElementById("razao").value.trim(),
                morador: document.getElementById("morador").value,
                visitadoNome: document.getElementById("visitadoNome").value,
                telefoneVisitado: document.getElementById("telefoneVisitado").value,
                autorizador: autorizador
            };

            try {
                const response = await salvarAPI(visitante);
                const msgDiv = document.getElementById("mensagem");
                if (response && response.success) {
                    msgDiv.textContent = "Visitante salvo com sucesso!";
                    msgDiv.classList.remove("text-danger");
                    msgDiv.classList.add("text-success");
                    limparFormulario();
                } else {
                    msgDiv.textContent = "Erro ao salvar visitante.";
                    msgDiv.classList.remove("text-success");
                    msgDiv.classList.add("text-danger");
                }
            } catch (error) {
                console.error(error);
                const msgDiv = document.getElementById("mensagem");
                msgDiv.textContent = "Erro ao salvar visitante.";
                msgDiv.classList.remove("text-success");
                msgDiv.classList.add("text-danger");
            }
        });
    }

    // Estado inicial dos selects
    // As funções popularMoradores e popularAutorizador são chamadas aqui para garantir o estado inicial
    window.popularMoradores(selectCasa.value, document.getElementById('visitadoNome'));
    window.popularAutorizador(selectCasa.value);

    console.log("DOMContentLoaded finalizado.");
});

// =======================
// Função para limpar o formulário de cadastro
// =======================