// =======================
// URL da API
// =======================
const apiUrl = 'http://localhost:8080/visitantes';

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
// Função para listar visitantes
// =======================
async function listarVisitantes(filtroCasa = '', filtroData = '') {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Falha na comunicação com o servidor.');

        let visitantes = await response.json();

        // Aplicar filtros
        if (filtroCasa) {
            visitantes = visitantes.filter(v => v.morador && v.morador.toLowerCase().includes(filtroCasa.toLowerCase()));
        }
        if (filtroData) {
            visitantes = visitantes.filter(v => v.dataVisita === filtroData);
        }

        const tbody = document.querySelector('#tabelaVisitantes tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        visitantes.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.id || ''}</td>
                <td>${v.nome || ''}</td>
                <td>${v.cpf || ''}</td>
                <td>${v.condominio || ''}</td>
                <td>${v.contato || ''}</td>
                <td>${v.endereco || ''}</td>
                <td>${v.dataVisita || ''}</td>
                <td>${v.razao || ''}</td>
                <td>${v.morador || ''}</td>
                <td>${v.visitadoNome || ''}</td>
                <td>${v.telefoneVisitado || ''}</td>
                <td>${v.autorizador || ''}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editarVisitante(${v.id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deletarVisitante(${v.id})">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        exibirMensagem(`✅ Listados ${visitantes.length} visitantes`, 'success');
    } catch (error) {
        console.error(error);
        exibirMensagem('❌ Erro ao listar visitantes!', 'error');
    }
}

// =======================
// Função para deletar visitante
// =======================
async function deletarVisitante(id) {
    if (!confirm('Deseja realmente deletar este visitante?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao deletar visitante');

        listarVisitantes();
        exibirMensagem('✅ Visitante deletado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        exibirMensagem('❌ Erro ao deletar visitante!', 'error');
    }
}

// =======================
// Função para editar visitante
// =======================
async function editarVisitante(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) throw new Error('Falha ao buscar visitante');

        const visitanteExistente = await response.json();

        const nome = prompt('Novo nome:', visitanteExistente.nome);
        if (nome === null) return;

        const dadosAtualizados = { ...visitanteExistente, nome };

        const responsePut = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });
        if (!responsePut.ok) throw new Error('Falha ao editar visitante');

        listarVisitantes();
        exibirMensagem('✅ Visitante atualizado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        exibirMensagem('❌ Erro ao editar visitante!', 'error');
    }
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
        nome: document.getElementById('nome')?.value || '',
        cpf: document.getElementById('cpf')?.value || '',
        condominio: document.getElementById('condominio')?.value || '',
        contato: document.getElementById('contato')?.value || '',
        endereco: document.getElementById('endereco')?.value || '',
        dataVisita: document.getElementById('dataVisita')?.value || '',
        razao: document.getElementById('razao')?.value || '',
        morador: document.getElementById('morador')?.value || '',
        visitadoNome: document.getElementById('visitadoNome')?.value || '',
        telefoneVisitado: document.getElementById('telefoneVisitado')?.value || '',
        autorizador: autorizador
    };

    try {
        const response = await fetch(`${apiUrl}/salvar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitante)
        });
        if (!response.ok) throw new Error('Falha ao salvar visitante');

        listarVisitantes();
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

    selectMorador.innerHTML = '<option value="">Selecione o morador</option>';

    if (!casaSelecionada || !window.moradores) return;

    const idCasa = casaSelecionada.replace('C','');
    const casa = window.moradores.find(c => c[0] === idCasa);
    if (casa) {
        casa.slice(1).forEach(morador => {
            const option = document.createElement('option');
            option.value = morador.nome;
            option.textContent = morador.nome;
            selectMorador.appendChild(option);
        });
    }

    document.getElementById('telefoneVisitado').value = '';
    atualizarAutorizador();
}

// =======================
// Atualizar select/input do autorizador com base na casa
// =======================
function atualizarAutorizador() {
    const casaSelecionada = document.getElementById('morador')?.value;
    const container = document.getElementById('autorizadorContainer');
    if (!container) return;

    container.innerHTML = '';

    if (!casaSelecionada || !window.moradores) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'autorizadorInput';
        input.className = 'form-control';
        input.placeholder = 'Digite o nome do autorizador';
        container.appendChild(input);
        return;
    }

    const idCasa = casaSelecionada.replace('C','');
    const casa = window.moradores.find(c => c[0] === idCasa);
    if (!casa) return;

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
    listarVisitantes(filtroCasa, filtroData);
});

// =======================
// Evento submit do formulário
// =======================
document.getElementById('visitanteForm')?.addEventListener('submit', salvarVisitante);

// =======================
// Inicializa lista ao carregar a página
// =======================
window.addEventListener('DOMContentLoaded', () => {
    listarVisitantes();
});



