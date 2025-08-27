import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

        const supabaseUrl = 'https://vxqpierpnqsmyckkusfp.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4cXBpZXJwbnFzbXlja2t1c2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDA3NjEsImV4cCI6MjA3MDY3Njc2MX0.lBm2eXleMQZrPdjZiLk1gatF7m7blHrx-GMeLDo8TQg';
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

// Delete account (client-only limitation)
async function deleteAccount() {
    const confirmDelete = confirm('Delete your account? This requires a server to fully remove your auth record. Proceed to sign out and clear local data?');
    if (!confirmDelete) return;

    try {
        await supabase.auth.signOut();
    } catch (_) {}
    localStorage.removeItem('user');
    showAlert('Signed out. Full account deletion requires a server-side key. See dashboard note.', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}

window.deleteAccount = deleteAccount;