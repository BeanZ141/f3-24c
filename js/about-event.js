let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');

function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            slide.style.opacity = 1; // Fade in
        } else {
            slide.style.opacity = 0; // Fade out
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    updateProgressBar();
}

function updateProgressBar() {
    const progress = ((currentSlide + 1) / slides.length) * 100;
    progressBar.style.width = `${progress}%`;
}

setInterval(nextSlide, 3000); // Change image every 3 seconds
showSlide(currentSlide); // Show the first slide initially
updateProgressBar(); // Initialize progress bar
