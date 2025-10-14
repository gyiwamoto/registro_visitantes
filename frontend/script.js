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
// Função utilitária para remover todos os listeners de um select
// =======================
function resetSelectListeners(select) {
    const clone = select.cloneNode(true);
    select.parentNode.replaceChild(clone, select);
    return clone;
}

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
// Atualizar dropdowns de moradores e autorizador
// =======================
function popularMoradores(numeroCasa) {
    const selectVisitado = document.getElementById('visitadoNome');
    selectVisitado.innerHTML = '<option value="">Selecione o morador</option>';
    if (!numeroCasa || !window.moradores) return;
    const casa = window.moradores.find(c => c[0] === numeroCasa);
    if (!casa) return;
    casa.slice(1).forEach(morador => {
        const option = document.createElement('option');
        option.value = morador.nome;
        option.text = morador.nome;
        selectVisitado.appendChild(option);
    });
}

function popularAutorizador(numeroCasa) {
    const container = document.getElementById('autorizadorContainer');
    if (!container) return;

    // Remove antigos
    while (container.firstChild) container.removeChild(container.firstChild);

    // Se não há casa, mostra só input
    if (!numeroCasa || !window.moradores) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'autorizadorInput';
        input.className = 'form-control';
        input.placeholder = 'Digite o nome do autorizador';
        container.appendChild(input);
        return;
    }

    // Cria select de autorizador
    const casa = window.moradores.find(c => c[0] === numeroCasa);
    const select = document.createElement('select');
    select.id = 'autorizadorSelect';
    select.className = 'form-select';
    select.innerHTML = '<option value="">Selecione o autorizador</option>';
    if (casa) {
        casa.slice(1).forEach(morador => {
            const option = document.createElement("option");
            option.value = morador.nome;
            option.text = morador.nome;
            select.appendChild(option);
        });
    }
    const outro = document.createElement('option');
    outro.value = 'Outro';
    outro.text = 'Outro';
    select.appendChild(outro);

    // Input para "Outro"
    const inputOutro = document.createElement('input');
    inputOutro.type = 'text';
    inputOutro.id = 'autorizadorInput';
    inputOutro.className = 'form-control mt-1';
    inputOutro.placeholder = 'Digite o nome do autorizador';
    inputOutro.style.display = 'none';

    // Listener único para select
    select.addEventListener('change', function() {
        if (select.value === 'Outro') {
            inputOutro.style.display = 'block';
            inputOutro.value = '';
            inputOutro.focus();
        } else {
            inputOutro.style.display = 'none';
            inputOutro.value = select.value;
        }
    });

    container.appendChild(select);
    container.appendChild(inputOutro);
}

// =======================
// Inicialização central dos listeners únicos
// =======================
window.addEventListener("DOMContentLoaded", function() {
    // Casa visitada
    let casaSelect = document.getElementById("morador");
    casaSelect = resetSelectListeners(casaSelect);
    casaSelect.addEventListener('change', function() {
        popularMoradores(this.value);
        popularAutorizador(this.value);
        const telefoneInput = document.getElementById('telefoneVisitado');
        if (telefoneInput) telefoneInput.value = '';
    });

    // Nome do visitado
    let visitadoSelect = document.getElementById('visitadoNome');
    visitadoSelect = resetSelectListeners(visitadoSelect);
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

    // Autorizador (sempre atualizado quando muda a casa)
    popularAutorizador(document.getElementById('morador')?.value);

    // Botão cancelar
    let cancelarBtn = document.getElementById("cancelar-btn");
    cancelarBtn = resetSelectListeners(cancelarBtn);
    cancelarBtn.addEventListener("click", limparFormulario);

    // Envio do formulário de visitante
    let visitanteForm = document.getElementById("visitanteForm");
    visitanteForm = resetSelectListeners(visitanteForm);
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
                visitanteForm.reset();
                document.getElementById("telefoneVisitado").value = "";
                if (autorizadorInput) {
                    autorizadorInput.classList.add("d-none");
                    autorizadorInput.value = "";
                }
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

    // Estado inicial dos selects
    popularMoradores(document.getElementById('morador')?.value);
    popularAutorizador(document.getElementById('morador')?.value);
    const visitadoSelect2 = document.getElementById("visitadoNome");
    if (visitadoSelect2) {
        visitadoSelect2.innerHTML = '<option value="">Selecione o morador</option>';
    }
    const autorizadorSelect2 = document.getElementById("autorizadorSelect");
    if (autorizadorSelect2) {
        autorizadorSelect2.innerHTML = '<option value="">Selecione o autorizador</option>';
    }
});

// =======================
// Função para limpar o formulário de cadastro
// =======================
function limparFormulario() {
    const visitanteForm = document.getElementById("visitanteForm");
    if (visitanteForm) visitanteForm.reset();

    document.getElementById("telefoneVisitado").value = "";
    const autorizadorInput = document.getElementById("autorizadorInput");
    if (autorizadorInput) {
        autorizadorInput.classList.add("d-none");
        autorizadorInput.value = "";
    }
    const mensagemEl = document.getElementById("mensagem");
    if (mensagemEl) {
        mensagemEl.textContent = "";
        mensagemEl.classList.remove("text-success", "text-danger");
    }
}