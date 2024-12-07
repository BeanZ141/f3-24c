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

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'success') {
        showAlert('Payment successful! Your ticket has been booked.', 'success');
        console.log('Payment successful.');
    } else {
        showAlert('Payment failed. Please try again.', 'error');
        console.log('Payment failed.');
    }
});
