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

async function registerUser(ticketId) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
        showAlert('User information not found. Please try again.', 'error');
        console.log('User information not found.');
        return;
    }

    const { name, email, phone, dateOfAttendance } = userInfo;

    try {
        const { data, error } = await supabase
            .from('Registrations')
            .insert([{ name, email, phone, dateOfAttendance, registeredTicketId: ticketId }]);

        if (error) throw error;
        showAlert('Payment successful! Your ticket has been booked.', 'success');
        console.log('Ticket booked.', data);

    } catch (error) {
        console.error('Error registering user: ', error);
        showAlert('An error occurred. Please try again later.', 'error');
    }
}

async function handlePaymentStatus(paymentStatus) {
    if (paymentStatus === 'success') {
        try {
            const { data: ticketData, error: ticketError } = await supabase
                .from('ticket_ids')
                .select('tickets')
                .eq('registered', false)
                .limit(1);

            if (ticketError || ticketData.length === 0) throw new Error('No available tickets');

            const ticketId = ticketData[0].tickets;
            await supabase
                .from('ticket_ids')
                .update({ registered: true })
                .eq('tickets', ticketId);

            await registerUser(ticketId);

        } catch (error) {
            console.error('Error handling payment status:', error);
            showAlert('An error occurred. Please try again later.', 'error');
        }
    } else {
        showAlert('Payment failed. Please try again.', 'error');
        console.log('Payment failed.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus) {
        handlePaymentStatus(paymentStatus);
    } else {
        showAlert('No payment status found.', 'error');
        console.log('No payment status found.');
    }
});
