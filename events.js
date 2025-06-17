document.addEventListener('DOMContentLoaded', () => {
    const sliderTrack = document.querySelector('.slider-track');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    const items = document.querySelectorAll('.slider-item');
    
    let currentIndex = 0;
    let itemsPerView = window.innerWidth <= 576 ? 1 : window.innerWidth <= 768 ? 2 : 3;
    const totalItems = items.length;
    
    // Calculate the width to move for each slide
    function getItemWidth() {
        return items[0].offsetWidth + 32; // 32px is the gap between items
    }
    
    // Update slider position
    function updateSlider() {
        const itemWidth = getItemWidth();
        const offset = -currentIndex * itemWidth;
        sliderTrack.style.transform = `translateX(${offset}px)`;
        
        // Update button states
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= totalItems - itemsPerView ? '0.5' : '1';
    }
    
    // Event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentIndex < totalItems - itemsPerView) {
            currentIndex++;
            updateSlider();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update items per view based on screen width
        const newItemsPerView = window.innerWidth <= 576 ? 1 : window.innerWidth <= 768 ? 2 : 3;
        
        // If items per view changed, reset current index if needed
        if (newItemsPerView !== itemsPerView) {
            itemsPerView = newItemsPerView;
            if (currentIndex > totalItems - itemsPerView) {
                currentIndex = totalItems - itemsPerView;
            }
        }
        
        // Recalculate and update slider position
        updateSlider();
    });
    
    // Initialize slider
    updateSlider();

    // Past Events Show More/Less Functionality
    const showMoreBtn = document.querySelector('.show-more-btn');
    const hiddenCards = document.querySelectorAll('.event-card.hidden');
    let isExpanded = false;

    showMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        
        // Toggle button text
        showMoreBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
        
        // Toggle hidden cards with animation
        hiddenCards.forEach((card, index) => {
            if (isExpanded) {
                // Show cards
                setTimeout(() => {
                    card.classList.remove('hidden');
                    gsap.fromTo(card, 
                        {
                            y: 50,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: 'power2.out',
                            clearProps: 'all'
                        }
                    );
                }, 100);
            } else {
                // Hide cards
                gsap.to(card, {
                    y: 50,
                    opacity: 0,
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: 'power2.in',
                    onComplete: () => {
                        card.classList.add('hidden');
                        gsap.set(card, { clearProps: 'all' });
                    }
                });
            }
        });

        // Scroll to show more button if showing less
        if (!isExpanded) {
            setTimeout(() => {
                showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    });

    // Add hover animation for event cards
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}); 