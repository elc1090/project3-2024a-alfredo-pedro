function toggleDropdown(id) {
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
});