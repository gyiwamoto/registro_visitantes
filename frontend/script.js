// URL da API (para Docker Compose, usar o nome do serviço do backend)
const apiUrl = 'http://backend:8080/visitantes';

// Submeter formulário de cadastro
document.getElementById('visitanteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await adicionarVisitante();
});

// Botão Listar Visitantes
document.getElementById('btnListarVisitantes')?.addEventListener('click', listarVisitantes);

// Função para listar visitantes e aplicar filtros
async function listarVisitantes() {
    const mensagemEl = document.getElementById('mensagem');
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
                        <button onclick="editarVisitante(${v.id})">Editar</button>
                        <button onclick="deletarVisitante(${v.id})">Deletar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        });

        if (mensagemEl) {
            mensagemEl.innerText = `✅ Listados ${visitantes.length} visitantes`;
            mensagemEl.style.color = 'green';
        }
    } catch (error) {
        console.error("Erro ao listar visitantes:", error);
        if (mensagemEl) {
            mensagemEl.innerText = "❌ Erro ao listar visitantes!";
            mensagemEl.style.color = "red";
        }
    }
}

// Função para adicionar visitante
async function adicionarVisitante() {
    const mensagemEl = document.getElementById('mensagem');
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
            if (mensagemEl) {
                mensagemEl.innerText = "⚠️ Visitante já cadastrado";
                mensagemEl.style.color = "red";
            }
        } else if (response.status === 201 || response.ok) {
            if (mensagemEl) {
                mensagemEl.innerText = "✅ Visitante cadastrado com sucesso!";
                mensagemEl.style.color = "green";
            }

            // Limpar formulário
            ['nome','cpf','condominio','contato','endereco','dataVisita','razao','morador','visitadoNome','telefoneVisitado','documento'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });

            listarVisitantes();
        } else {
            if (mensagemEl) {
                mensagemEl.innerText = "❌ Erro ao cadastrar visitante.";
                mensagemEl.style.color = "red";
            }
        }
    } catch (error) {
        console.error("Erro de comunicação com o servidor:", error);
        if (mensagemEl) {
            mensagemEl.innerText = "❌ Erro de comunicação com o servidor!";
            mensagemEl.style.color = "red";
        }
    }
}

// Função para deletar visitante
async function deletarVisitante(id) {
    const mensagemEl = document.getElementById('mensagem');
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error("Falha ao deletar visitante");
        listarVisitantes();
        if (mensagemEl) {
            mensagemEl.innerText = "✅ Visitante deletado com sucesso!";
            mensagemEl.style.color = "green";
        }
    } catch (error) {
        console.error("Erro ao deletar visitante:", error);
        if (mensagemEl) {
            mensagemEl.innerText = "❌ Erro ao deletar visitante!";
            mensagemEl.style.color = "red";
        }
    }
}

// Função para editar visitante
async function editarVisitante(id) {
    const nome = prompt('Novo nome:');
    const cpf = prompt('Novo CPF:');
    const condominio = prompt('Novo condomínio/empresa:');
    const contato = prompt('Novo celular:');
    const endereco = prompt('Novo endereço:');
    const dataVisita = prompt('Nova data (yyyy-mm-dd):');
    const razao = prompt('Nova razão da visita:');
    const morador = prompt('Novo morador visitado:');
    const visitadoNome = prompt('Novo nome do visitado:');
    const telefoneVisitado = prompt('Novo telefone visitado:');
    const documento = prompt('Novo documento:');

    const dados = { nome, cpf, condominio, contato, endereco, dataVisita, razao, morador, visitadoNome, telefoneVisitado, documento };

    const mensagemEl = document.getElementById('mensagem');
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        if (!response.ok) throw new Error("Falha ao editar visitante");
        listarVisitantes();
        if (mensagemEl) {
            mensagemEl.innerText = "✅ Visitante atualizado com sucesso!";
            mensagemEl.style.color = "green";
        }
    } catch (error) {
        console.error("Erro ao editar visitante:", error);
        if (mensagemEl) {
            mensagemEl.innerText = "❌ Erro ao editar visitante!";
            mensagemEl.style.color = "red";
        }
    }
}
