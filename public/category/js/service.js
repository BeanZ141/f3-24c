const switchBtn = document.getElementById("switch-btn");
if (switchBtn) {
  switchBtn.addEventListener("click", () => {
    const fromSelected = document.querySelector("#from .select-selected");
    const toSelected = document.querySelector("#to .select-selected");

    const tempHTML = fromSelected.innerHTML;
    const tempValue = fromSelected.dataset.value;

    fromSelected.innerHTML = toSelected.innerHTML;
    fromSelected.dataset.value = toSelected.dataset.value;

    toSelected.innerHTML = tempHTML;
    toSelected.dataset.value = tempValue;
  });

  switchBtn.addEventListener("click", function () {
    this.classList.toggle("rotated");
  });
}

document.querySelectorAll(".custom-select").forEach((select) => {
  const selected = select.querySelector(".select-selected");
  const options = select.querySelector(".select-options");

  selected.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".select-options").forEach((o) => {
      if (o !== options) o.classList.remove("open");
    });

    // Position the dropdown relative to the select
    options.classList.toggle("open");
    selected.classList.toggle("open");
  });

  options.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      selected.dataset.value = option.dataset.code || option.dataset.city;
      let resultHTML = "";
      if (option.dataset.city) {
        resultHTML += `<div class="city">${option.dataset.city}</div>`;
      }
      if (option.dataset.airport) {
        resultHTML += `<div class="airport">${option.dataset.airport}</div>`;
      }
      // If none of those exist, try using the hidden spans in the option
      if (!resultHTML) {
        resultHTML = option.innerHTML;
      }
      selected.innerHTML = resultHTML;

      options.classList.remove("open");
      selected.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    options.classList.remove("open");
    selected.classList.remove("open");
  });
});

