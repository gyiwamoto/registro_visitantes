// URL da API (para Docker Compose, usar o nome do serviço do backend)
const apiUrl = 'http://localhost:8080/visitantes';

// ---------- Eventos dos botões ----------
document.getElementById('visitanteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) e.stopPropagation();
    form.classList.add('was-validated');

    if (form.checkValidity()) {
        await adicionarVisitante();
    }
});

document.getElementById('listar-btn')?.addEventListener('click', listarVisitantes);
document.getElementById('cancelar-btn')?.addEventListener('click', cancelarFormulario);

// ---------- Funções utilitárias ----------
function cancelarFormulario() {
    limparFormulario();
}

function limparFormulario() {
    const campos = ['nome','cpf','condominio','contato','endereco','dataVisita','razao','morador','visitadoNome','telefoneVisitado','autorizador'];
    campos.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const mensagemEl = document.getElementById('mensagem');
    if (mensagemEl) {
        mensagemEl.innerText = '';
        mensagemEl.classList.add('d-none');
        mensagemEl.classList.remove('alert-success','alert-danger','alert-warning','alert-info');
    }

    const form = document.getElementById('visitanteForm');
    if (form) form.classList.remove('was-validated');
}

function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById('mensagem');
    if (!mensagemEl) return;
    mensagemEl.innerText = texto;
    mensagemEl.classList.remove('d-none','alert-success','alert-danger','alert-warning','alert-info');
    if (tipo === 'success') mensagemEl.classList.add('alert-success');
    else if (tipo === 'error') mensagemEl.classList.add('alert-danger');
    else if (tipo === 'warning') mensagemEl.classList.add('alert-warning');
    else mensagemEl.classList.add('alert-info');
}

// ---------- Listagem ----------
async function listarVisitantes() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Falha na comunicação com o servidor.');
        let visitantes = await response.json();

        const tbody = document.querySelector('#tabelaVisitantes tbody');
        if (tbody) tbody.innerHTML = '';

        visitantes.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${v.nome}</td>
                <td>${v.cpf}</td>
                <td>
                    ${v.condominio || 'Particular'}
                    ${v.empresa ? `<small>Empresa: ${v.empresa}</small>` : ''}
                </td>
                <td>${v.contato}</td>
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
        console.error('Erro ao listar visitantes:', error);
        exibirMensagem('❌ Erro ao listar visitantes!', 'error');
    }
}

// ---------- Cadastro ----------
async function adicionarVisitante() {
    const visitante = {
        nome: document.getElementById('nome')?.value.trim(),
        cpf: document.getElementById('cpf')?.value.trim(),
        condominio: document.getElementById('condominio')?.value.trim() || 'Particular',
        contato: document.getElementById('contato')?.value.trim(),
        endereco: document.getElementById('endereco')?.value.trim(),
        dataVisita: document.getElementById('dataVisita')?.value.trim(),
        razao: document.getElementById('razao')?.value.trim(),
        morador: document.getElementById('morador')?.value.trim(),
        visitadoNome: document.getElementById('visitadoNome')?.value.trim(),
        telefoneVisitado: document.getElementById('telefoneVisitado')?.value.trim(),
        autorizador: document.getElementById('autorizador')?.value.trim()
    };

    const camposObrigatorios = ['nome','cpf','contato','endereco','dataVisita','razao','morador','visitadoNome','telefoneVisitado','autorizador'];
    const camposVazios = camposObrigatorios.filter(c => !visitante[c]);

    if (camposVazios.length > 0) {
        exibirMensagem('⚠️ Preencha todos os campos obrigatórios antes de salvar.', 'warning');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitante)
        });

        if (response.status === 409) exibirMensagem('⚠️ Visitante já cadastrado', 'warning');
        else if (response.status === 201 || response.ok) {
            exibirMensagem('✅ Visitante cadastrado com sucesso!', 'success');
            limparFormulario();
            listarVisitantes();
        } else exibirMensagem('❌ Erro ao cadastrar visitante.', 'error');

    } catch (error) {
        console.error('Erro de comunicação com o servidor:', error);
        exibirMensagem('❌ Erro de comunicação com o servidor!', 'error');
    }
}

// ---------- Deletar ----------
async function deletarVisitante(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Falha ao deletar visitante');
        listarVisitantes();
        exibirMensagem('✅ Visitante deletado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao deletar visitante:', error);
        exibirMensagem('❌ Erro ao deletar visitante!', 'error');
    }
}

// ---------- Editar ----------
async function editarVisitante(id) {
    try {
        const visitanteExistente = await (await fetch(`${apiUrl}/${id}`)).json();

        const nome = prompt('Novo nome:', visitanteExistente.nome);
        if (nome === null) return;

        const cpf = prompt('Novo CPF:', visitanteExistente.cpf);
        if (cpf === null) return;

        const condominio = prompt('Novo condomínio/empresa:', visitanteExistente.condominio);
        if (condominio === null) return;

        const contato = prompt('Novo celular:', visitanteExistente.contato);
        if (contato === null) return;

        const endereco = prompt('Novo endereço:', visitanteExistente.endereco);
        if (endereco === null) return;

        const dataVisita = prompt('Nova data (yyyy-mm-dd):', visitanteExistente.dataVisita);
        if (dataVisita === null) return;

        const razao = prompt('Nova razão da visita:', visitanteExistente.razao);
        if (razao === null) return;

        const morador = prompt('Novo morador visitado:', visitanteExistente.morador);
        if (morador === null) return;

        const visitadoNome = prompt('Novo nome do visitado:', visitanteExistente.visitadoNome);
        if (visitadoNome === null) return;

        const telefoneVisitado = prompt('Novo telefone visitado:', visitanteExistente.telefoneVisitado);
        if (telefoneVisitado === null) return;

        const autorizador = prompt('Novo autorizador:', visitanteExistente.autorizador);
        if (autorizador === null) return;

        const dados = { nome, cpf, condominio, contato, endereco, dataVisita, razao, morador, visitadoNome, telefoneVisitado, autorizador };

        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error('Falha ao editar visitante');
        listarVisitantes();
        exibirMensagem('✅ Visitante atualizado com sucesso!', 'success');

    } catch (error) {
        console.error('Erro ao editar visitante:', error);
        exibirMensagem('❌ Erro ao editar visitante!', 'error');
    }
}
