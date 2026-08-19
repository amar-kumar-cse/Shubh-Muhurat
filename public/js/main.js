/**
 * Main Application Logic – Premium Level 5
 * Counter animations, scroll reveals, 3D tilt
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const state = {
    currentMenuType: 'Wedding Menu',
    categories: [],
    selectedBookingDate: ''
};

const MENU_PAGE_MAP = {
    'Wedding Menu': 'wedding-menu.html',
    'Engagement Menu': 'engagement-menu.html',
    'Birthday Menu': 'birthday-menu.html',
    'Anniversary Menu': 'anniversary-menu.html',
    'Corporate Menu': 'corporate-menu.html',
    'Private Party Menu': 'private-party-menu.html',
    'House Warming Menu': 'house-warming-menu.html'
};

function initApp() {
    init3DTilt();
    setupMobileMenu();
    setupScrollEffects();
    setupScrollReveal();
    setupCounterAnimation();
    loadMenu('Wedding Menu');
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
async function loadMenu(type = 'Wedding Menu') {
    state.currentMenuType = type;
    const container = document.getElementById('menu-container');
    const tabButtons = document.querySelectorAll('.menu-tab');

    // Update CTA button for dedicated page
    const btnLink = document.getElementById('view-full-menu-btn');
    const btnText = document.getElementById('view-full-menu-text');
    if (btnLink && MENU_PAGE_MAP[type]) {
        btnLink.href = MENU_PAGE_MAP[type];
    }
    if (btnText) {
        btnText.textContent = `View Full ${type.replace(' Menu', '')} Menu with Pricing`;
    }

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
        initBookingAvailability(bookingForm);

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

async function initBookingAvailability(bookingForm) {
    const calendarContainer = document.getElementById('booking-availability');
    const dateInput = bookingForm.querySelector('input[name="date"]');

    if (!calendarContainer || !dateInput || typeof API === 'undefined') {
        return;
    }

    const renderCalendar = async (monthDate) => {
        const year = monthDate.getFullYear();
        const monthIndex = monthDate.getMonth();
        const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        let bookedDates = [];

        try {
            const result = await API.getBookingAvailability(monthKey);
            bookedDates = (result.data.bookedDates || []).map(item => new Date(item.date).toISOString().slice(0, 10));
        } catch (error) {
            bookedDates = [];
        }

        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const startOffset = firstDay.getDay();
        const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;
        const cells = [];

        for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
            const dayNumber = cellIndex - startOffset + 1;
            if (cellIndex < startOffset || dayNumber > lastDay.getDate()) {
                cells.push('<div class="h-10 rounded-lg bg-gray-100"></div>');
                continue;
            }

            const isoDate = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
            const isBusy = bookedDates.includes(isoDate);
            const isSelected = dateInput.value === isoDate;
            cells.push(`
                <button type="button" data-date="${isoDate}" class="h-10 rounded-lg text-sm font-semibold border transition-all ${isBusy ? 'bg-red-100 text-red-700 border-red-200 cursor-not-allowed' : isSelected ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'}">
                    ${dayNumber}
                </button>
            `);
        }

        calendarContainer.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <button type="button" data-nav="prev" class="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">Prev</button>
                <h4 class="font-bold text-gray-900">${monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <button type="button" data-nav="next" class="px-3 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">Next</button>
            </div>
            <div class="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div class="grid grid-cols-7 gap-2">${cells.join('')}</div>
            <p class="mt-3 text-xs text-gray-500">Red dates are busy and cannot be selected.</p>
        `;

        calendarContainer.querySelectorAll('button[data-date]').forEach((button) => {
            button.addEventListener('click', () => {
                if (button.disabled || button.classList.contains('cursor-not-allowed')) {
                    return;
                }
                dateInput.value = button.dataset.date;
                state.selectedBookingDate = button.dataset.date;
                renderCalendar(monthDate);
            });
        });

        calendarContainer.querySelector('button[data-nav="prev"]').addEventListener('click', () => {
            renderCalendar(new Date(year, monthIndex - 1, 1));
        });

        calendarContainer.querySelector('button[data-nav="next"]').addEventListener('click', () => {
            renderCalendar(new Date(year, monthIndex + 1, 1));
        });
    };

    await renderCalendar(new Date());
}

// Expose functions globally
window.loadMenu = loadMenu;
