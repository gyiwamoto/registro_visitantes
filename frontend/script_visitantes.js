// =======================
// URL da API
// =======================
const apiUrl = 'http://localhost:8080/api/visitantes';

// =======================
// Função para exibir mensagens
// =======================
function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById('mensagem');
    if (!mensagemEl) return;

    mensagemEl.innerText = texto;
    mensagemEl.classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');

    switch (tipo) {
        case 'success':
            mensagemEl.classList.add('alert-success');
            break;
        case 'error':
            mensagemEl.classList.add('alert-danger');
            break;
        case 'warning':
            mensagemEl.classList.add('alert-warning');
            break;
        default:
            mensagemEl.classList.add('alert-info');
            break;
    }
}

// =======================
// Função para limpar formulário
// =======================
function limparFormulario() {
    const form = document.getElementById('visitanteForm');
    if (!form) return;

    form.reset();
    const mensagemEl = document.getElementById('mensagem');
    if (mensagemEl) mensagemEl.innerText = '';
    atualizarMoradores(); // limpa o select de visitadoNome
    atualizarAutorizador(); // limpa select/input de autorizador
}

// =======================
// Função para salvar novo visitante
// =======================
async function salvarVisitante(event) {
    event.preventDefault();

    // Obter valor do autorizador: select ou input "Outro"
    let autorizador = '';
    const selectAutorizador = document.getElementById('autorizadorSelect');
    const inputAutorizador = document.getElementById('autorizadorInput');

    if (selectAutorizador) {
        if (selectAutorizador.value === 'Outro' && inputAutorizador) {
            autorizador = inputAutorizador.value;
        } else {
            autorizador = selectAutorizador.value;
        }
    }

    const visitante = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        documento: document.getElementById("documento").value.trim(), // Novo campo
        empresa: document.getElementById("condominio").value.trim(), // Mapeado para 'empresa'
        contato: document.getElementById("contato").value.trim(),
        endereco: document.getElementById("endereco").value.trim(),
        dataVisita: document.getElementById("dataVisita").value,
        razaoVisita: document.getElementById("razao").value.trim(), // Mapeado para 'razaoVisita'
        numeroCasa: document.getElementById("morador").value, // Mapeado para 'numeroCasa'
        nomeVisitado: document.getElementById("visitadoNome").value,
        telefoneVisitado: document.getElementById("telefoneVisitado").value,
        autorizador: document.getElementById("autorizadorInput").classList.contains("d-none") 
                     ? document.getElementById("autorizadorSelect").value
                     : document.getElementById("autorizadorInput").value.trim()
    };

    try {
        const response = await fetch(`${apiUrl}/salvar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitante)
        });
        if (!response.ok) throw new Error('Falha ao salvar visitante');

        // As funções de listagem e edição estão agora em script_lista_visitantes.js
        // Não chame listarVisitantes() aqui para evitar chamadas duplicadas
        limparFormulario();
        exibirMensagem('✅ Visitante cadastrado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        exibirMensagem('❌ Erro ao salvar visitante!', 'error');
    }
}

// =======================
// Atualizar select de visitadoNome com base na casa
// =======================
function atualizarMoradores() {
    const casaSelecionada = document.getElementById('morador')?.value;
    const selectMorador = document.getElementById('visitadoNome');
    if (!selectMorador) return;

    // limpa opções do select
    selectMorador.innerHTML = '<option value="">Selecione o morador</option>';

        // se não há casa selecionada ou lista de moradores, cria campo manual de autorizador
    if (!casaSelecionada || !window.moradores) {
        atualizarAutorizador();
        return;
    }

       // Corrigido: usa o ID completo (C1, C2, C11, etc.)
    
    const casa = window.moradores.find(c => c[0].toLowerCase() === casaSelecionada.toLowerCase());
    if (casa) {
        casa.slice(1).forEach(morador => {
            const option = document.createElement('option');
            option.value = morador.nome;
            option.textContent = morador.nome;
            selectMorador.appendChild(option);
        });
    }

    // Limpa o telefone do morador
    document.getElementById('telefoneVisitado');
    if (telefoneInput) telefoneInput.value = '';

    // Atualiza campo de autorizador
    atualizarAutorizador();
}

// =======================
// Atualizar select/input do autorizador com base na casa
// =======================
function atualizarAutorizador() {
    const casaSelecionada = document.getElementById('morador')?.value;
    const container = document.getElementById('autorizadorContainer');
    if (!container) return;

    // Remove input antigo, se existir
    const oldInput = document.getElementById('autorizadorInput');
    if (oldInput) oldInput.remove();

    // Remove select antigo, se existir
    const oldSelect = document.getElementById('autorizadorSelect');
    if (oldSelect) oldSelect.remove();

    // Se não há casa selecionada, cria input manual editável
    if (!casaSelecionada || !window.moradores) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'autorizadorInput';
        input.className = 'form-control';
        input.placeholder = 'Digite o nome do autorizador';
        container.appendChild(input);
        return;
    }

        // Busca a casa pelo ID completo (C1, C2...)
    const casa = window.moradores.find(c => c[0].toLowerCase() === casaSelecionada.toLowerCase());
    if (!casa) return;

     // Cria select com moradores
    const select = document.createElement('select');
    select.id = 'autorizadorSelect';
    select.className = 'form-select';

    // Adicionar moradores como opções
    casa.slice(1).forEach(morador => {
        const option = document.createElement('option');
        option.value = morador.nome;
        option.textContent = morador.nome;
        select.appendChild(option);
    });

    // Opção "Outro"
    const outro = document.createElement('option');
    outro.value = 'Outro';
    outro.textContent = 'Outro';
    select.appendChild(outro);

    container.appendChild(select);

    // Input para "Outro"
    const inputOutro = document.createElement('input');
    inputOutro.type = 'text';
    inputOutro.id = 'autorizadorInput';
    inputOutro.className = 'form-control mt-1';
    inputOutro.placeholder = 'Digite o nome do autorizador';
    inputOutro.style.display = 'none';
    container.appendChild(inputOutro);

     // Alterna visibilidade do input quando "Outro" é selecionado
    select.addEventListener('change', () => {
        if (select.value === 'Outro') {
            inputOutro.style.display = 'block';
        } else {
            inputOutro.style.display = 'none';
        }
    });
}

// =======================
// Atualizar telefone ao selecionar morador
// =======================
document.getElementById('visitadoNome')?.addEventListener('change', function() {
    const casaSelecionada = document.getElementById('morador')?.value;
    const moradorSelecionado = this.value;
    const telefoneInput = document.getElementById('telefoneVisitado');

    telefoneInput.value = '';

    if (!casaSelecionada || !moradorSelecionado || !window.moradores) return;

    const idCasa = casaSelecionada.replace('C','');
    const casa = window.moradores.find(c => c[0] === idCasa);
    if (casa) {
        const morador = casa.slice(1).find(m => m.nome === moradorSelecionado);
        if (morador && morador.telefone) {
            telefoneInput.value = morador.telefone;
        }
    }
});

// =======================
// Atualiza a lista de moradores sempre que a casa for alterada
// =======================
document.getElementById('morador')?.addEventListener('change', atualizarMoradores);

// =======================
// Filtros de listagem
// =======================
document.getElementById('btnListarVisitantes')?.addEventListener('click', () => {
    const filtroCasa = document.getElementById('filtroCasa')?.value || '';
    const filtroData = document.getElementById('filtroData')?.value || '';
    // A função listarVisitantes está agora em script_lista_visitantes.js e exposta globalmente
    window.listarVisitantes(filtroCasa, filtroData);
});

// =======================
// Evento submit do formulário
// =======================
document.getElementById('visitanteForm')?.addEventListener('submit', salvarVisitante);

// =======================
// Inicializa lista ao carregar a página
// =======================
window.addEventListener('DOMContentLoaded', () => {
    // A função listarVisitantes está agora em script_lista_visitantes.js e exposta globalmente
    window.listarVisitantes();
});



