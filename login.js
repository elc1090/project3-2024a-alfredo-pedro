const config = {
    apiKey: "AIzaSyCmFJM6xicl2D01jHmFXMQI_NisNJbnXqY",
    authDomain: "resume-back-eefe0.firebaseapp.com",
    databaseURL: "https://resume-back-eefe0-default-rtdb.firebaseio.com",
    projectId: "resume-back-eefe0",
    storageBucket: "resume-back-eefe0.appspot.com",
    messagingSenderId: "717870089790",
    appId: "1:717870089790:web:44615d3f3c01222d51336f"
};

firebase.initializeApp(config);
const firestore = firebase.firestore();

document.addEventListener("DOMContentLoaded", function() {
    localStorage.clear();
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        login();
    });

    document.getElementById('new-account-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        console.log('createAccount');
        createAccount();
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

    // Check if email and password are correct
    const usersRef = firestore.collection('users');
    const q = usersRef.where('email', '==', email).where('password', '==', password);
    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
        // Valid email and password
        querySnapshot.forEach((doc) => {
            // Save user ID to local storage
            localStorage.setItem('userID', doc.id);
        });

        // Redirect to resume creation page
        window.location.href = 'resume.html';
    } else {
        // Invalid email or password
        showAlert('Invalid email or password. Please try again.', 'danger');
    }
}

async function createAccount() {

    const email = document.getElementById('new-account-email').value;
    const password = document.getElementById('new-account-password').value;

    // Check if email already exists
    const usersRef = firestore.collection('users');
    const q = usersRef.where('email', '==', email);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        // Email does not exist, proceed with adding the user
        try {
            const docRef = await usersRef.add({
                email: email,
                password: password // Note: In a real application, ensure you hash passwords before storing them.
            });

            // Save user ID to local storage
            localStorage.setItem('userID', docRef.id);

            // Redirect to resume creation page
            window.location.href = 'resume.html';
        } catch (error) {
            console.error('Error adding user: ', error);
            showAlert('Error registering user.', 'danger');
        }
    } else {
        // Email already exists
        showAlert('Email already in use. Please use a different email.', 'danger');
    }
}