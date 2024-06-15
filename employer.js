const curriculos = [{
        "name": "João",
        "email": "joao@example.com",
        "phone": "(11) 98765-4321",
        "age": 30,
        "gender": "Masculino",
        "area": "Desenvolvimento Web",
        "formation": "Ciência da Computação",
        "description": "Desenvolvedor full stack com 10 anos de experiência."
    },
    {
        "name": "Maria",
        "email": "maria@example.com",
        "phone": "(21) 91234-5678",
        "age": 28,
        "gender": "Feminino",
        "area": "Design Gráfico",
        "formation": "Design",
        "description": "Designer com foco em interfaces de usuário e experiência do usuário."
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },
    {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "age": "age",
        "gender": "gender",
        "area": "area",
        "formation": "formation",
        "description": "description"
    },

];

// Função para criar um card
function criarCard(curriculo) {
    const card = document.createElement('div');
    card.className = 'card';

    const nameAge = document.createElement('h2');
    nameAge.textContent = `${curriculo.name}, ${curriculo.age}`;

    const area = document.createElement('h2');
    area.textContent = `Área de Atuação: ${curriculo.area}`;

    const gender = document.createElement('p');
    gender.textContent = `Gênero: ${curriculo.gender}`;

    const formacao = document.createElement('p');
    formacao.textContent = `Formação: ${curriculo.formation}`;

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
    card.appendChild(email);
    card.appendChild(phone);
    card.appendChild(botao);

    return card;
}

// Seleciona o container da grade de cards
const cardGrid = document.getElementById('card-grid');

// Para cada currículo no JSON, cria e adiciona um card na grade
curriculos.forEach(curriculo => {
    const card = criarCard(curriculo);
    cardGrid.appendChild(card);
});