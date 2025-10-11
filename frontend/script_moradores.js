// ================================
// script_moradores.js - versão funcional
// ================================

// =====================================================
// Lista de moradores por casa — Condomínio Residencial D’Ouro
// Cada morador tem nome e telefone
// =====================================================
window.moradores = [
    ["C1", {nome: "Antonio", telefone: "11990000001"}, {nome: "Aparecida", telefone: "11990000002"}],
    ["C2", {nome: "Carlos", telefone: "11990000003"}, {nome: "Viviane", telefone: "11990000004"}, {nome: "Milena", telefone: "11990000005"}, {nome: "Helena", telefone: "11990000006"}, {nome: "Isadora", telefone: "11990000007"}],
    ["C3", {nome: "Gerson", telefone: "11990000008"}, {nome: "Luciana", telefone: "11990000009"}, {nome: "Beatriz", telefone: "11990000010"}, {nome: "Gabrielle", telefone: "11990000011"}],
    ["C4", {nome: "João", telefone: "11990000012"}, {nome: "Tamisa", telefone: "11990000013"}, {nome: "João Jr.", telefone: "11990000014"}, {nome: "Victor", telefone: "11990000015"}, {nome: "Carol", telefone: "11990000016"}],
    ["C5", {nome: "Arthur", telefone: "11990000017"}, {nome: "Eliene", telefone: "11990000018"}],
    ["C6", {nome: "Orlando", telefone: "11990000019"}, {nome: "Joana", telefone: "11990000020"}, {nome: "Carlos", telefone: "11990000021"}, {nome: "Marcela", telefone: "11990000022"}],
    ["C7", {nome: "Leonardo", telefone: "11990000023"}, {nome: "Vania", telefone: "11990000024"}],
    ["C8", {nome: "Jessé", telefone: "11990000025"}, {nome: "Maria", telefone: "11990000026"}, {nome: "Leonardo", telefone: "11990000027"}],
    ["C9", {nome: "Maurici", telefone: "11990000028"}, {nome: "Noêmia", telefone: "11990000029"}, {nome: "Claudia", telefone: "11990000030"}],
    ["C10", {nome: "Manoel", telefone: "11990000031"}, {nome: "Antonia", telefone: "11990000032"}],
    ["C11", {nome: "Terezinha", telefone: "11990000033"}, {nome: "Silvana", telefone: "11990000034"}, {nome: "Luana", telefone: "11990000035"}, {nome: "Maria", telefone: "11990000036"}],
    ["C12", {nome: "Alvin", telefone: "11990000037"}, {nome: "Claudete", telefone: "11990000038"}, {nome: "Joana", telefone: "11990000039"}],
    ["C13", {nome: "Osmar", telefone: "11990000040"}, {nome: "Rodrigo", telefone: "11990000041"}, {nome: "João", telefone: "11990000042"}],
    ["C14", {nome: "José Carlos", telefone: "11990000043"}, {nome: "Marília", telefone: "11990000044"}, {nome: "Mariano", telefone: "11990000045"}],
    ["C15", {nome: "Letícia", telefone: "11990000046"}, {nome: "Roberto", telefone: "11990000047"}],
    ["C16", {nome: "Leonardo", telefone: "11990000048"}, {nome: "Valquíria", telefone: "11990000049"}],
    ["C17", {nome: "Raimunda", telefone: "11990000050"}, {nome: "André", telefone: "11990000051"}, {nome: "Valéria", telefone: "11990000052"}],
    ["C18", {nome: "Vania", telefone: "11990000053"}, {nome: "Alice", telefone: "11990000054"}, {nome: "Aliciana", telefone: "11990000055"}, {nome: "Artur", telefone: "11990000056"}],
    ["C19", {nome: "Rosangela", telefone: "11990000057"}, {nome: "Ricardo", telefone: "11990000058"}, {nome: "Marcelo", telefone: "11990000059"}],
    ["C20", {nome: "Fabio", telefone: "11990000060"}, {nome: "Josie", telefone: "11990000061"}]
];

// =====================================================
// Função auxiliar: obter telefone do morador pelo nome e número da casa
// =====================================================
window.obterTelefone = function(numeroCasa, nomeMorador) {
    const casa = window.moradores.find(c => c[0] === numeroCasa);
    if (!casa) return "";
    const morador = casa.slice(1).find(m => m.nome === nomeMorador);
    return morador ? morador.telefone : "";
};

// =====================================================
// Função para popular o dropdown de moradores de acordo com a casa
// =====================================================
window.popularMoradores = function(numeroCasa, selectElement) {
    if (!selectElement) return;

    // Limpa opções existentes
    selectElement.innerHTML = "";

    if (!numeroCasa) return;

    const casa = window.moradores.find(c => c[0] === numeroCasa);
    if (!casa) return;

    // Adiciona opção padrão
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Selecione o morador --";
    selectElement.appendChild(defaultOption);

    // Adiciona os moradores da casa
    casa.slice(1).forEach(morador => {
        const option = document.createElement("option");
        option.value = morador.nome;
        option.text = morador.nome;
        selectElement.appendChild(option);
    });
};

// =====================================================
// Log de diagnóstico
// =====================================================
console.log("✅ Lista de moradores carregada:", window.moradores);




