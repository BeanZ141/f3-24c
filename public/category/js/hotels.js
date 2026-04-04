document.querySelectorAll('.custom-select').forEach(select => {
    const selected = select.querySelector('.select-selected');
    const options = select.querySelector('.select-options');

    selected.addEventListener('click', () => {
        options.classList.toggle('open');
        selected.classList.toggle('open');
    });

    options.querySelectorAll('div').forEach(option => {
        option.addEventListener('click', () => {
            selected.dataset.value = option.dataset.city;
            selected.innerHTML = `
                <div class="city">${option.dataset.city}</div>
            `;
            options.classList.remove('open');
            selected.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!select.contains(e.target)) {
            options.classList.remove('open');
            selected.classList.remove('open');
        }
    });
});

// Switch button only exists on flights page, not hotels
const switchBtn = document.getElementById("switch-btn");
if (switchBtn) {
    switchBtn.addEventListener("click", function () {
        this.classList.toggle("rotated");
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdown-menu");
    const button = document.querySelector(".dropdown-btn");

    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

const calendarCheckIn = document.getElementById('calendar-checkin');
const calendarCheckOut = document.getElementById('calendar-checkout');
const travelersClass = document.getElementById('travel-class');
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

const today = Kalendae.moment();
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
    const selectedClass = document.querySelector('input[name="tclass"]:checked').nextElementSibling.textContent;
    document.querySelector('.display-class').textContent = selectedClass;
}

document.querySelectorAll('input[name="tclass"]').forEach((input) => {
    input.addEventListener('change', updateTravelClass);
});
updateTravelClass();
updateTravelersCount();


function searchHotels() {
    const fromSelect = document.querySelector("#from .select-selected");
    const toSelect = document.querySelector("#to .select-selected");
    
    const location = fromSelect ? fromSelect.dataset.value : '';
    const priceRange = toSelect ? toSelect.dataset.value : '';
    
    let url = `../category/hotel-results.html?location=${encodeURIComponent(location)}`;
    
    // Parse price range for filtering
    if (priceRange.includes('-')) {
        const parts = priceRange.replace('₹', '').split('-');
        url += `&minPrice=${parts[0]}&maxPrice=${parts[1]}`;
    } else if (priceRange.includes('+')) {
        url += `&minPrice=${priceRange.replace(/[^0-9]/g, '')}`;
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
