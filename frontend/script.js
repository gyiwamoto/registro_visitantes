// URL da API (para Docker Compose, usar o nome do serviço do backend)
const apiUrl = 'http://localhost:8080/visitantes'; // Alterado para localhost para testes locais

// Submeter formulário de cadastro
document.getElementById('visitanteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target; // O formulário que foi submetido
    if (!form.checkValidity()) {
        e.stopPropagation();
    }
    form.classList.add('was-validated');

    if (form.checkValidity()) {
        await adicionarVisitante();
    }
});

// Botão Listar Visitantes
document.getElementById('listar-btn')?.addEventListener('click', () => {
    listarVisitantes();
    // Ocultar a seção de filtro ao listar (opcional, dependendo do fluxo desejado)
    // document.getElementById('filter-section').classList.add('d-none'); 
});

document.getElementById('btnListarVisitantes')?.addEventListener('click', listarVisitantes);

// Botão Cancelar
document.getElementById('cancelar-btn')?.addEventListener('click', cancelarFormulario);

// Função para cancelar o formulário e limpar validações
function cancelarFormulario() {
    ['nome', 'cpf', 'condominio', 'contato', 'endereco', 'dataVisita', 'razao', 'morador', 'visitadoNome', 'telefoneVisitado', 'documento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const mensagemEl = document.getElementById('mensagem');
    if (mensagemEl) {
        mensagemEl.innerText = '';
        mensagemEl.classList.add('d-none');
        mensagemEl.classList.remove('alert-success', 'alert-danger', 'alert-warning');
    }
    const form = document.getElementById('visitanteForm');
    if (form) {
        form.classList.remove('was-validated');
    }
}

// Função para exibir mensagem de feedback
function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById('mensagem');
    if (mensagemEl) {
        mensagemEl.innerText = texto;
        mensagemEl.classList.remove('d-none', 'alert-success', 'alert-danger', 'alert-warning');
        if (tipo === 'success') {
            mensagemEl.classList.add('alert-success');
        } else if (tipo === 'error') {
            mensagemEl.classList.add('alert-danger');
        } else if (tipo === 'warning') {
            mensagemEl.classList.add('alert-warning');
        } else {
            mensagemEl.classList.add('alert-info'); // Default para info
        }
    }
}

