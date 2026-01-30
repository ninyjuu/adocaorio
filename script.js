/* script.js - Funções Globais */

// Salvar (usado apenas se for novo, o admin.html trata a edição internamente agora)
function salvarAnimal(animal) {
    let animais = JSON.parse(localStorage.getItem('animaisAdocao')) || [];
    animais.push(animal);
    localStorage.setItem('animaisAdocao', JSON.stringify(animais));
    alert('Sucesso! Animal salvo.');
}

// Carregar lista
function carregarAnimais() {
    return JSON.parse(localStorage.getItem('animaisAdocao')) || [];
}

// Excluir Animal
function deletarAnimal(id) {
    if (confirm("Tem certeza que deseja excluir este animal?")) {
        let animais = carregarAnimais();
        let novaLista = animais.filter(animal => animal.id != id);
        localStorage.setItem('animaisAdocao', JSON.stringify(novaLista));
        
        // Se estiver no admin, recarrega a lista
        if (typeof carregarListaAdmin === "function") {
            carregarListaAdmin();
            // Se estava editando esse bicho, cancela a edição
            const idEditando = document.getElementById('edit-id').value;
            if(idEditando == id) { cancelarEdicao(); }
        } else {
            // Se estiver em outra página, recarrega
            location.reload();
        }
    }
}

// Utilitários
function pegarParametroUrl(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

function calcularIdade(dataNasc) {
    if(!dataNasc) return "Não informada";
    const birth = new Date(dataNasc);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
        years--;
        months += 12;
    }
    if (now.getDate() < birth.getDate()) { months--; }
    
    if (years > 0) return years + (years === 1 ? " ano" : " anos");
    if (months === 0) return "Recém-nascido";
    return months + (months === 1 ? " mês" : " meses");
}