const apiUrl = 'http://localhost:8080/visitantes';

document.getElementById('visitanteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await adicionarVisitante();
});

// Função para listar visitantes e aplicar filtros
async function listarVisitantes() {
    const response = await fetch(apiUrl);
    let visitantes = await response.json();

    // Aplicar filtros se existirem
    const filtroCasa = document.getElementById('filtroCasa')?.value.trim();
    const filtroData = document.getElementById('filtroData')?.value;
    if(filtroCasa) visitantes = visitantes.filter(v => v.morador && v.morador.includes(filtroCasa));
    if(filtroData) visitantes = visitantes.filter(v => v.dataVisita && v.dataVisita === filtroData);

    const tbody = document.querySelector('#tabelaVisitantes tbody');
    const lista = document.getElementById('visitantesList');
    if(tbody) tbody.innerHTML = '';
    if(lista) lista.innerHTML = '';

    visitantes.forEach(v => {
        // Para tabela
        if(tbody) {
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
                <td>${v.documento}</td>
                <td>
                    <button onclick="editarVisitante(${v.id})">Editar</button>
                    <button onclick="deletarVisitante(${v.id})">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        }

        // Para lista simples (antigo script)
        if(lista) {
            const li = document.createElement('li');
            li.textContent = `${v.cpf} - ${v.visitadoNome || v.visitado} (${v.dataVisita || v.data_visita})`;
            lista.appendChild(li);
        }
    });
}

// Função para adicionar visitante com validação de CPF
async function adicionarVisitante() {
    const cpf = document.getElementById('cpf').value.trim();
    const response = await fetch(apiUrl);
    const existentes = await response.json();
    const mensagemEl = document.getElementById('mensagem');

    if(existentes.some(v => v.cpf === cpf)) {
        if(mensagemEl) {
            mensagemEl.innerText = "Visitante já Cadastrado";
            mensagemEl.style.color = "red";
        }
        return;
    }

    const visitante = {
        nome: document.getElementById('nome')?.value,
        cpf: cpf,
        condominio: document.getElementById('condominio')?.value || 'Particular',
        contato: document.getElementById('contato')?.value || document.getElementById('celular')?.value,
        endereco: document.getElementById('endereco')?.value,
        dataVisita: document.getElementById('dataVisita')?.value || document.getElementById('data_visita')?.value,
        razao: document.getElementById('razao')?.value,
        morador: document.getElementById('morador')?.value || document.getElementById('visitado')?.value,
        visitadoNome: document.getElementById('visitadoNome')?.value,
        telefoneVisitado: document.getElementById('telefoneVisitado')?.value,
        documento: document.getElementById('documento')?.value
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitante)
    });

    if(mensagemEl) {
        mensagemEl.innerText = "Visitante cadastrado com sucesso!";
        mensagemEl.style.color = "green";
    }

    // Limpar formulário
    ['nome','cpf','condominio','contato','celular','endereco','dataVisita','data_visita','razao','morador','visitado','visitadoNome','telefoneVisitado','documento'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
    });

    listarVisitantes();
}

// Deletar visitante
async function deletarVisitante(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    listarVisitantes();
}

// Editar visitante
async function editarVisitante(id) {
    const nome = prompt('Novo nome:');
    const cpf = prompt('Novo CPF:');
    const condominio = prompt('Nova empresa/condomínio:');
    const contato = prompt('Novo celular:');
    const endereco = prompt('Novo endereço:');
    const dataVisita = prompt('Nova data (yyyy-mm-dd):');
    const razao = prompt('Nova razão da visita:');
    const morador = prompt('Novo morador visitado:');
    const visitadoNome = prompt('Novo nome do visitado:');
    const telefoneVisitado = prompt('Novo telefone visitado:');
    const documento = prompt('Novo documento:');

    const dados = { nome, cpf, condominio, contato, endereco, dataVisita, razao, morador, visitadoNome, telefoneVisitado, documento };
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    listarVisitantes();
}

// Inicializa a listagem
listarVisitantes();
