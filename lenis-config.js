// Lenis Smooth Scrolling Configuration
// This file should be loaded before other scripts that depend on scroll events

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2, // Animation duration in seconds
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
    direction: 'vertical', // Scroll direction
    gestureDirection: 'vertical', // Gesture direction
    smooth: true, // Enable smooth scrolling
    mouseMultiplier: 1, // Mouse wheel sensitivity
    smoothTouch: false, // Disable smooth scrolling on touch devices (better performance)
    touchMultiplier: 2, // Touch sensitivity
    infinite: false, // Disable infinite scrolling
});

// Connect Lenis with GSAP ScrollTrigger for perfect synchronization
lenis.on('scroll', ScrollTrigger.update);

// Use GSAP ticker for smooth animation frame updates
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

// Disable GSAP's lag smoothing to prevent conflicts
gsap.ticker.lagSmoothing(0);

// Utility function for smooth scrolling to elements
function scrollToElement(target, options = {}) {
    const defaultOptions = {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: 0
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    lenis.scrollTo(target, finalOptions);
}

// Utility function for smooth scrolling to top
function scrollToTop(options = {}) {
    const defaultOptions = {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    lenis.scrollTo(0, finalOptions);
}

// Handle navigation menu clicks with smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    // Update back to top functionality
    const backToTopButtons = document.querySelectorAll('.back-to-top');
    backToTopButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToTop();
        });
    });

    // Handle anchor links with smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                scrollToElement(target, { offset: -100 }); // Offset for fixed navbar
            }
        });
    });

    // Pause Lenis when modal/overlay is open
    const navOverlay = document.querySelector('.nav-overlay');
    if (navOverlay) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (navOverlay.classList.contains('active')) {
                        lenis.stop(); // Stop scrolling when menu is open
                    } else {
                        lenis.start(); // Resume scrolling when menu is closed
                    }
                }
            });
        });
        
        observer.observe(navOverlay, { attributes: true });
    }
});

// Export for use in other scripts
window.lenis = lenis;
window.scrollToElement = scrollToElement;
window.scrollToTop = scrollToTop;