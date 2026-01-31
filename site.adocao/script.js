// CONFIGURAÇÃO DO FIREBASE (Mantenha seus dados reais aqui)
const firebaseConfig = {
    apiKey: "SUA_API_KEY", 
    authDomain: "adocaorio-82af5.firebaseapp.js",
    databaseURL: "https://adocaorio-82af5-default-rtdb.firebaseio.com",
    projectId: "adocaorio-82af5",
    storageBucket: "adocaorio-82af5.firebasestorage.app",
    messagingSenderId: "864782125200",
    appId: "1:864782125200:web:2f9761bb892619bfd23015"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// FUNÇÃO DE IDADE CORRIGIDA
function calcularIdade(dataNasc) {
    if (!dataNasc) return "Não informada";
    const birth = new Date(dataNasc);
    const now = new Date();
    
    let anos = now.getFullYear() - birth.getFullYear();
    let meses = now.getMonth() - birth.getMonth();
    
    if (meses < 0 || (meses === 0 && now.getDate() < birth.getDate())) {
        anos--;
        meses += 12;
    }

    // Lógica para filhotes (menos de 1 ano)
    if (anos === 0) {
        if (meses === 0) return "Recém-nascido";
        if (meses >= 6) return "6 meses e meio";
        return meses === 1 ? "1 mês" : `${meses} meses`;
    }

    // Lógica de "e meio" (mais de 1 ano)
    let textoAnos = anos === 1 ? "ano" : "anos";
    if (meses >= 6) {
        return `${anos} ${textoAnos} e meio`;
    }
    
    return `${anos} ${textoAnos}`;
}

// BUSCA NO BANCO
function buscarAnimais(callback) {
    const animaisRef = database.ref('animais');
    animaisRef.on('value', (snapshot) => {
        const data = snapshot.val();
        let lista = data ? Object.keys(data).map(key => ({ ...data[key], idFirebase: key })) : [];
        callback(lista.reverse());
    });
}

function salvarAnimalNoBanco(animal) {
    const id = animal.idFirebase || Date.now();
    return database.ref('animais/' + id).set(animal)
        .then(() => alert('Sucesso!'))
        .catch(error => alert('Erro: ' + error));
}

function deletarAnimalDoBanco(idFirebase) {
    if (confirm("Excluir?")) {
        database.ref('animais/' + idFirebase).remove();
    }
}

function lerArquivo(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
    });
}

function pegarParametroUrl(nome) {
    return new URLSearchParams(window.location.search).get(nome);
}