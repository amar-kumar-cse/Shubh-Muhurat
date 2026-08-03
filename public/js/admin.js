document.addEventListener('DOMContentLoaded', () => {
    initAdmin();
});

const adminState = {
    token: localStorage.getItem('adminToken') || '',
    user: JSON.parse(localStorage.getItem('adminUser') || 'null')
};

function setSession(token, user) {
    adminState.token = token;
    adminState.user = user;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
}

function clearSession() {
    adminState.token = '';
    adminState.user = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
}

function initAdmin() {
    bindAuth();
    syncSessionUI();
    if (adminState.token) {
        loadAdminData();
    }
}

function bindAuth() {
    document.getElementById('login-btn')?.addEventListener('click', async () => {
        try {
            const username = document.getElementById('admin-username').value.trim();
            const password = document.getElementById('admin-password').value;
            const result = await API.login(username, password);
            setSession(result.data.token, result.data.user);
            syncSessionUI();
            loadAdminData();
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('logout-btn')?.addEventListener('click', () => {
        clearSession();
        syncSessionUI();
    });

    document.getElementById('menu-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        await API.createMenuItem({
            name: form.get('name'),
            description: form.get('description'),
            category: form.get('category'),
            menuType: form.get('menuType'),
            price: Number(form.get('price')),
            isVegetarian: true,
            isAvailable: true
        }, adminState.token);
        event.target.reset();
        loadAdminData();
    });
}

function syncSessionUI() {
    document.getElementById('login-panel')?.classList.toggle('hidden', Boolean(adminState.token));
    document.getElementById('session-panel')?.classList.toggle('hidden', !adminState.token);
    const label = document.getElementById('admin-label');
    if (label) {
        label.textContent = adminState.user?.username || 'admin';
    }
}

async function loadAdminData() {
    const [bookings, menu, testimonials, inquiries] = await Promise.all([
        API.getBookings({ limit: 20 }, adminState.token),
        API.getMenu({ limit: 20 }),
        API.getTestimonialsAdmin({ limit: 20 }, adminState.token),
        API.getContactInquiries({ limit: 20 }, adminState.token)
    ]);

    document.getElementById('booking-count').textContent = bookings.data.length;
    document.getElementById('menu-count').textContent = menu.data.length;
    document.getElementById('testimonial-count').textContent = testimonials.data.length;
    document.getElementById('inquiry-count').textContent = inquiries.data.length;

    renderBookings(bookings.data);
    renderMenu(menu.data);
    renderTestimonials(testimonials.data);
    renderInquiries(inquiries.data);
}

function renderBookings(items) {
    document.getElementById('bookings-list').innerHTML = items.map(item => `
        <div class="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div>
                <div class="font-semibold">${item.name} <span class="text-slate-500 font-normal">(${item.status})</span></div>
                <div class="text-slate-500">${new Date(item.date).toLocaleDateString()} · ${item.venue || 'No venue'}</div>
            </div>
            <select data-id="${item._id}" class="booking-status px-3 py-2 rounded-xl border border-slate-200">
                ${['Pending', 'Confirmed', 'Cancelled', 'Completed'].map(status => `<option value="${status}" ${status === item.status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
        </div>
    `).join('');

    document.querySelectorAll('.booking-status').forEach(select => {
        select.addEventListener('change', async () => {
            await API.updateBooking(select.dataset.id, { status: select.value }, adminState.token);
            loadAdminData();
        });
    });
}

function renderMenu(items) {
    document.getElementById('menu-list').innerHTML = items.map(item => `
        <div class="rounded-2xl border border-slate-200 p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
                <div>
                    <div class="font-semibold">${item.name}</div>
                    <div class="text-slate-500 text-xs">${item.category} · ₹${item.price}</div>
                </div>
                <button data-delete="${item._id}" class="text-red-600 text-sm font-semibold">Delete</button>
            </div>
            <input type="file" data-upload="${item._id}" accept="image/*" class="text-sm">
        </div>
    `).join('');

    document.querySelectorAll('[data-delete]').forEach(button => {
        button.addEventListener('click', async () => {
            await API.deleteMenuItem(button.dataset.delete, adminState.token);
            loadAdminData();
        });
    });

    document.querySelectorAll('[data-upload]').forEach(input => {
        input.addEventListener('change', async () => {
            if (!input.files[0]) return;
            await API.uploadMenuImage(input.dataset.upload, input.files[0], adminState.token);
            loadAdminData();
        });
    });
}

function renderTestimonials(items) {
    document.getElementById('testimonial-list').innerHTML = items.map(item => `
        <div class="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div>
                <div class="font-semibold">${item.name} <span class="text-slate-500 font-normal">(${item.isApproved ? 'Approved' : 'Pending'})</span></div>
                <div class="text-slate-500">Rating: ${item.rating}/5</div>
            </div>
            <button data-testimonial="${item._id}" class="text-brand-orange text-sm font-semibold">Approve</button>
        </div>
    `).join('');

    document.querySelectorAll('[data-testimonial]').forEach(button => {
        button.addEventListener('click', async () => {
            await API.updateTestimonial(button.dataset.testimonial, { isApproved: true }, adminState.token);
            loadAdminData();
        });
    });
}

function renderInquiries(items) {
    document.getElementById('inquiry-list').innerHTML = items.map(item => `
        <div class="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-3">
            <div>
                <div class="font-semibold">${item.name}</div>
                <div class="text-slate-500">${item.subject}</div>
            </div>
            <select data-inquiry="${item._id}" class="inquiry-status px-3 py-2 rounded-xl border border-slate-200">
                ${['New', 'Read', 'In Progress', 'Resolved', 'Closed'].map(status => `<option value="${status}" ${status === item.status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
        </div>
    `).join('');

    document.querySelectorAll('.inquiry-status').forEach(select => {
        select.addEventListener('change', async () => {
            await API.updateContactInquiry(select.dataset.inquiry, { status: select.value }, adminState.token);
            loadAdminData();
        });
    });
}