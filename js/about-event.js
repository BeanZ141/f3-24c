let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
const slideDuration = 8000;
let progressInterval;
let slideInterval;
let isSwiping = false;

function updateSlideInfo() {
    slideInfo.textContent = `${currentSlide + 1}/${slides.length}`;
}

function showSlide(index) {
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
            slide.style.opacity = 1;
        } else {
            slide.style.opacity = 0;
            slide.classList.remove('active');
        }
    });
    updateSlideInfo();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetProgressBar();
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
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

function resetSlideTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
        resetProgressBar();
    }, slideDuration);
}

// Initialize
showSlide(currentSlide);
resetProgressBar();
resetSlideTimer();

// Swipe Logic
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (event) => {
    touchStartX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
    isSwiping = true;
};

const handleTouchMove = (event) => {
    if (!isSwiping) return;

    touchEndX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
    const moveX = touchEndX - touchStartX;

    const swipePercent = moveX / window.innerWidth;

    const currentSlideElement = slides[currentSlide];
    const nextSlideIndex = (currentSlide + 1) % slides.length;
    const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;

    const nextSlideElement = moveX < 0 ? slides[nextSlideIndex] : slides[prevSlideIndex];

    currentSlideElement.style.opacity = 1 - Math.abs(swipePercent); 
    nextSlideElement.classList.add('active'); 
    nextSlideElement.style.opacity = Math.max(1, Math.min(0, Math.abs(swipePercent)));
};

const handleTouchEnd = (event) => {
    event.preventDefault();
    isSwiping = false;
    const moveX = touchEndX - touchStartX;

    if (moveX < -90) {
        nextSlide();
    } else if (moveX > 90) {
        previousSlide();
    } else {
        showSlide(currentSlide);
    }
    slides.forEach(slide => {
        slide.style.opacity = '';
    });

    resetSlideTimer();
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
