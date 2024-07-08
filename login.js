const apiPath = "https://resume-back-zwhd.onrender.com/api";

function IsAcessTokenValid() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return false;
    }

    console.log(accessToken);

    const decodedToken = jwt_decode(accessToken);
    return decodedToken.exp > Date.now() / 1000;
}

document.addEventListener("DOMContentLoaded", function() {

    var registerButton = document.getElementById('register-bt');
    registerButton.addEventListener("click", function(event) {
        event.preventDefault();
    });


    // if (IsAcessTokenValid()) {
    //     window.location.href = 'resume.html';
    //     return;
    // }

    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        login();
    });
});

function showAlert(message, type) {
    const alertDiv = document.getElementById('login-alert');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('d-none');
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${apiPath}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAlert("Usuário ou Senha incorretos", 'danger');
            } else {
                console.log(data);
                localStorage.setItem('accessToken', data.userCredential.user.stsTokenManager.accessToken);
                //window.location.href = 'resume.html';
            }
        })
        .catch((error) => {
            console.error('Error logging in: ', error);
            showAlert('Error logging in.', 'danger');
        });
}