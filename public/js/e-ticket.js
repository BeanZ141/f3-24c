const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.className = `alert show ${type}`;
    setTimeout(closeAlert, 6000);
}

function closeAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

async function saveToDatabase(userInfo) {
    try {
        const { data, error } = await supabase.from('Registrations').insert(userInfo);
        if (error) {
            console.error('Error saving to database:', error.message);
            showAlert('Error saving ticket information. Please contact support.', 'error');
        } else {
            console.log('Data saved successfully:', data);
            showAlert('Your ticket has been successfully saved.', 'success');
        }
    } catch (error) {
        console.error('Unexpected error:', error.message);
        showAlert('Unexpected error occurred. Please try again.', 'error');
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'success') {
        showAlert('Payment successful! Saving your ticket details...', 'success');
        
        // Retrieve data from localStorage
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        
        if (userInfo) {
            // Save the retrieved data to Supabase
            await saveToDatabase({
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                dateOfAttendance: userInfo.dateOfAttendance,
                createdAt: new Date().toISOString()
            });
        } else {
            console.error('No user info found in localStorage.');
            showAlert('Error: No ticket information found.', 'error');
        }
    } else {
        showAlert('Payment failed. Please try again.', 'error');
        console.error('Payment failed.');
    }
});
