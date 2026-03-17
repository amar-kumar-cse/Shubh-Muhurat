/**
 * UI Renderer – Premium Level 5
 * Handles dynamic content generation with polished rendering
 */

const UI = {
    // Helper: Create star rating HTML
    createStars: (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star text-yellow-400 drop-shadow-sm"></i>';
            } else {
                stars += '<i class="far fa-star text-gray-500"></i>';
            }
        }
        return stars;
    },    // Render Menu Items – Premium 3D Cards (No Prices)
    renderMenu: (items, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-12 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200"><i class="fas fa-utensils text-3xl mb-3 block text-gray-300"></i>No items found in this section.</div>';
            return;
        }

        const html = items.map((item, idx) => `
            <div class="menu-card-3d reveal-section" style="transition-delay: ${idx * 80}ms">
                <div class="card-3d menu-card-inner group">
                    <!-- Image Section -->
                    <div class="menu-card-img-wrap">
                        <div class="menu-card-img-overlay"></div>
                        <div class="menu-card-shine"></div>
                        <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}" 
                             onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'"
                             alt="${item.name}" 
                             loading="lazy"
                             class="menu-card-img">
                        
                        <!-- Category Badge -->
                        <div class="absolute bottom-3 left-3 z-20">
                            <span class="menu-card-badge">
                                ${item.category || item.menuType}
                            </span>
                        </div>

                        <!-- Dish Name on Image -->
                        <div class="absolute bottom-3 right-3 z-20">
                            ${item.isVegetarian
                                ? '<div class="veg-badge"><i class="fas fa-leaf"></i> VEG</div>'
                                : '<div class="nonveg-badge"><i class="fas fa-drumstick-bite"></i> NON-VEG</div>'}
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div class="menu-card-body">
                        <h3 class="menu-card-title">${item.name}</h3>
                        <p class="menu-card-desc">${item.description || 'Delicious freshly prepared dish, made with love.'}</p>
                        
                        <div class="menu-card-meta">
                            ${item.preparationTime ? `<span class="meta-item"><i class="fas fa-clock"></i> ${item.preparationTime} min</span>` : '<span></span>'}
                            ${item.spiceLevel && item.spiceLevel !== 'None' ? `<span class="meta-item meta-spice"><i class="fas fa-pepper-hot"></i> ${item.spiceLevel}</span>` : ''}
                        </div>
                    </div>

                    <!-- 3D Glow Border -->
                    <div class="menu-card-glow"></div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        // Trigger reveal animations with staggered timing
        requestAnimationFrame(() => {
            container.querySelectorAll('.reveal-section').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 60);
            });
        });

        // Re-initialize 3D tilt
        if (window.init3DTilt) window.init3DTilt();
    },

    // Render Testimonials – Glass Cards
    renderTestimonials: (testimonials, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (testimonials.length === 0) {
            container.innerHTML = '<div class="text-center text-white/70 py-10 w-full glass-dark rounded-2xl">No reviews yet. Be the first to review us!</div>';
            return;
        }

        const html = testimonials.map(testimonial => `
            <div class="glass-dark p-8 rounded-2xl shadow-2xl mx-2 my-2 flex-shrink-0 w-80 md:w-96 snap-center transform transition-all hover:scale-[1.03] hover:-translate-y-1 duration-300 relative overflow-hidden">
                <div class="absolute -top-2 -right-2 text-6xl text-brand-orange/10 font-serif pointer-events-none">"</div>
                
                <div class="flex items-center gap-4 mb-5 relative z-10">
                    <div class="bg-gradient-to-br from-brand-orange to-red-500 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                        ${testimonial.name.charAt(0)}
                    </div>
                    <div>
                        <h4 class="font-bold text-white text-base">${testimonial.name}</h4>
                        <div class="text-xs text-gray-400">${testimonial.location || ''}</div>
                    </div>
                </div>
                
                <div class="mb-4 flex items-center gap-1">
                    ${UI.createStars(testimonial.rating)}
                </div>
                
                <p class="text-gray-300 text-sm leading-relaxed italic relative z-10">"${testimonial.comment}"</p>
                
                ${testimonial.eventType ? `
                    <div class="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
                         <div class="text-xs font-bold text-brand-orange/80 uppercase tracking-wider bg-brand-orange/10 px-3 py-1 rounded-full">
                            ${testimonial.eventType}
                         </div>
                         <i class="fas fa-quote-right text-white/10 text-xl"></i>
                    </div>`
                : ''}
            </div>
        `).join('');

        container.innerHTML = html;
    },

    // Show Alert
    showAlert: (title, text, icon = 'success') => {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title,
                text,
                icon,
                background: '#fff',
                confirmButtonColor: '#ea961a',
                buttonsStyling: true,
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    confirmButton: 'px-6 py-2 rounded-full font-bold'
                }
            });
        } else {
            alert(`${title}: ${text}`);
        }
    }
};

window.UI = UI;
