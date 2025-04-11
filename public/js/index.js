window.onload = function () {
    document.querySelector('.blinker').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
};

// Service container icons
document.addEventListener("DOMContentLoaded", () => {
    const serviceIcon = document.getElementById("service-icon");
    const links = document.querySelectorAll(".service-container a");

    function showIcon(iconFile) {
        serviceIcon.src = `/public/category/icons/${iconFile}`;
        serviceIcon.classList.remove("hidden");
        serviceIcon.classList.add("visible");
    }

    function hideIcon() {
        serviceIcon.classList.remove("visible");
        serviceIcon.classList.add("hidden");
    }

    links.forEach((link) => {
        link.addEventListener("mouseover", () => {
            const iconFile = link.getAttribute("data-icon");
            showIcon(iconFile);
        });

        link.addEventListener("mouseout", () => {
            hideIcon();
        });
    });
});

function showLoginForm() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";
}

function showSignupForm() {
    document.getElementById("signupForm").style.display = "block";
    document.getElementById("loginForm").style.display = "none";
}

function showPopup() {
    document.getElementById("login-popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    showLoginForm();
}

function closePopup() {
    document.getElementById("login-popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Login Popup
function showPopup() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("overlay");
    loginPopup.classList.add("show");
    overlay.classList.add("show");
}

function closePopup() {
    const loginPopup = document.getElementById("login-popup");
    const overlay = document.getElementById("overlay");
    loginPopup.classList.remove("show");
    overlay.classList.remove("show");
}

document.addEventListener("click", (event) => {
    const loginPopup = document.getElementById("login-popup");
    if (
        loginPopup.classList.contains("show") &&
        !loginPopup.contains(event.target) &&
        !event.target.closest("#login-btn")
    ) {
        closePopup();
    }
});

window.addEventListener("load", () => {
    setTimeout(() => {
        showPopup();
    }, 11000);
});

document.getElementById("login-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    showPopup();
});

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

function toggleClearButton(input) {
    const clearBtn = input.nextElementSibling;
    if (input.value.length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
}

function clearInput(button) {
    const input = button.previousElementSibling;
    input.value = "";
    button.style.display = "none";
}

function toggleDropdown() {
    const dropdown = document.getElementById("dropdown-menu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Close the dropdown when clicking outside
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("dropdown-menu");
    const button = document.querySelector(".dropdown-btn");

    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
    }
});