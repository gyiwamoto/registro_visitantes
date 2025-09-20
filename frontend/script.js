document.getElementById('visitanteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const visitante = {
        cpf: document.getElementById('cpf').value,
        celular: document.getElementById('celular').value,
        endereco: document.getElementById('endereco').value,
        data_visita: document.getElementById('data_visita').value,
        visitado: document.getElementById('visitado').value
    };

    await fetch('http://localhost:3001/api/visitantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitante)
    });

    carregarVisitantes();
});

async function carregarVisitantes() {
    const res = await fetch('http://localhost:3001/api/visitantes');
    const visitantes = await res.json();
    const lista = document.getElementById('visitantesList');
    lista.innerHTML = '';
    visitantes.forEach(v => {
        const li = document.createElement('li');
        li.textContent = `${v.cpf} - ${v.visitado} (${v.data_visita})`;
        lista.appendChild(li);
    });
}

carregarVisitantes();
