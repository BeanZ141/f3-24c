// Gift Cards Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeGiftCards();
});

function initializeGiftCards() {
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize gift card interactions
    initializeGiftCardActions();
    
    // Initialize responsive behavior
    initializeResponsive();
}

function initializeFilters() {
    const filterOptions = document.querySelectorAll('.filter-option input[type="radio"]');
    const clearBtn = document.querySelector('.clear-btn');
    
    // Handle filter changes
    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                filterGiftCards(this.value);
                updateFilterUI(this.value);
            }
        });
    });
    
    // Handle clear filters
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
}

function filterGiftCards(category) {
    const giftCards = document.querySelectorAll('.gift-card');
    
    giftCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            // Add filtering logic based on card data attributes
            const cardCategory = card.dataset.category;
            if (cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    showAlert(`Showing ${category.toUpperCase()} gift cards`, 'success');
}

function updateFilterUI(selectedCategory) {
    const filterLabels = document.querySelectorAll('.filter-option');
    
    filterLabels.forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        if (input.value === selectedCategory) {
            label.style.backgroundColor = 'var(--section-hover)';
        } else {
            label.style.backgroundColor = 'transparent';
        }
    });
}

function clearAllFilters() {
    const allFilter = document.querySelector('input[value="all"]');
    if (allFilter) {
        allFilter.checked = true;
        filterGiftCards('all');
        updateFilterUI('all');
    }
    
    showAlert('Filters cleared', 'success');
}

function initializeGiftCardActions() {
    // Action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent.trim();
            handleActionClick(action);
        });
    });
    
    // Gift card clicks
    const giftCards = document.querySelectorAll('.gift-card');
    giftCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h4').textContent;
            handleGiftCardClick(cardTitle);
        });
    });
    
    // Value selection
    const values = document.querySelectorAll('.value');
    values.forEach(value => {
        value.addEventListener('click', function(e) {
            e.stopPropagation();
            selectGiftCardValue(this);
        });
    });
    
    // Hero banner button
    const bookNowBtn = document.querySelector('.book-now-btn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function() {
            handleBookNowClick();
        });
    }
    
    // Corporate banner button
    const startHereBtn = document.querySelector('.start-here-btn');
    if (startHereBtn) {
        startHereBtn.addEventListener('click', function() {
            handleCorporateGiftingClick();
        });
    }
}

function handleActionClick(action) {
    switch(action) {
        case 'Add Gift Card':
            showAlert('Opening gift card purchase flow...', 'success');
            // Add logic to open purchase modal or navigate to purchase page
            break;
        case 'My Gift Card':
            showAlert('Opening your gift cards...', 'success');
            // Add logic to show user's gift cards
            break;
        case 'Check Balance':
            showAlert('Opening balance checker...', 'success');
            // Add logic to check gift card balance
            break;
        case 'How to Use':
            showAlert('Opening usage instructions...', 'success');
            // Add logic to show usage instructions
            break;
        default:
            showAlert('Feature coming soon!', 'success');
    }
}

function handleGiftCardClick(cardTitle) {
    showAlert(`Selected: ${cardTitle}`, 'success');
    // Add logic to handle gift card selection
}

function selectGiftCardValue(valueElement) {
    // Remove previous selections in the same card
    const card = valueElement.closest('.gift-card');
    const allValues = card.querySelectorAll('.value');
    allValues.forEach(v => v.classList.remove('selected'));
    
    // Add selection to clicked value
    valueElement.classList.add('selected');
    
    const amount = valueElement.textContent;
    const cardTitle = card.querySelector('h4').textContent;
    
    showAlert(`Selected ${amount} for ${cardTitle}`, 'success');
}

function handleBookNowClick() {
    showAlert('Opening personalized gift card creator...', 'success');
    // Add logic to open personalized gift card flow
}

function handleCorporateGiftingClick() {
    showAlert('Opening corporate gifting portal...', 'success');
    // Add logic to open corporate gifting section
}

function initializeResponsive() {
    // Handle responsive behavior
    window.addEventListener('resize', function() {
        adjustLayoutForScreenSize();
    });
    
    // Initial adjustment
    adjustLayoutForScreenSize();
}

function adjustLayoutForScreenSize() {
    const screenWidth = window.innerWidth;
    const sidebar = document.querySelector('.sidebar');
    const contentArea = document.querySelector('.content-area');
    
    if (screenWidth <= 1024) {
        // Mobile/tablet layout adjustments
        if (sidebar && contentArea) {
            sidebar.style.order = '2';
            contentArea.style.order = '1';
        }
    } else {
        // Desktop layout
        if (sidebar && contentArea) {
            sidebar.style.order = '';
            contentArea.style.order = '';
        }
    }
}

// Utility function to show alerts
function showAlert(message, type = 'success') {
    const alert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    
    if (alert && alertMessage) {
        alertMessage.textContent = message;
        alert.className = `alert ${type}`;
        alert.classList.add('show');
        
        setTimeout(() => {
            alert.classList.remove('show');
        }, 3000);
    }
}

// Add CSS for selected value state
const style = document.createElement('style');
style.textContent = `
    .value.selected {
        background-color: #4a9eff !important;
        color: white !important;
        border-color: #4a9eff !important;
        transform: scale(1.05);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);