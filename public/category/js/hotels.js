// switchBtn and toggleDropdown are handled by service.js and common logic.
// Custom select and dropdown logic is also handled by service.js for all category pages.

const calendarCheckIn = document.getElementById('calendar-checkin');
const calendarCheckOut = document.getElementById('calendar-checkout');
// Use the shared travelersClass if available (it should be in service.js)
// If not, we define it here (using var is risky with const, so just check)
if (typeof travelersClass === 'undefined') {
    window.travelersClass = document.getElementById('travel-class');
}
const dateTriggerCheckIn = document.querySelector('.date-trigger[onclick="toggleCheckInCalendar()"]');
const dateTriggerCheckOut = document.querySelector('.date-trigger[onclick="toggleCheckOutCalendar()"]');

function toggleCheckInCalendar() {
    calendarCheckIn.style.display = (calendarCheckIn.style.display === 'none' || calendarCheckIn.style.display === '') ? 'block' : 'none';
    calendarCheckOut.style.display = 'none';
}

function toggleCheckOutCalendar() {
    calendarCheckOut.style.display = (calendarCheckOut.style.display === 'none' || calendarCheckOut.style.display === '') ? 'block' : 'none';
    calendarCheckIn.style.display = 'none';
}

function toggleTravelersClass() {
    travelersClass.style.display = (travelersClass.style.display === 'none' || travelersClass.style.display === '') ? 'block' : 'none';
    calendarCheckIn.style.display = 'none';
    calendarCheckOut.style.display = 'none';
}

document.addEventListener('click', (event) => {
    if (calendarCheckIn && !calendarCheckIn.contains(event.target) && !dateTriggerCheckIn.contains(event.target)) {
        calendarCheckIn.style.display = 'none';
    }
    if (calendarCheckOut && !calendarCheckOut.contains(event.target) && !dateTriggerCheckOut.contains(event.target)) {
        calendarCheckOut.style.display = 'none';
    }
    if (travelersClass && 
        !travelersClass.contains(event.target) && 
        !event.target.closest('.travelers-and-class')
    ) {
        travelersClass.style.display = 'none';
    }
});

if (typeof today === 'undefined') {
    window.today = Kalendae.moment();
}
const tomorrow = Kalendae.moment().add(1, 'days');

document.querySelector('.checkin-day').textContent = today.format('DD');
document.querySelector('.checkin-month').textContent = today.format("MMM'YY");
document.querySelector('.checkin-weekday').textContent = today.format('dddd');

document.querySelector('.checkout-day').textContent = tomorrow.format('DD');
document.querySelector('.checkout-month').textContent = tomorrow.format("MMM'YY");
document.querySelector('.checkout-weekday').textContent = tomorrow.format('dddd');

new Kalendae('calendar-checkin', {
    mode: 'single',
    selected: today.format('YYYY-MM-DD'),
    blackout: function(date) {
        return date.isBefore(today, 'day');
    },
    subscribe: {
        'date-clicked': function(date) {
            document.querySelector('.checkin-day').textContent = date.format('DD');
            document.querySelector('.checkin-month').textContent = date.format("MMM'YY");
            document.querySelector('.checkin-weekday').textContent = date.format('dddd');
            console.log('Check-in date:', date);
            calendarCheckIn.style.display = 'none';
        }
    }
});

new Kalendae('calendar-checkout', {
    mode: 'single',
    selected: tomorrow.format('YYYY-MM-DD'),
    blackout: function(date) {
        return date.isBefore(today, 'day');
    },
    subscribe: {
        'date-clicked': function(date) {
            document.querySelector('.checkout-day').textContent = date.format('DD');
            document.querySelector('.checkout-month').textContent = date.format("MMM'YY");
            document.querySelector('.checkout-weekday').textContent = date.format('dddd');
            console.log('Check-out date:', date);
            calendarCheckOut.style.display = 'none';
        }
    }
});

// Update Traveler Count
function updateTravelersCount() {
    const adults = document.querySelector('input[name="adults"]:checked').value;
    const children = document.querySelector('input[name="children"]:checked').value;
    const infants = document.querySelector('input[name="infants"]:checked').value;
    
    const adultsCount = adults === '>9' ? 9 : parseInt(adults);
    const childrenCount = children === '>6' ? 6 : parseInt(children);
    const infantsCount = infants === '>6' ? 6 : parseInt(infants);

    const totalTravelers = adultsCount + childrenCount + infantsCount;

    document.querySelector('.number-of-travelers').textContent = totalTravelers;

    const travelerText = totalTravelers === 1 ? 'Adult' : 'Adults';
    document.querySelector('.travelers-display span:nth-child(2)').textContent = travelerText;
}

document.querySelectorAll('input[name="adults"], input[name="children"], input[name="infants"]').forEach((input) => {
    input.addEventListener('change', updateTravelersCount);
});

