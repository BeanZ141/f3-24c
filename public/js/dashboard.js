import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://bbmtcjjhcnjpfglltqyl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibXRjampoY25qcGZnbGx0cXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDE1ODQsImV4cCI6MjA5MDc3NzU4NH0.XCSUS89zOQuEI3-fvo9BGja3-AYMHU1VaXV6xrMqvaU';
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// Initialize dashboard
async function initializeDashboard() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error fetching session:', error.message);
            window.location.href = 'index.html';
            return;
        }

        if (session && session.user) {
            currentUser = session.user;
            displayUserDetails();
            loadDashboardData();
        } else {
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error('Error checking session:', err);
        window.location.href = 'index.html';
    }
}

// Display user details
function displayUserDetails() {
    if (!currentUser) return;

    const username = currentUser.user_metadata?.username || 'User';
    const email = currentUser.email || '';

    // Update overview section
    document.getElementById('user-name').textContent = username;
    
    // Update profile form
    document.getElementById('profile-username').value = username;
    document.getElementById('profile-email').value = email;
    document.getElementById('profile-phone').value = currentUser.user_metadata?.phone || '';
    document.getElementById('profile-dob').value = currentUser.user_metadata?.dob || '';
    document.getElementById('profile-address').value = currentUser.user_metadata?.address || '';
}

// Load dashboard data
async function loadDashboardData() {
    loadStats();
    loadRecentActivity();
    loadBookings();
    loadTickets();
    loadPaymentHistory();
}

// Load statistics
function loadStats() {
    // Get data from localStorage or generate sample data
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const payments = JSON.parse(localStorage.getItem('userPayments') || '[]');
    
    const totalBookings = bookings.length;
    const upcomingTrips = bookings.filter(b => new Date(b.date) > new Date()).length;
    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const loyaltyPoints = Math.floor(totalSpent / 100) * 10; // 10 points per ₹100 spent

    document.getElementById('total-bookings').textContent = totalBookings;
    document.getElementById('upcoming-trips').textContent = upcomingTrips;
    document.getElementById('total-spent').textContent = `₹${totalSpent.toLocaleString()}`;
    document.getElementById('loyalty-points').textContent = loyaltyPoints;
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        {
            icon: 'fas fa-plane',
            title: 'Flight Booked',
            description: 'Mumbai to Goa - IndiGO 6E-123',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-credit-card',
            title: 'Payment Successful',
            description: 'Flight booking payment of ₹4,500',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-user-edit',
            title: 'Profile Updated',
            description: 'Contact information updated',
            time: '1 day ago'
        }
    ];

    const activityList = document.getElementById('recent-activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `).join('');
}

// Load bookings
function loadBookings() {
    const sampleBookings = [
        {
            id: 'TKT001',
            type: 'flight',
            title: 'Mumbai to Goa',
            details: {
                airline: 'IndiGO',
                flight: '6E-123',
                date: '2025-02-15',
                time: '06:00 - 08:15',
                passengers: '1 Adult'
            },
            status: 'confirmed',
            amount: '₹4,500'
        },
        {
            id: 'TKT002',
            type: 'hotel',
            title: 'Taj Hotel, Mumbai',
            details: {
                checkin: '2025-02-20',
                checkout: '2025-02-22',
                room: 'Deluxe Room',
                guests: '2 Adults'
            },
            status: 'pending',
            amount: '₹8,000'
        }
    ];

    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = sampleBookings.map(booking => `
        <div class="booking-card" data-status="${booking.status}">
            <div class="booking-header">
                <div class="booking-type">
                    <i class="fas fa-${booking.type === 'flight' ? 'plane' : booking.type === 'hotel' ? 'hotel' : 'train'}"></i>
                    ${booking.title}
                </div>
                <div class="booking-status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
            </div>
            <div class="booking-details">
                ${Object.entries(booking.details).map(([key, value]) => `
                    <div class="booking-detail">
                        <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                        <p>${value}</p>
                    </div>
                `).join('')}
                <div class="booking-detail">
                    <h4>Amount</h4>
                    <p>${booking.amount}</p>
                </div>
            </div>
            <div class="booking-actions">
                <button class="booking-btn primary">View Details</button>
                <button class="booking-btn">Download Ticket</button>
                ${booking.status === 'confirmed' ? '<button class="booking-btn">Cancel</button>' : ''}
            </div>
        </div>
    `).join('');
}