function toggleDropdown() {
  const dropdown = document.getElementById("dropdown-menu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("dropdown-menu");
  const button = document.querySelector(".dropdown-btn");

  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

const calendarSingle = document.getElementById("calendar-single");
const calendarRange = document.getElementById("calendar-range");
const travelersClass = document.getElementById("travel-class");
const timeslotsPicker = document.getElementById("timeslots-picker");
const dateTriggerSingle = document.querySelector(
  '.date-trigger[onclick="toggleSingleCalendar()"]'
);
const dateTriggerRange = document.querySelector(
  '.date-trigger[onclick="togglerangeCalendar()"]'
);

function toggleSingleCalendar() {
  calendarSingle.style.display =
    calendarSingle.style.display === "none" ||
    calendarSingle.style.display === ""
      ? "block"
      : "none";
  calendarRange.style.display = "none";
}

function togglerangeCalendar() {
  calendarRange.style.display =
    calendarRange.style.display === "none" || calendarRange.style.display === ""
      ? "block"
      : "none";
  calendarSingle.style.display = "none";
}

function toggleTravelersClass() {
  if (travelersClass) {
    if (
      travelersClass.style.display === "none" ||
      travelersClass.style.display === ""
    ) {
      travelersClass.style.display = "block";
      travelersClass.classList.add("open");
    } else {
      travelersClass.style.display = "none";
      travelersClass.classList.remove("open");
    }
  }
  if (calendarSingle) calendarSingle.style.display = "none";
  if (calendarRange) calendarRange.style.display = "none";
  if (timeslotsPicker) {
    timeslotsPicker.style.display = "none";
    timeslotsPicker.classList.remove("open");
  }
}

function toggleTimeslots() {
  if (timeslotsPicker) {
    if (
      timeslotsPicker.style.display === "none" ||
      timeslotsPicker.style.display === ""
    ) {
      timeslotsPicker.style.display = "block";
      timeslotsPicker.classList.add("open");
    } else {
      timeslotsPicker.style.display = "none";
      timeslotsPicker.classList.remove("open");
    }
  }
  if (calendarSingle) calendarSingle.style.display = "none";
  if (calendarRange) calendarRange.style.display = "none";
  if (travelersClass) {
    travelersClass.style.display = "none";
    travelersClass.classList.remove("open");
  }
}

document.addEventListener("click", (event) => {
  if (
    calendarSingle &&
    !calendarSingle.contains(event.target) &&
    (!dateTriggerSingle || !dateTriggerSingle.contains(event.target))
  ) {
    calendarSingle.style.display = "none";
  }
  if (
    calendarRange &&
    !calendarRange.contains(event.target) &&
    (!dateTriggerRange || !dateTriggerRange.contains(event.target))
  ) {
    calendarRange.style.display = "none";
  }
  if (
    travelersClass &&
    !travelersClass.contains(event.target) &&
    !event.target.closest('button[onclick="toggleTravelersClass()"]')
  ) {
    travelersClass.style.display = "none";
  }
  if (
    timeslotsPicker &&
    !timeslotsPicker.contains(event.target) &&
    !event.target.closest('button[onclick="toggleTimeslots()"]')
  ) {
    timeslotsPicker.style.display = "none";
  }
});

const today = Kalendae.moment();

const dateDay = document.querySelector(".date-day");
const dateMonth = document.querySelector(".date-month");
const dateWeekday = document.querySelector(".date-weekday");

if (dateDay) dateDay.textContent = today.format("DD");
if (dateMonth) dateMonth.textContent = today.format("MMM'YY");
if (dateWeekday) dateWeekday.textContent = today.format("dddd");

let departureDate = today.clone();
let returnDateStr = today.clone().add(1, 'day').format('DD MMM\'YY dddd').split(' ');

if (document.getElementById("calendar-single")) {
  new Kalendae("calendar-single", {
    mode: "single",
    selected: today.format("YYYY-MM-DD"),
    blackout: function (date) {
      return date.isBefore(today, "day");
    },
    subscribe: {
      "date-clicked": function (date) {
        document.querySelector(".date-day").textContent = date.format("DD");
        document.querySelector(".date-month").textContent = date.format("MMM'YY");
        document.querySelector(".date-weekday").textContent = date.format("dddd");
        
        departureDate = date.clone();
        
        // If return date is before new departure date, auto-bump it
        const isRoundTrip = document.getElementById("round-trip")?.checked;
        if (isRoundTrip) {
            // Re-trigger the round trip toggle to refresh dates based on new departure
            toggleRoundTrip();
        }

        console.log("Selected departure date:", date);
        calendarSingle.style.display = "none";
      },
    },
  });
}

if (document.getElementById("calendar-range")) {
  new Kalendae("calendar-range", {
    mode: "single", // Treating it as a single date selector for the return date
    selected: today.clone().add(1, 'day').format("YYYY-MM-DD"),
    blackout: function (date) {
      return date.isBefore(departureDate, "day");
    },
    subscribe: {
      "date-clicked": function (date) {
        const returnSection = document.querySelector("#return-section .text-left");
        if (returnSection && document.getElementById("round-trip").checked) {
            returnSection.innerHTML = `
                <div class="date-display">
                    <span class="date-day">${date.format("DD")}</span>
                    <span class="date-month">${date.format("MMM'YY")}</span>
                </div>
                <div class="date-weekday">${date.format("dddd")}</span>
            `;
            // Also store it for future toggle off/on
            returnSection.dataset.selectedDate = date.format("YYYY-MM-DD");
        }
        console.log("Selected return date:", date);
        calendarRange.style.display = "none";
      },
    },
  });
}

// Update Traveler Count
function updateTravelersCount() {
  const adultsEl = document.querySelector('input[name="adults"]:checked');
  const childrenEl = document.querySelector('input[name="children"]:checked');
  const infantsEl = document.querySelector('input[name="infants"]:checked');

  if (!adultsEl || !childrenEl || !infantsEl) return;

  const adults = adultsEl.value;
  const children = childrenEl.value;
  const infants = infantsEl.value;

  const adultsCount = adults === ">9" ? 9 : parseInt(adults);
  const childrenCount = children === ">6" ? 6 : parseInt(children);
  const infantsCount = infants === ">6" ? 6 : parseInt(infants);

  const totalTravelers = adultsCount + childrenCount + infantsCount;

  const numTravelersEl = document.querySelector(".number-of-travelers");
  if (numTravelersEl) numTravelersEl.textContent = totalTravelers;

  const travelerText = totalTravelers === 1 ? "Traveler" : "Travelers";
  const displayLabelEl = document.querySelector(".travelers-display span:nth-child(2)");
  if (displayLabelEl) displayLabelEl.textContent = travelerText;
}

document
  .querySelectorAll(
    'input[name="adults"], input[name="children"], input[name="infants"]'
  )
  .forEach((input) => {
    input.addEventListener("change", updateTravelersCount);
  });

function updateTravelClass() {
  const tclassInput = document.querySelector('input[name="tclass"]:checked');
  if (!tclassInput) return;
  const selectedClass = tclassInput.nextElementSibling.textContent;
  const displayClassEl = document.querySelector(".display-class");
  if (displayClassEl) displayClassEl.textContent = selectedClass;
}

function updateTimeslots() {
  const timeslotInput = document.querySelector('input[name="timeslot"]:checked');
  if (!timeslotInput) return;
  const selectedTimeslot = timeslotInput.value;
  const displayTimeslotEl = document.getElementById("timeslot-display");
  if (displayTimeslotEl) displayTimeslotEl.textContent = selectedTimeslot;
}

document.querySelectorAll('input[name="tclass"]').forEach((input) => {
  input.addEventListener("change", updateTravelClass);
});
document.querySelectorAll('input[name="timeslot"]').forEach((input) => {
  input.addEventListener("change", updateTimeslots);
});
updateTravelClass();
updateTravelersCount();
updateTimeslots();

document.addEventListener("DOMContentLoaded", function() {
    if (window.AuthService) {
        window.AuthService.onAuthStateChange((user) => {
            const loginBtn = document.getElementById("login-btn");
            const userInfo = document.getElementById("user-info");
            const usernameDisplay = document.getElementById("username-display");
            
            if (loginBtn && userInfo) {
                if (user) {
                    loginBtn.style.display = "none";
                    userInfo.style.display = "inline-block";
                    if (usernameDisplay) {
                        usernameDisplay.textContent = user.user_metadata?.username || user.email || 'User';
                    }
                } else {
                    loginBtn.style.display = "block";
                    userInfo.style.display = "none";
                }
            }
        });
    }
});

async function logout() {
    if (window.AuthService) {
        try {
            await window.AuthService.logout();
            showAlert("Logged out successfully.", "success");
            // If on a protected page, you might want to redirect
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Logout failed: " + error.message);
        }
    }
}


// Custom alert messages (showAlert)
function showAlert(message, type = "info") {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.innerText = message;
  alertBox.className = `alert show ${type}`;
  setTimeout(closeAlert, 5000);
}

// Close Alert
function closeAlert() {
  document.getElementById("customAlert").classList.remove("show");
}

// Search flights function
function searchFlights() {
  const fromSelect = document.querySelector("#from .select-selected");
  const toSelect = document.querySelector("#to .select-selected");
  
  if (!fromSelect || !toSelect || !fromSelect.dataset.value || !toSelect.dataset.value) {
    showAlert("Please select both source and destination.", "error");
    return;
  }
  
  const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'one-way';
  const displaySingle = document.getElementById("date-display-single")?.innerText.trim();
  const returnDisplay = document.getElementById("date-display-return")?.innerText.trim();
  const timeslot = document.querySelector('input[name="timeslot"]:checked')?.value || 'Anytime';
  
  // Travelers & Class is stored in global variables, but lets extract from inputs if they exist globally
  // We can also extract from the travelersDisplay, but `adults`, `children`, `infants` and `travelersClass` exist
  // We assume those globals exist. If not we set defaults.
  const ad = typeof adults !== 'undefined' ? adults : 1;
  const ch = typeof children !== 'undefined' ? children : 0;
  const inf = typeof infants !== 'undefined' ? infants : 0;
  const tclass = typeof travelersClass !== 'undefined' ? travelersClass : 'Economy';
  
  localStorage.setItem('flightSearchFilters', JSON.stringify({
    tripType,
    from: fromSelect.dataset.value,
    to: toSelect.dataset.value,
    dateSingle: displaySingle,
    dateReturn: returnDisplay,
    adults: ad,
    children: ch,
    infants: inf,
    travelersClass: tclass,
    timeslot
  }));

  window.location.href = `../category/flight-results.html?from=${fromSelect.dataset.value}&to=${toSelect.dataset.value}&timeslot=${timeslot}&tripType=${tripType}&adults=${ad}&class=${tclass}`;
}

// Search trains function
function searchTrains() {
  const fromSelect = document.querySelector("#from .select-selected");
  const toSelect = document.querySelector("#to .select-selected");
  
  if (!fromSelect || !toSelect || !fromSelect.dataset.value || !toSelect.dataset.value) {
    showAlert("Please select both source and destination.", "error");
    return;
  }
  
  window.location.href = `../category/train-results.html?from=${fromSelect.dataset.value}&to=${toSelect.dataset.value}`;
}


// Toggle Round Trip
function toggleRoundTrip() {
  const isRoundTrip = document.getElementById("round-trip").checked;
  const returnSection = document.querySelector("#return-section .text-left");
  const cancelBtn = document.querySelector(".cancel-btn");
  const rangeCalendar = document.getElementById("calendar-range");

  if (isRoundTrip) {
    // dynamically generate return date relative to departure
    // Wait, let's see if we saved a return date before
    const previouslySelected = returnSection.dataset.selectedDate;
    let fallbackReturnDate = departureDate.clone().add(1, 'day');
    
    // Check if previously selected date is valid and after departure
    if (previouslySelected) {
        let prev = Kalendae.moment(previouslySelected, "YYYY-MM-DD");
        if (prev.isSameOrAfter(departureDate, 'day')) {
            fallbackReturnDate = prev;
        }
    }
    
    returnSection.innerHTML = `
            <div class="date-display" id="date-display-return">
                <span class="date-day">${fallbackReturnDate.format("DD")}</span>
                <span class="date-month">${fallbackReturnDate.format("MMM'YY")}</span>
            </div>
            <div class="date-weekday">${fallbackReturnDate.format("dddd")}</div>
        `;
    cancelBtn.style.display = "block";
  } else {
    returnSection.innerHTML = `<span class="return-description">Tap to add a return date for bigger discounts</span>`;
    cancelBtn.style.display = "none";
    rangeCalendar.style.display = "none";
  }
}

function cancelReturn() {
  // Get the radio buttons
  const roundTripRadio = document.getElementById("round-trip");
  const oneWayRadio = document.querySelector(
    'input[name="tripType"][value="one-way"]'
  );
  const returnSection = document.querySelector("#return-section");
  const returnText = document.querySelector("#return-section .text-left");
  const cancelBtn = document.querySelector(".cancel-btn");
  const rangeCalendar = document.getElementById("calendar-range");

  roundTripRadio.checked = false;
  oneWayRadio.checked = true;

  returnSection.onclick = null;
  returnText.innerHTML = `<span class="return-description">Tap to add a return date for bigger discounts</span>`;
  cancelBtn.style.display = "none";
  rangeCalendar.style.display = "none";

  toggleRoundTrip();
  setTimeout(() => {
    returnSection.onclick = switchToRoundTrip;
  }, 300);
}

function switchToRoundTrip() {
  const isOneWay = document.querySelector(
    'input[name="tripType"][value="one-way"]'
  ).checked;
  if (isOneWay) {
    document.getElementById("round-trip").checked = true;
    toggleRoundTrip();
  }
}
