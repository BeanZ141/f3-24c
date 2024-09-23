let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
const slideDuration = 6000; 
let progressInterval;

function showSlide(index, fadeIn = true) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            slide.style.opacity = fadeIn ? 1 : 0; 
        } else {
            slide.style.opacity = 0;
            slide.classList.remove('active');
        }
    });

    if (fadeIn) {
        setTimeout(() => {
            slides[index].style.opacity = 1;
        }, 200); 
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide, true);
    resetProgressBar();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide, false);
    resetProgressBar();
}

function resetProgressBar() {
    progressBar.style.width = '0%';
    let width = 0;

    clearInterval(progressInterval);

    const incrementTime = slideDuration / 40; 

    progressInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(progressInterval);
        } else {
            width += 1;
            progressBar.style.width = `${width}%`;
        }
    }, incrementTime);
}

setInterval(() => {
    nextSlide();
    resetProgressBar(); 
}, slideDuration); 

showSlide(currentSlide);
resetProgressBar();

// Swipe Logic
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (event) => {
    touchStartX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
};

const handleTouchMove = (event) => {
    touchEndX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
};

const handleTouchEnd = (event) => {
    event.preventDefault();
    if (touchStartX > touchEndX + 10) {
        nextSlide(); // Swipe left
    } else if (touchStartX < touchEndX - 10) {
        previousSlide(); // Swipe right
    }
};

const slideshowContainer = document.querySelector('.slideshow-container');
slideshowContainer.addEventListener('touchstart', handleTouchStart);
slideshowContainer.addEventListener('touchmove', handleTouchMove);
slideshowContainer.addEventListener('touchend', handleTouchEnd);
slideshowContainer.addEventListener('mousedown', (event) => {
    handleTouchStart(event);
    event.preventDefault(); 
});
slideshowContainer.addEventListener('mousemove', handleTouchMove);
slideshowContainer.addEventListener('mouseup', handleTouchEnd);
