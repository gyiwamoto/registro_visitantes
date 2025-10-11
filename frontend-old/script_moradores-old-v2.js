// =======================
// Dados iniciais dos moradores
// =======================
window.moradores = [
    ['1', 'Antonio', 'Aparecida', '', '', '', '', '', ''],
    ['2', 'Carlos', 'Viviane', 'Milena', 'Helena', 'Isadora', '', '', ''],
    ['3', 'Gerson', 'Luciana', 'Beatriz', 'Gabrielle', '', '', '', ''],
    ['4', 'João', 'Tamisa', 'João Jr.', 'Victor', 'Carol', '', '', ''],
    ['5', 'Arthur', 'Eliene', '', '', '', '', '', ''],
    ['6', 'Orlando', 'Joana', 'Carlos', 'Marcela', '', '', '', ''],
    ['7', 'Leonardo', 'Vania', '', '', '', '', '', ''],
    ['8', 'Jessé', 'Maria', 'Leonardo', '', '', '', '', ''],
    ['9', 'Maurici', 'Noêmia', 'Claudia', '', '', '', '', ''],
    ['10', 'Manoel', 'Antonia', '', '', '', '', '', ''],
    ['11', 'Terezinha', 'Silvana', 'Luana', 'Maria', '', '', '', ''],
    ['12', 'Alvin', 'Claudete', 'Joana', '', '', '', '', ''],
    ['13', 'Osmar', 'Rodrigo', 'João', '', '', '', '', ''],
    ['14', 'José Carlos', 'Marília', 'Mariano', '', '', '', '', ''],
    ['15', 'Letícia', 'Roberto', '', '', '', '', '', ''],
    ['16', 'Leonardo', 'Valquíria', '', '', '', '', '', ''],
    ['17', 'Raimunda', 'André', 'Valéria', '', '', '', '', ''],
    ['18', 'Vania', 'Alice', 'Aliciana', 'Artur', '', '', '', ''],
    ['19', 'Rosangela', 'Ricardo', 'Marcelo', '', '', '', '', ''],
    ['20', 'Fabio', 'Josie', '', '', '', '', '', '']
];

// =======================
// Exporta a variável para módulos ES
// =======================
export { moradores };

// =======================
// Função para gerar a tabela de moradores (em moradores.html)
// =======================
function gerarTabela() {
    const tbody = document.querySelector('#tabelaMoradores tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    window.moradores.forEach(linha => {
        const tr = document.createElement('tr');
        linha.forEach(celula => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.value = celula;
            input.className = 'form-control';
            td.appendChild(input);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// =======================
// Função para salvar alterações feitas na tabela
// =======================
function salvarAlteracoes() {
    const tbody = document.querySelector('#tabelaMoradores tbody');
    if (!tbody) return;

    const novasLinhas = [];
    Array.from(tbody.rows).forEach(tr => {
        const valores = Array.from(tr.cells).map(td => td.querySelector('input').value.trim());
        novasLinhas.push(valores);
    });

    // Atualiza o array global de moradores
    for (let i = 0; i < window.moradores.length; i++) {
        window.moradores[i] = novasLinhas[i];
    }

    exibirMensagem('✅ Alterações salvas com sucesso!', 'success');
}

// =======================
// Função para exibir mensagens
// =======================
function exibirMensagem(texto, tipo) {
    const mensagemEl = document.getElementById('mensagem');
    if (!mensagemEl) return;

    mensagemEl.innerText = texto;
    mensagemEl.classList.remove('text-success', 'text-danger');

    if (tipo === 'success') mensagemEl.classList.add('text-success');
    else if (tipo === 'error') mensagemEl.classList.add('text-danger');
}

// =======================
// Eventos
// =======================
document.getElementById('salvarMoradores')?.addEventListener('click', salvarAlteracoes);

// =======================
// Inicializa tabela ao carregar a página
// =======================
window.addEventListener('DOMContentLoaded', gerarTabela);
