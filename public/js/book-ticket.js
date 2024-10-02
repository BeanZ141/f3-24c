// book-ticket.js
document.getElementById('ticketForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const created_at = document.querySelector('input[name="created_at"]:checked').value;

    // Here, simulate the payment success
    const paymentSuccessful = true; // Simulating successful payment

    if (paymentSuccessful) {
        await saveDataToSupabase(name, email, phone, created_at);
    } else {
        console.log("Payment failed, do not save data.");
    }
});

async function saveDataToSupabase(name, email, phone, created_at) {
    const { data, error } = await supabase
        .from('Registrations')
        .insert([{ name, email, phone, created_at }]);

    if (error) {
        console.error('Error saving data:', error);
    } else {
        console.log('Data saved successfully:', data);
    }
}
