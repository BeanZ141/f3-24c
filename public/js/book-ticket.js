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
            const { data, error } = await supabase
                .from('Registrations') 
                .insert([{ name, email, phone, dateOfAttendance }]);
            
            if (error) {
                throw error;
            }
        
            console.log('Data inserted successfully:');
            alert('Your data has been saved! Proceeding to payment...');
    
        } catch (error) {
            console.error('Error inserting data:', error.message);
            alert('An error occurred while saving your data. Please try again.');
        }
    });
    });