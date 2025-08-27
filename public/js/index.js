function showSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {

        splashScreen.style.display = 'flex';
        mainContent.style.display = 'none';

        sessionStorage.setItem('hasVisited', 'true');
        
        setTimeout(() => {
            splashScreen.classList.add('fade-out');
            
            setTimeout(() => {
                splashScreen.style.display = 'none';
                showMainContent();
            }, 800);
        }, 2500);
    } else {
        splashScreen.style.display = 'none';
        showMainContent();
    }
}

function showMainContent() {
    const mainContent = document.getElementById('main-content');
    mainContent.style.display = 'block';

    setTimeout(() => {
        mainContent.classList.add('show');
        const services = document.querySelectorAll('.service');
        services.forEach((service, index) => {
            setTimeout(() => {
                ScrambleEffect(service);
            }, 200 + (index * 100));
        });
    }, 100);
}

function ScrambleEffect(element) {
    const originalText = element.textContent;
    const scrambleChars = 'QhYbEwVrUkDoLmJcZxSaGpNfTiHoMjRdPeWnKsBqXvClAzFuGyT';
    const maxScrambles = 30;
    let scrambleCount = 0;

    const scrambleInterval = setInterval(() => {
        if (scrambleCount >= maxScrambles) {
            clearInterval(scrambleInterval);
            element.textContent = originalText;
            return;
        }

        let scrambledText = '';

        for (let i = 0; i < originalText.length; i++) {
            const settlePoint = Math.floor((i / originalText.length) * maxScrambles);

            if (scrambleCount < settlePoint) {
                scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            } else {scrambledText += originalText[i];}
        }

        element.textContent = scrambledText;
        scrambleCount++;
    }, 50);
}

window.onload = function () { showSplashScreen(); };

function showLoginForm() { document.getElementById("loginForm").style.display = "block"; document.getElementById("signupForm").style.display = "none"; }
function showSignupForm() { document.getElementById("signupForm").style.display = "block"; document.getElementById("loginForm").style.display = "none"; }
function showPopup() { document.getElementById("login-popup").style.display = "block"; document.getElementById("overlay").style.display = "block"; showLoginForm(); }
function closePopup() { document.getElementById("login-popup").style.display = "none"; document.getElementById("overlay").style.display = "none"; }

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
    ) { closePopup(); }
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

function closeAlert() { document.getElementById('customAlert').classList.remove('show'); }

function toggleClearButton(input) {
    const clearBtn = input.nextElementSibling;
    if (input.value.length > 0) { clearBtn.style.display = "block"; } else { clearBtn.style.display = "none"; }
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

    if (!button.contains(event.target) && !dropdown.contains(event.target)) { dropdown.style.display = "none"; }
});
