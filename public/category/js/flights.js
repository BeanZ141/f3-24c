document.getElementById("switch-btn").addEventListener("click", () => {
  const fromSelected = document.querySelector("#from .select-selected");
  const toSelected = document.querySelector("#to .select-selected");

  const tempHTML = fromSelected.innerHTML;
  const tempValue = fromSelected.dataset.value;

  fromSelected.innerHTML = toSelected.innerHTML;
  fromSelected.dataset.value = toSelected.dataset.value;

  toSelected.innerHTML = tempHTML;
  toSelected.dataset.value = tempValue;
});

document.getElementById("switch-btn").addEventListener("click", function () {
  this.classList.toggle("rotated");
});

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
      selected.dataset.value = option.dataset.city;
      selected.innerHTML = `
                <div class="city">${option.dataset.city}</div>
                <div class="airport">${option.dataset.airport}</div>
            `;
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
  calendarSingle.style.display = "none";
  calendarRange.style.display = "none";
}

document.addEventListener("click", (event) => {
  if (
    calendarSingle &&
    !calendarSingle.contains(event.target) &&
    !dateTriggerSingle.contains(event.target)
  ) {
    calendarSingle.style.display = "none";
  }
  if (
    calendarRange &&
    !calendarRange.contains(event.target) &&
    !dateTriggerRange.contains(event.target)
  ) {
    calendarRange.style.display = "none";
  }
  if (
    travelersClass &&
    !travelersClass.contains(event.target) &&
    !event.target.closest(".travelers-and-class")
  ) {
    travelersClass.style.display = "none";
  }
});

const today = Kalendae.moment();

document.querySelector(".date-day").textContent = today.format("DD");
document.querySelector(".date-month").textContent = today.format("MMM'YY");
document.querySelector(".date-weekday").textContent = today.format("dddd");

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
      console.log("Selected date:", date);
      calendarSingle.style.display = "none";
    },
  },
});

new Kalendae("calendar-range", {
  mode: "range",
  selected: today.format("YYYY-MM-DD"),
  blackout: function (date) {
    return date.isBefore(today, "day");
  },
  subscribe: {
    "date-clicked": function (date) {
      console.log("Selected range:", date);
    },
  },
});

// Update Traveler Count
function updateTravelersCount() {
  const adults = document.querySelector('input[name="adults"]:checked').value;
  const children = document.querySelector(
    'input[name="children"]:checked'
  ).value;
  const infants = document.querySelector('input[name="infants"]:checked').value;

  const adultsCount = adults === ">9" ? 9 : parseInt(adults);
  const childrenCount = children === ">6" ? 6 : parseInt(children);
  const infantsCount = infants === ">6" ? 6 : parseInt(infants);

  const totalTravelers = adultsCount + childrenCount + infantsCount;

  document.querySelector(".number-of-travelers").textContent = totalTravelers;

  const travelerText = totalTravelers === 1 ? "Traveler" : "Travelers";
  document.querySelector(".travelers-display span:nth-child(2)").textContent =
    travelerText;
}

document
  .querySelectorAll(
    'input[name="adults"], input[name="children"], input[name="infants"]'
  )
  .forEach((input) => {
    input.addEventListener("change", updateTravelersCount);
  });

function updateTravelClass() {
  const selectedClass = document.querySelector('input[name="tclass"]:checked')
    .nextElementSibling.textContent;
  document.querySelector(".display-class").textContent = selectedClass;
}

document.querySelectorAll('input[name="tclass"]').forEach((input) => {
  input.addEventListener("change", updateTravelClass);
});
updateTravelClass();
updateTravelersCount();

document.addEventListener("DOMContentLoaded", checkUserSession);

async function checkUserSession() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("user-info").style.display = "inline-block";
    document.getElementById("username-display").textContent =
      user.user_metadata.username;
  } else {
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("user-info").style.display = "none";
  }
}

async function logout() {
  localStorage.removeItem("user");
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("Logout failed: " + error.message);
  } else {
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("username-display").textContent = "";
    alert("Logged out successfully.");
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
async function searchFlights() {
  const fromSelected = document.querySelector("#from .select-selected");
  const toSelected = document.querySelector("#to .select-selected");

  if (!fromSelected.dataset.value || !toSelected.dataset.value) {
    showAlert("Please select both departure and arrival cities", "error");
    return;
  }

  // Build URL with search parameters
  const params = new URLSearchParams({
    from: fromSelected.dataset.value,
    to: toSelected.dataset.value,
  });

  // Navigate to results page with parameters
  window.location.href = `/public/category/flight-results.html?${params.toString()}`;
}

// Toggle Round Trip
function toggleRoundTrip() {
  const isRoundTrip = document.getElementById("round-trip").checked;
  const returnSection = document.querySelector("#return-section .text-left");
  const cancelBtn = document.querySelector(".cancel-btn");
  const rangeCalendar = document.getElementById("calendar-range");

  if (isRoundTrip) {
    returnSection.innerHTML = `
            <div class="date-display">
                <span class="date-day">13</span>
                <span class="date-month">Mar'25</span>
            </div>
            <div class="date-weekday">Thursday</div>
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
