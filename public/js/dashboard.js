/**
 * Dashboard Logic for TicketEase
 * Merged and refined from dashboard.html and previous dashboard.js
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Dashboard
    if (window.AuthService) {
        window.AuthService.onAuthStateChange((user) => {
            if (!user) {
                console.log('Dashboard: No user session found, redirecting to login...');
                // Give it a tiny bit of time to ensure it's not a transient state
                setTimeout(() => {
                    if (!window.AuthService.currentUser) {
                        window.location.href = 'index.html';
                    }
                }, 1000);
                return;
            }
            
            console.log('Dashboard: User authenticated:', user);
            updateUserDisplay(user);
            loadDashboardData();
        });
    } else {
        console.error('Dashboard: AuthService not found!');
    }

    // Initialize Theme Toggle
    const themeToggle = document.getElementById('theme-switch');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            console.log('Dashboard: Theme toggled to', isDark ? 'dark' : 'light');
        });
    }

    // Initialize Sidebar Toggle (if any)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.querySelector('.sidebar')?.classList.toggle('active');
        });
    }
});

/**
 * Update user-related UI elements
 */
function updateUserDisplay(user) {
    const name = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
    
    // Update various name displays
    const elements = {
        'username-display': name,
        'welcome-name': name,
        'profile-username': name,
        'profile-email': user.email || ''
    };

    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT') el.value = value;
            else el.textContent = value;
        }
    }

    // Update profile-specific fields if they exist in metadata
    const phoneEl = document.getElementById('profile-phone');
    if (phoneEl) phoneEl.value = user.user_metadata?.phone || '';
}

/**
 * Load all data for the dashboard
 */
function loadDashboardData() {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const payments = JSON.parse(localStorage.getItem('userPayments') || '[]');

    updateStats(bookings, payments);
    displayRecentActivity(bookings);
    displayBookings(bookings);
    displayPayments(payments);
}

/**
 * Update stats cards
 */
function updateStats(bookings, payments) {
    const totalBookingsEl = document.getElementById('total-bookings');
    const totalSpentEl = document.getElementById('total-spent');
    const recentBookingsEl = document.getElementById('recent-bookings');

    if (totalBookingsEl) totalBookingsEl.textContent = bookings.length;
    
    if (totalSpentEl) {
        const totalAmount = payments.reduce((sum, p) => {
            const amt = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^0-9.]/g, '')) : p.amount;
            return sum + (amt || 0);
        }, 0);
        totalSpentEl.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;
    }

    if (recentBookingsEl) {
        const now = new Date();
        const thisMonth = bookings.filter(b => {
            const d = new Date(b.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        recentBookingsEl.textContent = thisMonth;
    }
}

/**
 * Display recent activity items
 */
function displayRecentActivity(bookings) {
    const container = document.getElementById('recent-activity');
    if (!container) return;

    if (bookings.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No recent activity found.</p></div>';
        return;
    }

    const recent = bookings.slice(0, 5); // Show latest 5
    container.innerHTML = recent.map(b => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${getIconForType(b.type)}"></i>
            </div>
            <div class="activity-info">
                <h4>${b.title}</h4>
                <p>${new Date(b.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} • ${b.status}</p>
            </div>
            <div class="activity-amount">${b.amount}</div>
        </div>
    `).join('');
}

/**
 * Display all bookings in the list
 */
function displayBookings(bookings, filter = 'all') {
    const container = document.getElementById('bookings-container');
    if (!container) return;

    const filtered = filter === 'all' ? bookings : bookings.filter(b => b.type === filter);

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No bookings found for this category.</p></div>';
        return;
    }

    container.innerHTML = filtered.map(b => `
        <div class="booking-card" data-status="${b.status}">
            <div class="booking-header">
                <div class="booking-type">
                    <i class="${getIconForType(b.type)}"></i>
                    ${b.type}
                </div>
                <div class="booking-status ${b.status}">${b.status.toUpperCase()}</div>
            </div>
            <div class="booking-body">
                <div class="booking-main-details" style="margin-bottom: 1.5rem;">
                    <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; margin: 0; letter-spacing: -0.02em;">${b.title}</h3>
                </div>
                <div class="booking-details-grid">
                    ${Object.entries(b.details || {}).map(([key, val]) => `
                        <div class="detail-item">
                            <label>${key}</label>
                            <span>${val}</span>
                        </div>
                    `).join('')}
                    <div class="detail-item" style="grid-column: span 2; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px dashed var(--radio-border);">
                        <label>Total Amount Paid</label>
                        <span style="font-size: 1.5rem; color: var(--color-fg); font-weight: 700;">${b.amount}</span>
                    </div>
                </div>
            </div>
            <div class="booking-footer">
                <button class="btn-card" onclick="alert('Ticket ID: ${b.id}')">View Ticket</button>
                <button class="btn-card btn-card-primary" onclick="window.location.href='mailto:support@ticketease.com'">Support</button>
            </div>
        </div>
    `).join('');
}

/**
 * Display all payments in the list
 */
function displayPayments(payments) {
    const container = document.getElementById('payments-container');
    if (!container) return;

    if (payments.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No transaction history found.</p></div>';
        return;
    }

    container.innerHTML = payments.map(p => {
        let amountDisplay = '—';
        if (p.amount != null) {
            const amt = typeof p.amount === 'string' ? parseFloat(p.amount.replace(/[^0-9.]/g, '')) : p.amount;
            amountDisplay = `₹${(amt || 0).toLocaleString('en-IN')}`;
        }
        
        return `
            <div class="payment-card">
                <div class="payment-info">
                    <h4>${p.description}</h4>
                    <p>ID: ${p.id} • ${p.date}</p>
                </div>
                <div class="payment-status-wrapper">
                    <span class="status-tag ${p.status.toLowerCase()}">${p.status}</span>
                    <div class="payment-amount">${amountDisplay}</div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Helper: Get FontAwesome icon for booking type
 */
function getIconForType(type) {
    switch (type) {
        case 'flight': return 'fa-solid fa-plane';
        case 'hotel': return 'fa-solid fa-hotel';
        case 'train': return 'fa-solid fa-train';
        case 'event': return 'fa-solid fa-calendar-days';
        default: return 'fa-solid fa-ticket';
    }
}

// Exposed globally for HTML-based interactions
window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        const onClick = btn.getAttribute('onclick');
        if (onClick && onClick.includes(`'${sectionId}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Refresh data when sections switch
    loadDashboardData();
};

window.filterBookings = function(type) {
    const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    displayBookings(bookings, type);
    
    document.querySelectorAll('.filter-tab').forEach(btn => {
        const onClick = btn.getAttribute('onclick');
        if (onClick && onClick.includes(`'${type}'`)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
};

window.updateProfile = async function(event) {
    event.preventDefault();
    if (!window.AuthService) return;

    const formData = new FormData(event.target);
    const username = formData.get('username');
    const phone = formData.get('phone');

    try {
        const { data, error } = await window.AuthService.client.auth.updateUser({
            data: { username, phone }
        });

        if (error) throw error;
        
        alert('Profile updated successfully!');
        updateUserDisplay(data.user);
    } catch (err) {
        console.error('Dashboard: Profile update error:', err);
        alert('Failed to update profile: ' + err.message);
    }
};

window.logout = async function() {
    if (window.AuthService) {
        try {
            await window.AuthService.logout();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Dashboard: Logout error:', error);
            window.location.href = 'index.html';
        }
    } else {
        window.location.href = 'index.html';
    }
};
