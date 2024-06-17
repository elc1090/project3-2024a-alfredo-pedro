
const config = {
    apiKey: "AIzaSyCmFJM6xicl2D01jHmFXMQI_NisNJbnXqY",
    authDomain: "resume-back-eefe0.firebaseapp.com",
    databaseURL: "https://resume-back-eefe0-default-rtdb.firebaseio.com",
    projectId: "resume-back-eefe0",
    storageBucket: "resume-back-eefe0.appspot.com",
    messagingSenderId: "717870089790",
    appId: "1:717870089790:web:44615d3f3c01222d51336f"
  };


/*
//exemplo de como adicionar um item a coleção. 
!!!!!
Cuidado, toda vez que esse trecho for executado um novo item será adicionado a coleção
!!!!!

firestore.collection("resumes").add({
    "name": "Carlos Ferreira",
    "email": "carlos.ferreira@example.com",
    "phone": "(51) 91234-5678",
    "location": "Porto Alegre",
    "age": 30,
    "gender": "Masculino",
    "area": "Engenharia e Reconstrução",
    "formation": "Ensino Superior Completo",
    "description": "Engenheiro civil com foco em reconstrução após desastres."
});
*/



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


async function submitResume() 
{
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const age = document.getElementById('age').value;
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

    firebase.initializeApp(config)
    const firestore = firebase.firestore() 
    _ = await firestore.collection("resumes").add({
        "name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "age": age,
        "gender": gender,
        "area": area,
        "formation": formation,
        "description": description
    });

    

    window.location.href = "index.html";
}