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
            const { data: existingUser, error: checkError } = await supabase
            .from('Registrations')
            .select('*')
            .or(`email.eq.${email},phone.eq.${phone}`);

            if (checkError) throw checkError;

            if (existingUser && existingUser.length > 0) {
                alert('This user is already registered.');
                return;
            }

            const { data: ticketData, error: ticketError } = await supabase
                .from('ticket_ids')
                .select('tickets')
                .eq('registered', false)
                .limit(1);

            if (ticketError || ticketData.length === 0) {
                throw new Error('No available tickets');
            }

            const ticketId = ticketData[0].tickets;

            const { data, error } = await supabase
                .from('Registrations')
                .insert([{ name, email, phone, dateOfAttendance, registeredTicketId: ticketId }]);

            if (error) throw error;

            await supabase
                .from('ticket_ids')
                .update({ registered: true })
                .eq('tickets', ticketId);

            const { data: existingRegistration } = await supabase
            .from('Registrations')
            .select('id')
            .eq('registeredTicketId', ticketId);
            
            if (existingRegistration.length > 0) { throw new Error('This ticket is already registered.'); }
            
            console.log('Data inserted and email sent successfully:');
            alert('Your data has been saved! A confirmation email has been sent.');

        } catch (error) {
            console.error('Error:', error.message);
            alert('An error occurred while saving your data. Please try again.');
        }
    });
});
