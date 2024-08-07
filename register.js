const apiPath = "https://resume-back-zwhd.onrender.com/api";

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('new-account-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        createAccount();
    });
});

function showAlert(message, type) {
    const alertDiv = document.getElementById('login-alert');
    alertDiv.textContent = message;
    alertDiv.className = `alert alert-${type}`;
    alertDiv.classList.remove('d-none');
}

async function createAccount() {

    const email = document.getElementById('new-account-email').value;
    const password = document.getElementById('new-account-password').value;

    fetch(`${apiPath}/register`, {
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
                showAlert(data.error, 'danger');
            } else {
                window.location.href = 'login.html';
            }
        })
        .catch((error) => {
            console.error('Error creating account: ', error);
            showAlert('Error creating account.', 'danger');
        });
    
}