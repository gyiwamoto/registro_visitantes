// =======================
// URL da API
// =======================
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const apiUrl = isLocalhost
    ? "http://localhost:8080/api/visitantes" // URL para desenvolvimento local
    : "http://34.68.192.236:8080/api/visitantes"; // URL para produção na nuvem

// =======================
// Exibir mensagens
// =======================
function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById('mensagem');
    if (!mensagemEl) return;
    mensagemEl.innerText = texto;
    mensagemEl.classList.remove('alert-success','alert-danger','alert-warning','alert-info');
    switch (tipo) {
        case 'success': mensagemEl.classList.add('alert-success'); break;
        case 'error': mensagemEl.classList.add('alert-danger'); break;
        case 'warning': mensagemEl.classList.add('alert-warning'); break;
        default: mensagemEl.classList.add('alert-info'); break;
    }
}

// =======================
// Listar visitantes
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
                <td>${v.empresa || ''}</td>
                <td>${v.contato || ''}</td>
                <td>${v.endereco || ''}</td>
                <td>${v.dataVisita || ''}</td>
                <td>${v.razaoVisita || ''}</td>
                <td>${v.numeroCasa || ''}</td>
                <td>${v.nomeVisitado || ''}</td>
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
// Deletar visitante
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
// Editar visitante
// =======================
async function editarVisitante(id) {
    try {
        const visitanteExistente = await (await fetch(`${apiUrl}/${id}`)).json();

        const nome = prompt('Novo nome do visitante:', visitanteExistente.nome);
        if (nome === null) return;

        const dados = { ...visitanteExistente, nome };

        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) throw new Error('Falha ao editar visitante');
        listarVisitantes();
        exibirMensagem('✅ Visitante atualizado com sucesso!', 'success');
    } catch (error) {
        console.error(error);
        exibirMensagem('❌ Erro ao editar visitante!', 'error');
    }
}

// =======================
// Filtros
// =======================
document.getElementById('btnListarVisitantes')?.addEventListener('click', () => {
    const filtroCasa = document.getElementById('filtroCasa')?.value || '';
    const filtroData = document.getElementById('filtroData')?.value || '';
    listarVisitantes(filtroCasa, filtroData);
});

// =======================
// Carregar lista ao iniciar
// =======================
window.addEventListener('DOMContentLoaded', () => {
    listarVisitantes();
});

// Expor funções globalmente para acesso via onclick no HTML
window.listarVisitantes = listarVisitantes;
window.deletarVisitante = deletarVisitante;
window.editarVisitante = editarVisitante;
