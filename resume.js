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
    spinnerDiv.hidden = false;
    getUserInfo();
    contentDiv.hidden = false;
    spinnerDiv.hidden = true;

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

    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function(event) {
        let input = event.target.value;

        // Remove all non-numeric characters
        input = input.replace(/\D/g, '');

        // Add parentheses and hyphen based on input length
        if (input.length > 2) {
            input = `(${input.slice(0, 2)}) ${input.slice(2, 7)}` + (input.length > 6 ? `${input.slice(7, 11)}` : '');
        }

        // Set the formatted value back to the input field
        event.target.value = input;
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
    document.getElementById('selected-gender').textContent = resumeData.gender || '';
    document.getElementById('selected-area').textContent = resumeData.area || '';
    document.getElementById('selected-formacao').textContent = resumeData.formation || '';
    document.getElementById('flexSwitchCheckDefault').checked = resumeData.public || false;
}


async function submitResume() {

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const birthdate = document.getElementById('birthdate').value;
    const description = document.getElementById('description').value;
    const visibility = document.getElementById('flexSwitchCheckDefault').checked;

    const gender = document.getElementById('selected-gender').textContent.trim();
    if (!gender) {
        alert('Please select a gender.');
        return;
    }

    const area = document.getElementById('selected-area').textContent.trim();
    if (!area) {
        alert('Please select an area.');
        return;
    }

    const formation = document.getElementById('selected-formacao').textContent.trim();
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
                description: description,
                public: visibility
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