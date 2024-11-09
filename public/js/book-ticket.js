const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ticketForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const dateOfAttendance = document.querySelector('input[name="dateOfAttendance"]:checked').value;

        try {
            // Check if a user with the same email or phone number already exists in 'Registrations'
            const { data: existingUser, error: checkError } = await supabase
            .from('Registrations')
            .select('*')
            .or(`email.eq.${email},phone.eq.${phone}`);

            if (checkError) throw checkError;

            if (Array.isArray(existingUser) && existingUser.length > 0) {
                showAlert('This user is already registered.', 'error');
                return;
            }

            // Select the first available ticket ID where 'registered' is false (Unregistered ticket)
            const { data: ticketData, error: ticketError } = await supabase
                .from('ticket_ids')
                .select('tickets')
                .eq('registered', false)
                .limit(1);

            if (ticketError || ticketData.length === 0) { throw new Error('No available tickets'); }

            const ticketId = ticketData[0].tickets;

            // Insert a new registration record with the user's information and ticket ID
            const { data, error } = await supabase
                .from('Registrations')
                .insert([{ name, email, phone, dateOfAttendance, registeredTicketId: ticketId }]);

            if (error) throw error;

            // Update the 'registered' status of the ticket to TRUE in the 'ticket_ids' table
            await supabase
                .from('ticket_ids')
                .update({ registered: true })
                .eq('tickets', ticketId);

            console.log('Data inserted and email sent successfully:');
            showAlert('Your data has been saved! A confirmation email has been sent.', 'success');

        } catch (error) {
            console.error('Error:', error.message);
            showAlert('An error occurred while saving your data. Please try again.', 'error');
        }
    });
});
