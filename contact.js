document.addEventListener('DOMContentLoaded', () => {
    // Use EmailJS Configuration from config file
    const config = window.EMAILJS_CONFIG || {
        serviceID: 'YOUR_SERVICE_ID',
        templateID: 'YOUR_TEMPLATE_ID', 
        publicKey: 'YOUR_PUBLIC_KEY'
    };

    // Initialize EmailJS
    emailjs.init(config.publicKey);

    // Contact Form Animations
    const contactTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    contactTimeline
        .from('.contact-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.contact-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.contact-form', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

    // Enhanced Form Validation
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Form validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            message: 'Subject must be between 5-100 characters'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            message: 'Message must be between 10-1000 characters'
        }
    };

    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        field.addEventListener('input', () => validateField(field, formGroup, errorMessage));
        field.addEventListener('blur', () => validateField(field, formGroup, errorMessage));
    });

    // Character counter for message field
    const messageField = document.getElementById('message');
    const charCount = document.querySelector('.char-count');
    
    messageField.addEventListener('input', () => {
        const length = messageField.value.length;
        const maxLength = 1000;
        charCount.textContent = `${length}/${maxLength}`;
        
        charCount.className = 'char-count';
        if (length > maxLength * 0.8) {
            charCount.classList.add('warning');
        }
        if (length >= maxLength) {
            charCount.classList.add('error');
        }
    });

    // Validate individual field
    function validateField(field, formGroup, errorMessage) {
        const rules = validationRules[field.name];
        const value = field.value.trim();
        
        // Clear previous states
        formGroup.classList.remove('error', 'success');
        
        // Check if field is required and empty
        if (rules.required && !value) {
            showFieldError(formGroup, errorMessage, `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required`);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value) return true;
        
        // Check minimum length
        if (rules.minLength && value.length < rules.minLength) {
            showFieldError(formGroup, errorMessage, rules.message);
            return false;
        }
        
        // Check maximum length
        if (rules.maxLength && value.length > rules.maxLength) {
            showFieldError(formGroup, errorMessage, rules.message);
            return false;
        }
        
        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showFieldError(formGroup, errorMessage, rules.message);
            return false;
        }
        
        // Field is valid
        formGroup.classList.add('success');
        return true;
    }

    function showFieldError(formGroup, errorMessage, message) {
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }

    // Validate entire form
    function validateForm() {
        let isValid = true;
        
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const formGroup = field.closest('.form-group');
            const errorMessage = formGroup.querySelector('.error-message');
            
            if (!validateField(field, formGroup, errorMessage)) {
                isValid = false;
            }
        });
        
        // Check honeypot (spam protection)
        const honeypot = document.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            isValid = false;
        }
        
        return isValid;
    }

    // Form submission with enhanced validation
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            showNotification('Please fix the errors above before submitting.', 'error');
            return;
        }
        
        // Check for spam (honeypot)
        const honeypot = document.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            showNotification('Spam detected. Please try again.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(contactForm);
        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_email: 'dsc@abesec.ac.in',
            reply_to: formData.get('email'),
            timestamp: new Date().toLocaleString()
        };
        
        // Add loading state to button
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                config.serviceID,
                config.templateID,
                templateParams
            );
            
            console.log('Email sent successfully:', response);
            
            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            
            // Reset form and validation states
            contactForm.reset();
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error', 'success');
            });
            
            // Reset character counter
            charCount.textContent = '0/1000';
            charCount.className = 'char-count';
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            let errorMessage = 'Failed to send message. Please try again.';
            if (error.status === 400) {
                errorMessage = 'Please check your message and try again.';
            } else if (error.status === 401) {
                errorMessage = 'Service temporarily unavailable. Please try again later.';
            } else if (error.status === 429) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Notification System
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            padding: 1rem 2rem;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            transform: translateX(120%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid #34A853;
        }
        
        .notification.error {
            border-left: 4px solid #EA4335;
        }
        
        .notification i {
            font-size: 1.2rem;
        }
        
        .notification.success i {
            color: #34A853;
        }
        
        .notification.error i {
            color: #EA4335;
        }
    `;
    document.head.appendChild(style);
}); 