// Load tickets
function loadTickets() {
    const sampleTickets = [
        {
            id: 'TKT001',
            type: 'Flight',
            title: 'Mumbai to Goa',
            subtitle: 'IndiGO 6E-123',
            date: 'Feb 15, 2025',
            qrCode: 'TKT001QR'
        },
        {
            id: 'TKT002',
            type: 'Hotel',
            title: 'Taj Hotel Mumbai',
            subtitle: 'Deluxe Room',
            date: 'Feb 20-22, 2025',
            qrCode: 'TKT002QR'
        }
    ];

    const ticketsGrid = document.getElementById('tickets-grid');
    ticketsGrid.innerHTML = sampleTickets.map(ticket => `
        <div class="ticket-card">
            <div class="ticket-header">
                <h3>${ticket.type}</h3>
                <p>${ticket.date}</p>
            </div>
            <div class="ticket-body">
                <h4>${ticket.title}</h4>
                <p>${ticket.subtitle}</p>
                <div class="ticket-qr">
                    <div class="qr-placeholder">
                        <i class="fas fa-qrcode"></i>
                    </div>
                    <p>Ticket ID: ${ticket.id}</p>
                </div>
                <button class="booking-btn primary" style="width: 100%;">Download Ticket</button>
            </div>
        </div>
    `).join('');
}

// Load payment history
function loadPaymentHistory() {
    const samplePayments = [
        {
            id: 'PAY001',
            description: 'Flight Booking - Mumbai to Goa',
            date: 'Feb 10, 2025',
            amount: 4500,
            status: 'Success'
        },
        {
            id: 'PAY002',
            description: 'Hotel Booking - Taj Hotel Mumbai',
            date: 'Feb 08, 2025',
            amount: 8000,
            status: 'Success'
        }
    ];

    const paymentsList = document.getElementById('payments-list');
    paymentsList.innerHTML = samplePayments.map(payment => `
        <div class="payment-item">
            <div class="payment-info">
                <h4>${payment.description}</h4>
                <p>${payment.date} • ${payment.status}</p>
            </div>
            <div class="payment-amount">₹${payment.amount.toLocaleString()}</div>
        </div>
    `).join('');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);

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
//
 Section navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active menu item
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
    
    // Hide sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('visible');
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('visible');
}

// Filter bookings
function filterBookings(filter) {
    const bookingCards = document.querySelectorAll('.booking-card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter booking cards
    bookingCards.forEach(card => {
        const status = card.dataset.status;
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update profile
async function updateProfile(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const profileData = {
        username: formData.get('username'),
        phone: formData.get('phone'),
        dob: formData.get('dob'),
        address: formData.get('address')
    };
    
    try {
        const { error } = await supabase.auth.updateUser({
            data: profileData
        });
        
        if (error) throw error;
        
        showAlert('Profile updated successfully!', 'success');
        currentUser.user_metadata = { ...currentUser.user_metadata, ...profileData };
        displayUserDetails();
    } catch (error) {
        console.error('Error updating profile:', error);
        showAlert('Failed to update profile. Please try again.', 'error');
    }
}

// Change password
function changePassword() {
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
        showAlert('Password must be at least 6 characters long.', 'error');
        return;
    }
    
    supabase.auth.updateUser({ password: newPassword })
        .then(({ error }) => {
            if (error) throw error;
            showAlert('Password updated successfully!', 'success');
        })
        .catch(error => {
            console.error('Error updating password:', error);
            showAlert('Failed to update password. Please try again.', 'error');
        });
}

// Logout function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        localStorage.removeItem('user');
        showAlert('Logged out successfully.', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        console.error('Error logging out:', error);
        showAlert('Logout failed: ' + error.message, 'error');
    }
}

// Delete account
async function deleteAccount() {
    const confirmDelete = confirm(
        'Are you sure you want to delete your account? This action cannot be undone.\n\n' +
        'Note: Due to security limitations, this will only sign you out. ' +
        'Full account deletion requires server-side implementation.'
    );
    
    if (!confirmDelete) return;
    
    try {
        await supabase.auth.signOut();
        localStorage.clear();
        showAlert('Account signed out. Contact support for full account deletion.', 'info');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } catch (error) {
        console.error('Error during account deletion:', error);
        showAlert('Failed to sign out. Please try again.', 'error');
    }
}

// Custom alert function
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    alertMessage.textContent = message;
    alertBox.className = `alert show ${type}`;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// Make functions globally available
window.showSection = showSection;
window.toggleSidebar = toggleSidebar;
window.filterBookings = filterBookings;
window.updateProfile = updateProfile;
window.changePassword = changePassword;
window.logout = logout;
window.deleteAccount = deleteAccount;

// Handle responsive sidebar
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('visible');
    }
});

// Initialize theme toggle
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-switch');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = localStorage.getItem('theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
        });
    }
});