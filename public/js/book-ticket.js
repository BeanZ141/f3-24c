const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function proceedToPayment() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dateOfAttendance = document.querySelector('input[name="dateOfAttendance"]:checked').value;
    const termsCheckbox = document.querySelector('input[type="checkbox"]');
    const termsLabel = document.querySelector('.container1');
    const termsLabelA = document.querySelector('.container1 a');
    const termsCheckmark = document.querySelector('.checkmark');

    if (!name || !email || !phone || !dateOfAttendance) {
        alert('Please fill out all fields.');
        return;
    }

    if (!termsCheckbox.checked) {
        termsLabel.style.color = 'red';
        termsLabelA.style.color = 'red';
        termsCheckmark.style.borderColor = 'red';
        console.log("Please accept the terms and conditions");
        termsCheckbox.addEventListener('change', function handleCheckboxChange() {
            if (termsCheckbox.checked) {
                termsLabel.style.color = '';
                termsLabelA.style.color = '';
                termsCheckmark.style.border = '1px solid var(--border)';
            }
            termsCheckbox.removeEventListener('change', handleCheckboxChange);
        });
        return;
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        showAlert('Please enter a valid email address.');
        return;
    }

    // Phone number validation
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        showAlert('Please enter a valid phone number (10 digits).');
        return;
    }

    try {
        localStorage.setItem('userInfo', JSON.stringify({ name, email, phone, dateOfAttendance }));
        
        const paymentUrl = "https://rzp.io/rzp/9c8NKAQ";
        window.location.href = paymentUrl;

    } catch (error) {
        console.log('Error saving user info:', error.message);
        alert('An error occurred. Please try again.');
    }
}

function clearInput(inputId) {
    const input = document.getElementById(inputId);
    input.value = '';
    toggleClearButton(input);
}

function toggleClearButton(inputElement) {
    const clearButton = inputElement.nextElementSibling;
    clearButton.style.display = inputElement.value ? 'inline' : 'none';
}

// Custom alert messages
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.className = `alert show ${type}`;
    setTimeout(closeAlert, 5000);
}

function closeAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('paymentButton').addEventListener('click', function(event) {
        event.preventDefault();
        proceedToPayment();
    });
});