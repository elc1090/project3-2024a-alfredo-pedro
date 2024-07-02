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


function toggleDropdown(id) {
    for (const dropdown of document.querySelectorAll('.dropdown-content')) {
        if (dropdown.id !== id) {
            dropdown.style.display = "none";
        }
    }
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const selectedOptionId = this.getAttribute('data-target');
        const selectedOption = document.getElementById(selectedOptionId);
        selectedOption.textContent = this.value;
        toggleDropdown(this.closest('.dropdown-content').id);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    getUserInfo();

    // Prevent form submission on dropdown button click
    var dropdownButtons = document.querySelectorAll(".dropdown-button");
    dropdownButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.preventDefault();
        });
    });

    document.getElementById('resumeForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        submitResume();
    });
});

async function getUserInfo() {
    const userID = localStorage.getItem('userID');
    if (!userID) {
        console.error('User ID not found in local storage.');
        return;
    }

    try {
        const resumeRef = firestore.collection('users').doc(userID).collection('resume').doc('main');
        const resumeDoc = await resumeRef.get();

        if (resumeDoc.exists) {
            const resumeData = resumeDoc.data();
            document.getElementById('name').value = resumeData.name || '';
            document.getElementById('phone').value = resumeData.phone || '';
            document.getElementById('location').value = resumeData.location || '';
            document.getElementById('birthdate').value = resumeData.birthdate || '';
            document.getElementById('description').value = resumeData.description || '';

            const genderRadios = document.querySelectorAll('input[name="gender"]');
            const areaRadios = document.querySelectorAll('input[name="area"]');
            const formationRadios = document.querySelectorAll('input[name="formacao"]');

            let gender = resumeData.gender;
            genderRadios.forEach(radio => {
                if (radio.value == gender) {
                    radio.checked = true;
                    document.getElementById(radio.getAttribute('data-target')).textContent = gender;
                }
            });

            let area = resumeData.area;
            areaRadios.forEach(radio => {
                if (radio.value == area) {
                    radio.checked = true;
                    document.getElementById(radio.getAttribute('data-target')).textContent = area;
                }
            });

            let formation = resumeData.formation;
            formationRadios.forEach(radio => {
                if (radio.value == formation) {
                    radio.checked = true;
                    document.getElementById(radio.getAttribute('data-target')).textContent = formation;
                }
            });
        } else {
            console.log('No resume data found for this user.');
        }
    } catch (error) {
        console.error('Error fetching resume data: ', error);
    }
}


async function submitResume() {
    const userID = localStorage.getItem('userID');
    if (!userID) {
        console.error('User ID not found in local storage.');
        return;
    }

    const userRef = firestore.collection('users').doc(userID);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        console.error('User not found.');
        return;
    }

    const email = userDoc.data().email;

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const birthdate = document.getElementById('birthdate').value;
    const description = document.getElementById('description').value;
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const areaRadios = document.querySelectorAll('input[name="area"]');
    const formationRadios = document.querySelectorAll('input[name="formacao"]');

    let gender = "";
    genderRadios.forEach(radio => {
        if (radio.checked) {
            gender = radio.value;
        }
    });

    if (!gender) {
        alert('Please select a gender.');
        return;
    }

    let area = "";
    areaRadios.forEach(radio => {
        if (radio.checked) {
            area = radio.value;
        }
    });

    if (!area) {
        alert('Please select an area.');
        return;
    }

    let formation = "";
    formationRadios.forEach(radio => {
        if (radio.checked) {
            formation = radio.value;
        }
    });

    if (!formation) {
        alert('Please select a formation.');
        return;
    }

    try {
        const resumeRef = firestore.collection("users").doc(userID).collection("resume").doc("main");
        await resumeRef.set({
            name: name,
            email: email,
            phone: phone,
            location: location,
            birthdate: birthdate,
            gender: gender,
            area: area,
            formation: formation,
            description: description
        }, { merge: true });

        window.location.href = "index.html";
        localStorage.clear();
    } catch (error) {
        console.error('Error saving resume: ', error);
        alert('Error saving resume.');
    }
}