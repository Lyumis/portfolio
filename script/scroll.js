// Плавный скролл и показ стрелки
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    // Плавный скролл к якорю
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Показ/скрытие стрелки при скролле
    function toggleBackToTop() {
        if (window.pageYOffset > 800) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    // Дебаунс для оптимизации
    let scrollTimeout;
    function debounceToggle() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleBackToTop, 10);
    }
    
    window.addEventListener('scroll', debounceToggle);
    
    // Инициализация при загрузке
    toggleBackToTop();
});