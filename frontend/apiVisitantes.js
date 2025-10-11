// =======================
// apiVisitantes.js - Arquivo 3 revisado
// =======================
const BASE_URL = "http://localhost:8080/api/visitantes";

// ---------- Salvar visitante ----------
export async function salvarVisitante(formData) {
    try {
        // Extrai o número da casa
        let numeroCasa = formData.morador;
        let idCasa = null;

        if (numeroCasa != null) {
            const strMorador = String(numeroCasa);
            if (strMorador.startsWith("C")) {
                // Corrigido: pega o número após o "C"
                idCasa = parseInt(strMorador.substring(1), 10);
            } else if (!isNaN(parseInt(strMorador))) {
                idCasa = parseInt(strMorador, 10);
            }
        }

        // Monta objeto visitante conforme backend
        const visitante = {
            nome: formData.nome || "",
            cpf: formData.cpf || "",
            contato: formData.contato || "",
            empresa: formData.condominio || "Particular",
            endereco: formData.endereco || "",
            dataVisita: formData.dataVisita || "",
            razaoVisita: formData.razao || "",
            nomeVisitado: formData.visitadoNome || "",
            telefoneVisitado: formData.telefoneVisitado || "",
            autorizador: formData.autorizador || "",
            morador: idCasa !== null ? { id: idCasa } : null,
            condominio: { id: 1 }
        };

        const response = await fetch(`${BASE_URL}/salvar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitante)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao salvar visitante: ${response.status} ${response.statusText} - ${text}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao salvar visitante:", error);
        throw error;
    }
}

// ---------- Listar visitantes ----------
export async function listarVisitantes() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Erro ao listar visitantes: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao listar visitantes:", error);
        throw error;
    }
}

// ---------- Editar visitante ----------
export async function editarVisitante(id, dados) {
    try {
        let numeroCasa = dados.morador;
        let idCasa = null;

        if (numeroCasa != null) {
            const strMorador = String(numeroCasa);
            if (strMorador.startsWith("C")) {
                // Corrigido: pega o número após o "C"
                idCasa = parseInt(strMorador.substring(1), 10);
            } else if (!isNaN(parseInt(strMorador))) {
                idCasa = parseInt(strMorador, 10);
            }
        }

        const visitante = {
            ...dados,
            morador: idCasa !== null ? { id: idCasa } : null,
            condominio: { id: 1 }
        };

        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(visitante)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Erro ao editar visitante: ${response.status} ${response.statusText} - ${text}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao editar visitante:", error);
        throw error;
    }
}

// ---------- Deletar visitante ----------
export async function deletarVisitante(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error(`Erro ao deletar visitante: ${response.status} ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error("Erro ao deletar visitante:", error);
        throw error;
    }
}





