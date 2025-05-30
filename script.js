// Initialize GSAP
gsap.registerPlugin();

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial animation for the gradient overlay
    gsap.from('.gradient-overlay', {
        opacity: 15,
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

    // Modified hamburger menu animation
    gsap.from('.hamburger-menu', {
        x: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
        onComplete: () => {
            // Ensure hamburger menu is visible after animation
            gsap.set('.hamburger-menu', {
                opacity: 1,
                visibility: 'visible'
            });
        }
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

    // Text cycling animation with typing effect
    const texts = [
        "Hello Innovators",
        "Empower Yourself",
        "Innovate Your Future"
    ];

    const cyclingText = document.querySelector('.cycling-text');
    let currentIndex = 0;
    let currentText = '';
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Speed for typing
    let deletingSpeed = 50; // Speed for deleting
    let pauseTime = 2000; // Time to pause at complete text

    function typeText() {
        const fullText = texts[currentIndex];
        
        if (isDeleting) {
            // Deleting text
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = deletingSpeed;
        } else {
            // Typing text
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        cyclingText.textContent = currentText;

        if (!isDeleting && charIndex === fullText.length) {
            // Pause at complete text
            typingSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            currentIndex = (currentIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before starting next text
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start the typing animation
    typeText();

    // Remove the previous interval and transition styles
    cyclingText.style.transition = 'none';
}); 