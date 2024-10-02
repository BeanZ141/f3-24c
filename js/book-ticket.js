document.getElementById('ticketForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent default form submission

    // Simulate redirect to payment page
    window.location.href = "/public/mock-payment.html";
});

// When redirected back to the site after "payment"
if (sessionStorage.getItem('paymentStatus') === 'success') {
    // Now store the data in Firebase
    let formData = JSON.parse(sessionStorage.getItem('ticketFormData'));
    
    // Simulate storing in Firebase
    firebase.database().ref('tickets').push(formData)
    .then(() => {
        console.log('Ticket data stored successfully!');
        sessionStorage.removeItem('ticketFormData');  // Clear temp data
        sessionStorage.removeItem('paymentStatus');  // Clear payment status
    })
    .catch((error) => {
        console.error('Error storing data:', error);
    });
}