const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function proceedToPayment() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dateOfAttendance = document.querySelector('input[name="dateOfAttendance"]:checked');

    if (!name || !email || !phone || !dateOfAttendance) {
        showAlert('Please fill out all required fields.', 'error');
        console.log('Empty form field(s)');
        return;
    }

    try {
        const response = await fetch('https://f3-24c-a9e76.web.app.cloudfunctions.net/app/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paymentAmount: 10, // replace with the actual amount
                userInfo: { name, email, phone, dateOfAttendance: dateOfAttendance.value }
            })
        });
        
        const result = response.ok ? await response.json() : await response.text();
        if (response.ok) {
            window.location.href = result.paymentUrl;
        } else {
            console.error('Error:', result);
            showAlert(result || 'Payment initiation failed', 'error');
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        showAlert('An error occurred. Please try again.', 'error');
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