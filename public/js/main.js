/**
 * Main Application Logic – Premium Level 5
 * Counter animations, scroll reveals, 3D tilt
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const state = {
    currentMenuType: 'Birthday Menu',
    categories: []
};

function initApp() {
    init3DTilt();
    setupMobileMenu();
    setupScrollEffects();
    setupScrollReveal();
    setupCounterAnimation();
    loadMenu('Birthday Menu');
    loadTestimonials();
    setupForms();
}

/* ========================
   3D Tilt Effect
   ======================== */
function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d, .service-card');
    cards.forEach(card => {
        // Remove old listeners by cloning (prevents stacking)
        const newCard = card;
        newCard.addEventListener('mousemove', (e) => {
            const rect = newCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xRotation = -((y - rect.height / 2) / rect.height * 8);
            const yRotation = ((x - rect.width / 2) / rect.width * 8);
            newCard.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
        newCard.addEventListener('mouseleave', () => {
            newCard.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
        });
    });
}
window.init3DTilt = init3DTilt;

/* ========================
   Mobile Menu
   ======================== */
function setupMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('open');
            const icon = btn.querySelector('i');
            if (menu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                btn.querySelector('i').classList.remove('fa-times');
                btn.querySelector('i').classList.add('fa-bars');
            });
        });
    }
}

/* ========================
   Navbar Scroll Effects
   ======================== */
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-lg', 'bg-white/90', 'backdrop-blur-md');
            navbar.style.height = '64px';
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.height = '80px';
        }
    });
}

/* ========================
   Scroll Reveal (Intersection Observer)
   ======================== */
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve – keeps it visible after first reveal
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal-section').forEach(el => observer.observe(el));
}

/* ========================
   Counter Animation
   ======================== */
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quad
                        const ease = 1 - (1 - progress) * (1 - progress);
                        const current = Math.floor(ease * target);
                        counter.textContent = current.toLocaleString() + (target >= 99 ? '+' : '+');
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }
                    requestAnimationFrame(update);
                });
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ========================
   Menu Loading
   ======================== */
async function loadMenu(type = 'Birthday Menu') {
    state.currentMenuType = type;
    const container = document.getElementById('menu-container');
    const tabButtons = document.querySelectorAll('.menu-tab');

    // Update Tabs
    tabButtons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('bg-brand-orange', 'text-white', 'shadow-lg', 'border-brand-orange', 'scale-105');
            btn.classList.remove('bg-white', 'text-gray-600', 'hover:bg-gray-50');
        } else {
            btn.classList.remove('bg-brand-orange', 'text-white', 'shadow-lg', 'border-brand-orange', 'scale-105');
            btn.classList.add('bg-white', 'text-gray-600', 'hover:bg-gray-50');
        }
    });

    // Show Loading Skeletons
    if (container) {
        container.innerHTML = `
            <div class="col-span-full grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="h-80 skeleton rounded-2xl"></div>
                <div class="h-80 skeleton rounded-2xl"></div>
                <div class="h-80 skeleton rounded-2xl"></div>
            </div>
        `;

        try {
            const result = await API.getMenu({ menuType: type, limit: 100 });
            if (result.success) {
                UI.renderMenu(result.data, 'menu-container');
            }
        } catch (error) {
            console.error('Error loading menu:', error);
            container.innerHTML = '<div class="col-span-full text-center text-red-500 bg-red-50 p-6 rounded-2xl border border-red-100"><i class="fas fa-exclamation-triangle text-2xl mb-2 block"></i>Failed to load menu. Please make sure the server is running.</div>';
        }
    }
}

/* ========================
   Testimonials Loading
   ======================== */
async function loadTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (container) {
        try {
            const result = await API.getTestimonials({ limit: 10 });
            if (result.success) {
                UI.renderTestimonials(result.data, 'testimonials-container');
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }
}

/* ========================
   Form Handlers
   ======================== */
function setupForms() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';

            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };

            try {
                const result = await API.submitInquiry(formData);
                if (result.success) {
                    UI.showAlert('Message Sent!', 'Thank you for reaching out. Rakesh Kumar Yadav will contact you shortly.', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Failed to send');
                }
            } catch (error) {
                UI.showAlert('Oops!', error.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Booking...';

            const formData = {
                name: bookingForm.name.value,
                email: bookingForm.email.value,
                phone: bookingForm.phone.value,
                eventType: bookingForm.eventType.value,
                guests: parseInt(bookingForm.guests.value),
                date: bookingForm.date.value,
                requests: bookingForm.requests.value
            };

            try {
                const result = await API.createBooking(formData);
                if (result.success) {
                    UI.showAlert('Booking Confirmed! 🎉', `Thank you ${result.data.name}! Your request for ${new Date(result.data.date).toLocaleDateString()} has been placed. We will send a confirmation to ${result.data.email}.`, 'success');
                    bookingForm.reset();
                } else {
                    const errors = result.errors ? result.errors.join('\n') : result.message;
                    throw new Error(errors || 'Failed to book');
                }
            } catch (error) {
                UI.showAlert('Booking Failed', error.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
}

// Expose functions globally
window.loadMenu = loadMenu;
