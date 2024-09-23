let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const progressBar = document.getElementById('progressBar');
        const slideDuration = 6000; 
        let progressInterval;

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
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
            resetProgressBar();
        }

        function resetProgressBar() {
            progressBar.style.width = '0%';
            let width = 0;

            clearInterval(progressInterval);

            const incrementTime = slideDuration / 10; 
        
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