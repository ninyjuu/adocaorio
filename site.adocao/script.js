/* script.js - VERSÃO PROFISSIONAL (COM BANCO DE DADOS) */

// --- 1. CONFIGURAÇÃO (COLE O CÓDIGO DO FIREBASE AQUI) ---
// Apague as linhas abaixo e cole o "const firebaseConfig" que você copiou do site
const firebaseConfig = {
    apiKey: "AIzaSyC9...", // <--- COLE O SEU CÓDIGO REAL AQUI
    authDomain: "adocaorio-82af5.firebaseapp.com",
    databaseURL: "https://adocaorio-82af5-default-rtdb.firebaseio.com",
    projectId: "adocaorio-82af5",
    storageBucket: "adocaorio-82af5.firebasestorage.app",
    messagingSenderId: "864782125200",
    appId: "1:864782125200:web:2f9761bb892619bfd23015",
    measurementId: "G-9GLK113BQ7"
};


// --- 2. INICIALIZAÇÃO (NÃO MEXA) ---
// Verifica se o Firebase foi carregado antes de tentar usar
if (typeof firebase === 'undefined') {
    console.error("Erro: Firebase não foi carregado. Verifique se colocou os scripts no HTML.");
} else {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();


// --- 3. FUNÇÕES DO SISTEMA ---

// Função Buscar Animais (Lê do Google e manda pro site)
function buscarAnimais(callback) {
    const animaisRef = database.ref('animais');
    animaisRef.on('value', (snapshot) => {
        const data = snapshot.val();
        // Transforma os dados do Google em uma lista
        let lista = data ? Object.keys(data).map(key => data[key]) : [];
        // Inverte para os últimos cadastrados aparecerem primeiro
        callback(lista.reverse());
    });
}

// Função Salvar Animal (Envia do Admin pro Google)
function salvarAnimal(animal) {
    database.ref('animais/' + animal.id).set(animal, (error) => {
        if (error) {
            alert('Erro ao salvar: ' + error);
        } else {
            alert('Sucesso! O animal já está no ar para todo mundo ver.');
            // Se a função de recarregar a tabela existir, chama ela
            if(typeof carregarListaAdmin === 'function') {
                carregarListaAdmin();
                resetarFormulario();
            }
        }
    });
}

// Função Deletar (Apaga do Google)
function deletarAnimal(id) {
    if (confirm("Tem certeza? Isso vai apagar o animal do site oficial.")) {
        database.ref('animais/' + id).remove()
            .then(() => alert("Animal excluído com sucesso!"))
            .catch((error) => alert("Erro ao excluir: " + error));
    }
}

// Função Ler Foto (Converte imagem pra texto pra salvar no banco)
function lerArquivo(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Utilitários (Idade e URL)
function calcularIdade(dataNasc) {
    if(!dataNasc) return "Não informada";
    const birth = new Date(dataNasc);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) { years--; months += 12; }
    if (now.getDate() < birth.getDate()) { months--; }
    if (years > 0) return years + (years === 1 ? " ano" : " anos");
    return months + (months === 1 ? " mês" : " meses");
}

function pegarParametroUrl(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}