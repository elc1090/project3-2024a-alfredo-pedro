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

function submitResume() {
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

    const resumeData = {
        name: name,
        email: email,
        phone: phone,
        location: location,
        age: age,
        gender: gender,
        area: area,
        formation: formation,
        description: description
    };

    const jsonData = JSON.stringify(resumeData, null, 2);
    alert("Generated JSON:\n" + jsonData);
    console.log(jsonData);
    // You can send resumeData to the server using fetch or XMLHttpRequest
}