//Yet to fix
const sameContactCheckbox = document.getElementById('same-contact-checkbox');
function syncContactInfo() {
    if (sameContactCheckbox.checked) {
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const emailInput = document.getElementById('email');
    const phoneNumberInput = document.getElementById('phone-number');

    const firstNameValue = firstNameInput.value;
    const lastNameValue = lastNameInput.value;
    const emailValue = emailInput.value;
    const phoneNumberValue = phoneNumberInput.value;

    // Insert the values into the other textboxes of the same classes
    document.querySelectorAll('.first-name input').forEach((input) => {
    input.value = firstNameValue;
    });
    document.querySelectorAll('.last-name input').forEach((input) => {
    input.value = lastNameInput.value;
    });
    document.querySelectorAll('.email input').forEach((input) => {
    input.value = emailValue;
    });
    document.querySelectorAll('.phone-number input').forEach((input) => {
    input.value = phoneNumberValue;
    });
}
}