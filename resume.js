const apiPath = "https://resume-back-zwhd.onrender.com/api";

function toggleDropdown(id) {
    for (const dropdown of document.querySelectorAll('.dropdown-content')) {
        if (dropdown.id !== id) {
            dropdown.style.display = "none";
        }
    }
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}


// document.querySelectorAll('input[type="radio"]').forEach(radio => {
//     radio.addEventListener('change', function() {
//         const selectedOptionId = this.getAttribute('data-target');
//         const selectedOption = document.getElementById(selectedOptionId);
//         selectedOption.textContent = this.value;
//         toggleDropdown(this.closest('.dropdown-content').id);
//     });
// });

document.querySelectorAll('.dropdown-option').forEach(option => {
    option.addEventListener('click', function() {
        const selectedOptionId = this.getAttribute('data-target');
        const selectedOption = document.getElementById(selectedOptionId);
        selectedOption.textContent = this.getAttribute('data-value');
        const dropdownContent = this.closest('.dropdown-content');
        dropdownContent.style.display = 'none';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const spinnerDiv = document.getElementById('spinner');
    const contentDiv = document.getElementById('form-container');

    contentDiv.hidden = true;
    getUserInfo();
    contentDiv.hidden = false;
    spinnerDiv.innerHTML = '';

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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


async function getUserInfo() {

    let resumeData = {};
    const accessToken = getCookie('access_token');
    if (!accessToken) {
        console.error('No access token found');
        return;
    }

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
            console.error('No resume found for this user');
            return;
        } else {
            resumeData = data;
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
        return;
    }

    console.log(resumeData);

    document.getElementById('name').value = resumeData.name || '';
    document.getElementById('email').value = resumeData.email || '';
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
}


async function submitResume() {

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
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

    fetch(`${apiPath}/update-resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                location: location,
                birthdate: birthdate,
                gender: gender,
                area: area,
                formation: formation,
                description: description
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error submitting resume: ', data.error);
                console.log('Error submitting resume. Please try again.');
            } else {
                console.log('Resume submitted successfully.');
                window.location.href = 'user_page.html';
            }
        })
        .catch((error) => {
            console.error('Error submitting resume: ', error);
            console.log('Error submitting resume. Please try again.');
        });

}