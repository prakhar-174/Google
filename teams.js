// Departmental Lead Slider Functionality
function initDeptSlider() {
    const track = document.querySelector('.dept-slider-track');
    const cards = document.querySelectorAll('.dept-member-card');
    const prevBtn = document.querySelector('.dept-slider-btn.prev');
    const nextBtn = document.querySelector('.dept-slider-btn.next');
    if (!track || !cards.length || !prevBtn || !nextBtn) return;

    let cardsPerView = 4;
    let currentIndex = 0;

    function updateCardsPerView() {
        if (window.innerWidth <= 768) {
            cardsPerView = 1;
        } else if (window.innerWidth <= 1200) {
            cardsPerView = 2;
        } else {
            cardsPerView = 4;
        }
    }

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(track).gap) || 0;
        const moveX = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveX}px)`;
        // Disable prev/next at ends
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    function goNext() {
        if (currentIndex < cards.length - cardsPerView) {
            currentIndex++;
            updateSlider();
        }
    }

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    window.addEventListener('resize', () => {
        updateCardsPerView();
        // Clamp currentIndex if needed
        if (currentIndex > cards.length - cardsPerView) {
            currentIndex = Math.max(0, cards.length - cardsPerView);
        }
        updateSlider();
    });

    // Initial setup
    updateCardsPerView();
    updateSlider();
}

document.addEventListener('DOMContentLoaded', initDeptSlider); 