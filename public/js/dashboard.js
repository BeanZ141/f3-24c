import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

        const supabaseUrl = 'https://xiwdkytqnabqawssehrg.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpd2RreXRxbmFicWF3c3NlaHJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY5NDE0NTEsImV4cCI6MjA0MjUxNzQ1MX0.4r_O1Za9Q41zpHxdx0JuloECBa-bw7e4m93v241rpgw';
        const supabase = createClient(supabaseUrl, supabaseKey);
    
        async function displayUserDetails() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
    
                if (error) {
                    console.error('Error fetching session:', error.message);
                }
    
                if (session) {
                    const user = session.user;
                    document.querySelector('#home h1').textContent = `Welcome, ${user.user_metadata.username}`;
                    document.querySelector('#home p:nth-child(2)').innerHTML = `<b>Username :</b> ${user.user_metadata.username}`;
                    document.querySelector('#home p:nth-child(3)').innerHTML = `<b>User ID :</b> ${user.id}`;
                    document.querySelector('#home p:nth-child(4)').innerHTML = `<b>Email :</b> ${user.email}`;
                }
            } catch (err) {
                console.error('Error checking session:', err);
            }
        }
        displayUserDetails();

// Checks user session
async function checkUserSession() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
        console.error("Error fetching session:", error);
        return;
    }

    const session = data.session;
    
    if (session && session.user) {
        updateUI(session.user);
        console.log("User is logged in:", session.user);
    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }
}

// Log Out function
async function logout() {
    localStorage.removeItem('user');

    const { error } = await supabase.auth.signOut();
    if (error) {
        showAlert('Logout failed: ' + error.message, 'error');
    } else {
        showAlert('Logged out successfully.', 'success');
        setTimeout(() => {
            checkUserSession();
        }, 3000);
    }
    window.location = "index.html";
}

// Custom alert messages
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertBox.className = `alert show ${type}`;
    setTimeout(closeAlert, 5000);
}

function closeAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

window.logout = logout;