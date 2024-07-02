const config = {
    apiKey: "AIzaSyCmFJM6xicl2D01jHmFXMQI_NisNJbnXqY",
    authDomain: "resume-back-eefe0.firebaseapp.com",
    databaseURL: "https://resume-back-eefe0-default-rtdb.firebaseio.com",
    projectId: "resume-back-eefe0",
    storageBucket: "resume-back-eefe0.appspot.com",
    messagingSenderId: "717870089790",
    appId: "1:717870089790:web:44615d3f3c01222d51336f"
};

firebase.initializeApp(config)
const firestore = firebase.firestore()

// Seleciona o container da grade de cards
const cardGrid = document.getElementById('card-grid');
let curriculos = []


async function fetchResumes() {
    const usersRef = firestore.collection("users");
    cardGrid.innerHTML = '';

    try {
        const querySnapshot = await usersRef.get();
        const curriculos = []; // Array to hold all resumes

        // Iterate through each user document
        for (const userDoc of querySnapshot.docs) {
            const resumesRef = usersRef.doc(userDoc.id).collection("resume");

            const resumeSnapshot = await resumesRef.get();

            resumeSnapshot.forEach((resumeDoc) => {
                curriculos.push(resumeDoc.data());
            });
        }

        // Display curriculos in your UI
        curriculos.forEach(curriculo => {
            const card = criarCard(curriculo);
            cardGrid.appendChild(card);
        });

        console.log(curriculos); // Log the final array of resumes

        // Return or use curriculos as needed
        return curriculos;
    } catch (error) {
        console.error('Error fetching or processing resumes:', error);
        return []; // Return empty array or handle error as needed
    }
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
        return (
            (!idadeMin || curriculo.age >= idadeMin) &&
            (!idadeMax || curriculo.age <= idadeMax) &&
            (!generoFiltro || curriculo.gender == generoFiltro) &&
            (!localizacaoFiltro || curriculo.location.toLowerCase().includes(localizacaoFiltro.toLowerCase())) &&
            (!areaFiltro || curriculo.area == areaFiltro) &&
            (!formacaoFiltro || curriculo.formation == formacaoFiltro)
        );
    });

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

    // Aplicar os filtros novamente para mostrar todos os currículos
    aplicarFiltros();
}

document.getElementById('filtrar').addEventListener('click', aplicarFiltros);
document.getElementById('limpar').addEventListener('click', limparFiltros);

// Carregar todos os currículos inicialmente
fetchResumes();