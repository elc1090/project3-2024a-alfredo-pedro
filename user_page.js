import { jsPDF } from 'jspdf';
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

    document.getElementById('generate-pdf').addEventListener('click', function(event) {
        event.preventDefault();
        const html = document.getElementById('resume-card').innerHTML;
        generatePDF(html);
    });

});

function generatePDF(html)
{
    var pdf = new jsPDF('p', 'pt', 'letter');
    source = html;
    specialElementHandlers = {
        '#bypassme': function(element, renderer){
            return true
        }
    };
    margins = {
        top: 50,
        left: 60,
        width: 545
    };
    pdf.fromHTML(
        source,
        margins.left,
        margins.top,
        {
            'width': margins.width,
            'elementHandlers': specialElementHandlers
        },
        function (dispose) {
            pdf.save('Currículo.pdf');
        },
        margins
    );

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function getUserInfo() {

    const contentDiv = document.getElementById('usr-page-content');
    const spinnerDiv = document.getElementById('spinner');

    contentDiv.hidden = true;
    spinnerDiv.hidden = false;


    const accessToken = getCookie('access_token');
    if (!accessToken) {
        console.error('No access token found');
        return;
    }

    let resumeData = {};
    let fetched = false;

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
                console.log('Access denied. Invalid or expired token.');
            } else {
                console.log('Error fetching user info:', response.statusText);
            }
        }

        const data = await response.json();
        if (data.error) {
            console.log('No resume found for this user');
        } else {
            resumeData = data;
            fetched = true;
        }
    } catch (error) {
        console.log('Error fetching user info:', error);
    }

    if (fetched) {
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
        cardDiv.removeAttribute('class');
    }

    contentDiv.hidden = false;
    spinnerDiv.hidden = true;
}

async function logout() {
    const accessToken = getCookie('access_token');

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