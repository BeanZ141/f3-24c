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

async function getAvailableTicketId() {
    try {
        const { data, error } = await supabase
            .from('ticket_ids')
            .select('tickets')
            .eq('registered', false)
            .limit(1)
            .single();

        if (error || !data) {
            console.error('No available ticket IDs:', error);
            showAlert('No tickets available. Please contact support.', 'error');
            return null;
        }

        const { error: updateError } = await supabase
            .from('ticket_ids')
            .update({ registered: true })
            .eq('tickets', data.tickets);

        if (updateError) {
            console.error('Error updating ticket status:', updateError);
            showAlert('Error processing your ticket. Please contact support.', 'error');
            return null;
        }

        return data.id;
    } catch (err) {
        console.error('Unexpected error fetching ticket ID:', err);
        showAlert('Unexpected error occurred. Please try again.', 'error');
        return null;
    }
}

async function saveToDatabase(userInfo) {
    try {
        const ticketId = await getAvailableTicketId();
        if (!ticketId) return;

        const { data, error } = await supabase.from('Registrations').insert({
            ...userInfo,
            registeredTicketId: ticketId,
        });

        if (error) {
            console.error('Error saving to database:', error.message);
            showAlert('Error saving ticket information. Please contact support.', 'error');
        } else {
            console.log('Data saved successfully:', data);
            showAlert('Your ticket has been successfully saved.', 'success');
            return ticketId; // Return the ticket ID to show in the UI
        }
    } catch (error) {
        console.error('Unexpected error:', error.message);
        showAlert('Unexpected error occurred. Please try again.', 'error');
    }
    return null;
}

async function fetchTicketDetails(email) {
    try {
        const { data, error } = await supabase
            .from('Registrations')
            .select('registeredTicketId, name, dateOfAttendance')
            .eq('email', email)
            .order('registered_at', { ascending: false })
            .limit(1)

        if (error || !data) {
            console.error('Error fetching ticket details:', error);
            showAlert('Error fetching ticket details. Please contact support.', 'error');
            return null;
        }

        if (!data || data.length === 0) {
            console.warn('No ticket details found.');
            showAlert('No ticket details found. Please contact support.', 'warning');
            return null;
        }

        return data[0];
    } catch (error) {
        console.error('Unexpected error:', error.message);
        showAlert('Unexpected error occurred. Please try again later.', 'error');
        return null;
    }
}

function updateTicketUI(ticketDetails) {
    if (!ticketDetails) return;

    document.querySelector('.ticket-id b').innerText = ticketDetails.registeredTicketId;
    document.querySelector('.registered-name b').innerText = ticketDetails.name;
    document.querySelector('.ticket-date').innerText = `Date: ${ticketDetails.dateOfAttendance}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'success') {
        showAlert('Payment successful! Processing your ticket...', 'success');

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (userInfo) {
            let ticketId = await saveToDatabase(userInfo);

            if (!ticketId) {
                const ticketDetails = await fetchTicketDetails(userInfo.email);
                ticketId = ticketDetails?.registeredTicketId;
            }

            if (ticketId) {
                updateTicketUI({ 
                    registeredTicketId: ticketId, 
                    name: userInfo.name, 
                    dateOfAttendance: userInfo.dateOfAttendance 
                });
            }
        } else {
            showAlert('Error: No user information found. Please contact support.', 'error');
            console.error('No user info found in localStorage.');
        }
    } else {
        showAlert('Payment failed. Please try again.', 'error');
        console.error('Payment failed.');
    }
});