// Função para listar visitantes e aplicar filtros
async function listarVisitantes() {
    // const mensagemEl = document.getElementById('mensagem');
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Falha na comunicação com o servidor.");

        let visitantes = await response.json();

        // Aplicar filtros
        const filtroCasa = document.getElementById('filtroCasa')?.value.trim();
        const filtroData = document.getElementById('filtroData')?.value;
        if (filtroCasa) visitantes = visitantes.filter(v => v.morador && v.morador.includes(filtroCasa));
        if (filtroData) visitantes = visitantes.filter(v => v.dataVisita && v.dataVisita === filtroData);

        const tbody = document.querySelector('#tabelaVisitantes tbody');
        if (tbody) tbody.innerHTML = '';

        visitantes.forEach(v => {
            if (tbody) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${v.id}</td>
                    <td>${v.nome}</td>
                    <td>${v.cpf}</td>
                    <td>${v.condominio || 'Particular'}</td>
                    <td>${v.contato}</td>
                    <td>${v.endereco || ''}</td>
                    <td>${v.dataVisita || ''}</td>
                    <td>${v.razao || ''}</td>
                    <td>${v.morador || ''}</td>
                    <td>${v.visitadoNome || ''}</td>
                    <td>${v.telefoneVisitado || ''}</td>
                    <td>${v.documento || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-2" onclick="editarVisitante(${v.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deletarVisitante(${v.id})">Deletar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });

        // if (mensagemEl) {
        //     mensagemEl.innerText = `✅ Listados ${visitantes.length} visitantes`;
        //     mensagemEl.style.color = 'green';
        // }
        exibirMensagem(`✅ Listados ${visitantes.length} visitantes`, 'success');

    } catch (error) {
        console.error("Erro ao listar visitantes:", error);
        // if (mensagemEl) {
        //     mensagemEl.innerText = "❌ Erro ao listar visitantes!";
        //     mensagemEl.style.color = "red";
        // }
        exibirMensagem("❌ Erro ao listar visitantes!", 'error');
    }
}

// Função para adicionar visitante
async function adicionarVisitante() {
    // const mensagemEl = document.getElementById('mensagem');
    const visitante = {
        nome: document.getElementById('nome')?.value,
        cpf: document.getElementById('cpf')?.value.trim(),
        condominio: document.getElementById('condominio')?.value || 'Particular',
        contato: document.getElementById('contato')?.value,
        endereco: document.getElementById('endereco')?.value,
        dataVisita: document.getElementById('dataVisita')?.value,
        razao: document.getElementById('razao')?.value,
        morador: document.getElementById('morador')?.value,
        visitadoNome: document.getElementById('visitadoNome')?.value,
        telefoneVisitado: document.getElementById('telefoneVisitado')?.value,
        documento: document.getElementById('documento')?.value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(visitante)
        });

        if (response.status === 409) {
            // if (mensagemEl) {
            //     mensagemEl.innerText = "⚠️ Visitante já cadastrado";
            //     mensagemEl.style.color = "red";
            // }
            exibirMensagem("⚠️ Visitante já cadastrado", 'warning');
        } else if (response.status === 201 || response.ok) {
            // if (mensagemEl) {
            //     mensagemEl.innerText = "✅ Visitante cadastrado com sucesso!";
            //     mensagemEl.style.color = "green";
            // }
            exibirMensagem("✅ Visitante cadastrado com sucesso!", 'success');

            // Limpar formulário e validação
            cancelarFormulario();

            listarVisitantes();
        } else {
            // if (mensagemEl) {
            //     mensagemEl.innerText = "❌ Erro ao cadastrar visitante.";
            //     mensagemEl.style.color = "red";
            // }
            exibirMensagem("❌ Erro ao cadastrar visitante.", 'error');
        }
    } catch (error) {
        console.error("Erro de comunicação com o servidor:", error);
        // if (mensagemEl) {
        //     mensagemEl.innerText = "❌ Erro de comunicação com o servidor!";
        //     mensagemEl.style.color = "red";
        // }
        exibirMensagem("❌ Erro de comunicação com o servidor!", 'error');
    }
}

// Função para deletar visitante
async function deletarVisitante(id) {
    // const mensagemEl = document.getElementById('mensagem');
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Falha ao deletar visitante");
        listarVisitantes();
        // if (mensagemEl) {
        //     mensagemEl.innerText = "✅ Visitante deletado com sucesso!";
        //     mensagemEl.style.color = "green";
        // }
        exibirMensagem("✅ Visitante deletado com sucesso!", 'success');
    } catch (error) {
        console.error("Erro ao deletar visitante:", error);
        // if (mensagemEl) {
        //     mensagemEl.innerText = "❌ Erro ao deletar visitante!";
        //     mensagemEl.style.color = "red";
        // }
        exibirMensagem("❌ Erro ao deletar visitante!", 'error');
    }
}

// Função para editar visitante
async function editarVisitante(id) {
    // Para simplificar, vou usar prompts para edição. Em uma aplicação real, seria um modal/formulário.
    const visitanteExistente = await (await fetch(`${apiUrl}/${id}`)).json();

    const nome = prompt('Novo nome:', visitanteExistente.nome);
    if (nome === null) return; // Cancelado

    const cpf = prompt('Novo CPF:', visitanteExistente.cpf);
    if (cpf === null) return; // Cancelado

    const condominio = prompt('Novo condomínio/empresa:', visitanteExistente.condominio);
    if (condominio === null) return; // Cancelado

    const contato = prompt('Novo celular:', visitanteExistente.contato);
    if (contato === null) return; // Cancelado

    const endereco = prompt('Novo endereço:', visitanteExistente.endereco);
    if (endereco === null) return; // Cancelado

    const dataVisita = prompt('Nova data (yyyy-mm-dd):', visitanteExistente.dataVisita);
    if (dataVisita === null) return; // Cancelado

    const razao = prompt('Nova razão da visita:', visitanteExistente.razao);
    if (razao === null) return; // Cancelado

    const morador = prompt('Novo morador visitado:', visitanteExistente.morador);
    if (morador === null) return; // Cancelado

    const visitadoNome = prompt('Novo nome do visitado:', visitanteExistente.visitadoNome);
    if (visitadoNome === null) return; // Cancelado

    const telefoneVisitado = prompt('Novo telefone visitado:', visitanteExistente.telefoneVisitado);
    if (telefoneVisitado === null) return; // Cancelado

    const documento = prompt('Novo documento:', visitanteExistente.documento);
    if (documento === null) return; // Cancelado

    const dados = { nome, cpf, condominio, contato, endereco, dataVisita, razao, morador, visitadoNome, telefoneVisitado, documento };

    // const mensagemEl = document.getElementById('mensagem');
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error("Falha ao editar visitante");
        listarVisitantes();
        // if (mensagemEl) {
        //     mensagemEl.innerText = "✅ Visitante atualizado com sucesso!";
        //     mensagemEl.style.color = "green";
        // }
        exibirMensagem("✅ Visitante atualizado com sucesso!", 'success');
    } catch (error) {
        console.error("Erro ao editar visitante:", error);
        // if (mensagemEl) {
        //     mensagemEl.innerText = "❌ Erro ao editar visitante!";
        //     mensagemEl.style.color = "red";
        // }
        exibirMensagem("❌ Erro ao editar visitante!", 'error');
    }
}
