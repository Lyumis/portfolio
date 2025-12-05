document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    
    if (!carouselContainer || !carouselTrack || carouselSlides.length === 0) return;
    
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let previousTranslate = 0;
    let autoScrollInterval = null;
    let slideWidth = 560 + 20; // 560px + 20px gap
    const totalOriginalSlides = carouselSlides.length;
    
    // Дублируем слайды ДВАЖДЫ для бесшовной прокрутки в обе стороны
    function duplicateSlides() {
        const slidesArray = Array.from(carouselSlides);
        
        // Дублируем дважды (всего 18 слайдов)
        for (let i = 0; i < 2; i++) {
            const clones = slidesArray.map(slide => slide.cloneNode(true));
            clones.forEach(clone => carouselTrack.appendChild(clone));
        }
    }
    
    // Проверяем и корректируем позицию для бесконечной прокрутки
    function checkInfiniteScroll() {
        const totalTrackWidth = slideWidth * totalOriginalSlides * 3; // оригинал + 2 копии
        const threshold = slideWidth * totalOriginalSlides;
        
        // Если ушли слишком далеко вправо (конец оригинальных слайдов)
        if (Math.abs(currentTranslate) >= threshold * 2) {
            carouselTrack.style.transition = 'none';
            currentTranslate += threshold; // Перескакиваем к началу
            updateTrackPosition();
            
            requestAnimationFrame(() => {
                carouselTrack.style.transition = 'transform 0.5s ease';
            });
        }
        // Если ушли слишком далеко влево (начало оригинальных слайдов)
        else if (currentTranslate > 0) {
            carouselTrack.style.transition = 'none';
            currentTranslate -= threshold; // Перескакиваем к концу
            updateTrackPosition();
            
            requestAnimationFrame(() => {
                carouselTrack.style.transition = 'transform 0.5s ease';
            });
        }
    }
    
    // Запускаем автоматическую прокрутку ВПРАВО
    function startAutoScroll() {
        stopAutoScroll();
        
        autoScrollInterval = setInterval(() => {
            if (!isDragging) {
                currentTranslate -= 1.5;
                checkInfiniteScroll();
                updateTrackPosition();
            }
        }, 16);
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    function updateTrackPosition() {
        const roundedTranslate = Math.round(currentTranslate);
        carouselTrack.style.transform = `translateX(${roundedTranslate}px)`;
    }
    
    function dragStart(e) {
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        previousTranslate = currentTranslate;
        carouselContainer.classList.add('grabbing');
        stopAutoScroll();
        carouselTrack.style.transition = 'none';
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const currentX = e.clientX || e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = previousTranslate + diff;
        currentTranslate = Math.round(currentTranslate);
        
        updateTrackPosition();
        e.preventDefault();
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        carouselContainer.classList.remove('grabbing');
        carouselTrack.style.transition = 'transform 0.5s ease';
        
        // Проверяем бесконечную прокрутку после drag
        checkInfiniteScroll();
        
        // Плавный restart автоскролла
        setTimeout(() => {
            startAutoScroll();
        }, 800);
    }
    
    function initCarousel() {
        duplicateSlides();
        
        // Начинаем со смещением на один набор оригинальных слайдов
        // Это дает нам место для прокрутки в обе стороны
        currentTranslate = -slideWidth * totalOriginalSlides;
        updateTrackPosition();
        
        // События
        const events = {
            mousedown: dragStart,
            mousemove: drag,
            mouseup: dragEnd,
            mouseleave: dragEnd,
            touchstart: dragStart,
            touchmove: drag,
            touchend: dragEnd
        };
        
        Object.entries(events).forEach(([event, handler]) => {
            carouselContainer.addEventListener(event, handler);
        });
        
        // Предотвращаем drag изображений
        carouselTrack.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
        
        // Запускаем с задержкой чтобы всё инициализировалось
        setTimeout(() => startAutoScroll(), 1000);
        
        console.log('Карусель: бесшовная бесконечность в обе стороны');
    }
    
    initCarousel();
});