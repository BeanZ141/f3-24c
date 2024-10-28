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

            await supabase
                .from('ticket_ids')
                .update({ registered: true })
                .eq('tickets', ticketId);

            if (error) throw error;

            await fetch('https://62ae-49-15-229-146.ngrok-free.app/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, ticketId })
            });

            console.log('Data inserted and email sent successfully:');
            alert('Your data has been saved! A confirmation email has been sent.');

        } catch (error) {
            console.error('Error:', error.message);
            alert('An error occurred while saving your data. Please try again.');
        }
    });
});

const sendEmail = async (name, email, ticketId) => {
    const response = await fetch('https://api.mailgun.net/v3/sandboxe5457533522246b98ad1eb17e65483a1/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(`api:${process.env.MAILGUN_API_KEY}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            from: 'Indovention Event <mailgun@sandboxe5457533522246b98ad1eb17e65483a1.mailgun.org>',
            to: email,
            subject: 'Your Ticket Registration',
            text: `Thank you for registering, ${name}! Your ticket ID is: ${ticketId}`,
            html: `<h1>Thank you for registering, ${name}!</h1><p>Your ticket ID is: <strong>${ticketId}</strong></p>`
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }
    return await response.json();
};