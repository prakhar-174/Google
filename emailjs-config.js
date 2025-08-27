// EmailJS Configuration File
// Replace the placeholder values with your actual EmailJS credentials

const EMAILJS_CONFIG = {
    // Your EmailJS Service ID (from EmailJS dashboard)
    serviceID: 'service_xxxxxxx',
    
    // Your EmailJS Template ID (from EmailJS dashboard)
    templateID: 'template_xxxxxxx',
    
    // Your EmailJS Public Key (from EmailJS dashboard)
    publicKey: 'xxxxxxxxxxxxxxx'
};

// Email template parameters mapping
const EMAIL_TEMPLATE_PARAMS = {
    from_name: '{{from_name}}',        // Sender's name
    from_email: '{{from_email}}',      // Sender's email
    subject: '{{subject}}',            // Email subject
    message: '{{message}}',            // Email message
    to_email: 'dsc@abesec.ac.in',     // Your email (where messages will be sent)
    reply_to: '{{reply_to}}'           // Reply-to email
};

// Export configuration for use in contact.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EMAILJS_CONFIG, EMAIL_TEMPLATE_PARAMS };
} else {
    window.EMAILJS_CONFIG = EMAILJS_CONFIG;
    window.EMAIL_TEMPLATE_PARAMS = EMAIL_TEMPLATE_PARAMS;
}