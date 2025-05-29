// Initialize GSAP
gsap.registerPlugin();

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial animation for the gradient overlay
    gsap.from('.gradient-overlay', {
        opacity: 0,
        duration: 2,
        ease: 'power2.out'
    });

    // Navbar animations
    gsap.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.logo-container', {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    gsap.from('.hamburger-menu', {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            hamburger.classList.remove('active');
            navOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });
}); 