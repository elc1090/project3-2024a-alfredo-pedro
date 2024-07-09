const apiPath = "https://resume-back-zwhd.onrender.com/api";

document.addEventListener("DOMContentLoaded", function() {
    getUserInfo();

    document.getElementById('edit-resume').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'resume.html';
    });

    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();
        logout();
    });

});


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function getUserInfo() {
    const accessToken = getCookie('access_token');
    if (!accessToken) {
        console.error('No access token found');
        return;
    } else {
        console.log(accessToken);
    }

    let resumeData = {};

    try {
        const response = await fetch(`${apiPath}/get-user-resume`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            // Lidar com erros de resposta
            if (response.status === 403) {
                console.error('Access denied. Invalid or expired token.');
            } else {
                console.error('Error fetching user info:', response.statusText);
            }
            return;
        }

        const data = await response.json();
        if (data.error) {
            console.log('No resume found for this user');
        } else {
            resumeData = data;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return;
    }

    if (resumeData) {
        const name = resumeData.name;
        const email = resumeData.email;
        const phone = resumeData.phone;
        const location = resumeData.location;
        const birthdate = resumeData.birthdate;
        const gender = resumeData.gender;
        const area = resumeData.area;
        const formation = resumeData.formation;
        const description = resumeData.description;

        let age = calcularIdade(birthdate);
        let firstName = name.split(' ')[0];
        document.getElementById('user-name').textContent = "Bem-vindo, " + firstName + "!";

        document.getElementById('name').textContent = name;
        document.getElementById('age').textContent = age;
        document.getElementById('description').textContent = description;
        document.getElementById('location').textContent = location;
        document.getElementById('birthdate').textContent = birthdate;
        document.getElementById('phone').textContent = phone;
        document.getElementById('email').textContent = email;
        document.getElementById('gender').textContent = gender;
        document.getElementById('area').textContent = area;
        document.getElementById('formation').textContent = formation;
    } else {
        document.getElementById('resume-title').textContent = "Você ainda não possui um currículo cadastrado."
        document.getElementById('edit-resume').textContent = "Criar currículo"
        let cardDiv = document.getElementById('resume-card');
        cardDiv.innerHTML = "";
    }
}

async function logout() {
    try {
        const response = await fetch(`${apiPath}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.error('Error logging out:', response.statusText);
            return;
        }

        const data = await response.json();
        if (data.error) {
            console.error('Error logging out:', data.error);
        } else {
            console.log('User logged out');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
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