function updateTravelClass() {
    const tclassInput = document.querySelector('input[name="tclass"]:checked');
    if (tclassInput && document.querySelector('.display-class')) {
        const selectedClass = tclassInput.nextElementSibling.textContent;
        document.querySelector('.display-class').textContent = selectedClass;
    }
}

document.querySelectorAll('input[name="tclass"]').forEach((input) => {
    input.addEventListener('change', updateTravelClass);
});
updateTravelClass();
updateTravelersCount();


function searchHotels() {
    const toSelect = document.querySelector("#to .select-selected");
    
    let priceRange = toSelect && toSelect.dataset.value ? toSelect.dataset.value : (toSelect ? toSelect.innerText.trim() : '');
    
    // Fallback if priceRange is not set but exists in DOM with text like "₹0-1500"
    if (!priceRange && toSelect) {
        priceRange = toSelect.textContent.trim();
    }

    // Capture search details for the booking phase
    const checkInDay = document.querySelector('.checkin-day').textContent;
    const checkInMonth = document.querySelector('.checkin-month').textContent;
    const checkOutDay = document.querySelector('.checkout-day').textContent;
    const checkOutMonth = document.querySelector('.checkout-month').textContent;
    
    const adults = parseInt(document.querySelector('input[name="adults"]:checked').value) || 1;
    const children = parseInt(document.querySelector('input[name="children"]:checked').value) || 0;
    const infants = parseInt(document.querySelector('input[name="infants"]:checked').value) || 0;
    
    const roomsValue = document.querySelector('input[name="tripType"]:checked')?.value || 'one-room';
    const rooms = roomsValue === 'upto-4-rooms' ? 4 : 1;

    // Calculate nights (rough estimate or just store strings)
    // For simplicity and since we use Kalendae strings, we'll store the formatted strings
    const hotelSearchDetails = {
        checkIn: `${checkInDay} ${checkInMonth}`,
        checkOut: `${checkOutDay} ${checkOutMonth}`,
        guests: adults + children + infants,
        rooms: rooms,
        nights: 1 // Default to 1 night if we don't do complex date math here
    };
    
    localStorage.setItem('hotelSearchDetails', JSON.stringify(hotelSearchDetails));
    
    // Redirect to results with only price filters
    let url = `../category/hotel-results.html?location=`; // Empty location as requested
    
    if (priceRange && typeof priceRange === 'string') {
        const cleanPrice = priceRange.replace(/₹/g, '').replace(/\s/g, '');
        if (cleanPrice.includes('-')) {
            const parts = cleanPrice.split('-');
            url += `&minPrice=${parts[0]}&maxPrice=${parts[1]}`;
        } else if (cleanPrice.includes('+')) {
            url += `&minPrice=${cleanPrice.replace('+', '')}`;
        } else {
            // Handle cases where it might just be a single number or text
            const numeric = cleanPrice.replace(/[^0-9]/g, '');
            if (numeric) url += `&minPrice=${numeric}`;
        }
    }
    
    window.location.href = url;
}

// Custom alert messages (showAlert)
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    if (alertBox && alertMessage) {
        alertMessage.innerText = message;
        alertBox.className = `alert show ${type}`;
        setTimeout(closeAlert, 5000);
    }
}

// Close Alert
function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) {
        alertBox.classList.remove('show');
    }
}


// Toggle Round Trip
function toggleRoundTrip() {
    const isRoundTrip = document.getElementById('round-trip').checked;
    const returnSection = document.querySelector('#return-section .text-left');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (isRoundTrip) {
        returnSection.innerHTML = `
            <div class="date-display">
                <span class="date-day">13</span>
                <span class="date-month">Mar'25</span>
            </div>
            <div class="date-weekday">Thursday</div>
        `;
        cancelBtn.style.display = 'block';
    } else {
        returnSection.innerHTML = `<span class="return-description">Tap to add a return date for bigger discounts</span>`;
        cancelBtn.style.display = 'none';
    }
}

function cancelReturn() {
    // Get the radio buttons
    const roundTripRadio = document.getElementById('round-trip');
    const oneWayRadio = document.querySelector('input[name="tripType"][value="one-way"]');
    const returnSection = document.querySelector('#return-section');
    const returnText = document.querySelector('#return-section .text-left');
    const cancelBtn = document.querySelector('.cancel-btn');

    roundTripRadio.checked = false;
    oneWayRadio.checked = true;

    returnSection.onclick = null;
    returnText.innerHTML = `<span class="return-description">Tap to add a return date for bigger discounts</span>`;
    cancelBtn.style.display = 'none';

    toggleRoundTrip();
    setTimeout(() => {
        returnSection.onclick = switchToRoundTrip;
    }, 300);
}

function switchToRoundTrip() {
    const isOneWay = document.querySelector('input[name="tripType"][value="one-way"]').checked;
    if (isOneWay) {
        document.getElementById('round-trip').checked = true;
        toggleRoundTrip();
    }
}
