const apiPath = "https://resume-back-zwhd.onrender.com/api";

// Seleciona o container da grade de cards
const cardGrid = document.getElementById('card-grid');
let curriculos = []


async function fetchResumes() {

    const spinnerDiv = document.getElementById('spinner');

    fetch(`${apiPath}/get-public-resume`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            curriculos = data;
            cardGrid.innerHTML = '';
            spinnerDiv.innerHTML = '';
            data.forEach(curriculo => {
                const card = criarCard(curriculo);
                cardGrid.appendChild(card);
            });
        })
        .catch((error) => {
            console.error('Erro ao buscar currículos', error);
        });
}


// Função para criar um card
function criarCard(curriculo) {
    const card = document.createElement('div');
    card.className = 'card';

    const age = calcularIdade(curriculo.birthdate);

    const nameAge = document.createElement('h2');
    nameAge.textContent = `${curriculo.name}, ${age}`;

    const area = document.createElement('h2');
    area.textContent = `Área de Atuação: ${curriculo.area}`;

    const gender = document.createElement('p');
    gender.textContent = `Gênero: ${curriculo.gender}`;

    const formacao = document.createElement('p');
    formacao.textContent = `Formação: ${curriculo.formation}`;

    const localizacao = document.createElement('p');
    localizacao.textContent = `Localização: ${curriculo.location}`;

    const descricao = document.createElement('p');
    descricao.textContent = `Descrição: ${curriculo.description}`;

    const email = document.createElement('p');
    email.textContent = `Email: ${curriculo.email}`;

    const phone = document.createElement('p');
    phone.textContent = `Telefone: ${curriculo.phone}`;

    const botao = document.createElement('button');
    botao.textContent = 'Entrar em contato';

    card.appendChild(nameAge);
    card.appendChild(area);
    card.appendChild(gender);
    card.appendChild(formacao);
    card.appendChild(descricao);
    card.appendChild(localizacao);
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(botao);

    return card;
}

function calcularIdade(birthdate) {
    const hoje = new Date();
    const dataNascimento = new Date(birthdate);
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    return idade;
}


function aplicarFiltros() {
    const idadeMin = document.getElementById('idade-min').value;
    const idadeMax = document.getElementById('idade-max').value;
    const generoFiltro = document.getElementById('genero').value;
    const localizacaoFiltro = document.getElementById('localizacao').value;
    const areaFiltro = document.getElementById('area').value;
    const formacaoFiltro = document.getElementById('formacao').value;

    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = '';

    const curriculosFiltrados = curriculos.filter(curriculo => {

        let age = calcularIdade(curriculo.birthdate);

        return (
            (!idadeMin || age >= idadeMin) &&
            (!idadeMax || age <= idadeMax) &&
            (!generoFiltro || curriculo.gender == generoFiltro) &&
            (!localizacaoFiltro || curriculo.location.toLowerCase().includes(localizacaoFiltro.toLowerCase())) &&
            (!areaFiltro || curriculo.area == areaFiltro) &&
            (!formacaoFiltro || curriculo.formation == formacaoFiltro)
        );
    });

    if (curriculosFiltrados.length === 0) {
        const noResultsDiv = document.getElementById('no-results');
        noResultsDiv.innerHTML = '';
        const nenhumResultado = document.createElement('h2');
        nenhumResultado.textContent = 'Nenhum resultado encontrado';
        noResultsDiv.appendChild(nenhumResultado);
    }

    curriculosFiltrados.forEach(curriculo => {
        const card = criarCard(curriculo);
        cardGrid.appendChild(card);
    });
}

function limparFiltros() {
    document.getElementById('idade-min').value = '';
    document.getElementById('idade-max').value = '';
    document.getElementById('genero').value = '';
    document.getElementById('localizacao').value = '';
    document.getElementById('area').value = '';
    document.getElementById('formacao').value = '';

    const noResultsDiv = document.getElementById('no-results');
    noResultsDiv.innerHTML = '';

    // Aplicar os filtros novamente para mostrar todos os currículos
    aplicarFiltros();
}

document.getElementById('filtrar').addEventListener('click', aplicarFiltros);
document.getElementById('limpar').addEventListener('click', limparFiltros);

// Carregar todos os currículos inicialmente
fetchResumes();