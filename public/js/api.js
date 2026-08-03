/**
 * API Client Wrapper
 * Handles all backend communication with the Shubh Muhurat Caterer API.
 *
 * IMPORTANT POLICY ON MOCKS:
 *   - READ-ONLY calls (getMenu, getTestimonials, getCategories) MAY fall back
 *     to MOCK_DATA on localhost/127.0.0.1 so developers can work without a
 *     running server.
 *   - WRITE operations (createBooking, submitInquiry, submitTestimonial, etc.)
 *     NEVER use mock data. A network error must surface to the user so they
 *     know their request was NOT saved. Showing a fake success is worse than
 *     showing an honest error.
 */

const API_BASE_URL = '/api';

/** True only on a local dev machine */
const IS_DEV = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
);

/**
 * Thin fetch wrapper that:
 *  - Always awaits JSON parsing
 *  - Throws a descriptive Error (with .status) on non-2xx responses
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function apiFetch(url, options = {}) {
    let response;
    try {
        response = await fetch(url, options);
    } catch (networkError) {
        // Network-level failure (server down, no internet, etc.)
        throw new Error('Network error – please check your connection and try again.');
    }

    const data = await response.json().catch(() => ({
        success: false,
        message: `Unexpected server response (HTTP ${response.status})`
    }));

    if (!response.ok) {
        const message =
            (Array.isArray(data.errors) && data.errors.length)
                ? data.errors.join(', ')
                : (data.message || `Request failed (HTTP ${response.status})`);
        const err = new Error(message);
        err.status = response.status;
        err.data = data;
        throw err;
    }

    return data;
}

const API = {

    // ── MENU ──────────────────────────────────────────────────────────────────

    getMenu: async (params = {}) => {
        try {
            const qs = new URLSearchParams(params).toString();
            return await apiFetch(`${API_BASE_URL}/menu?${qs}`);
        } catch (error) {
            if (IS_DEV && typeof MOCK_DATA !== 'undefined') {
                console.warn('[DEV ONLY] getMenu fell back to mock data:', error.message);
                await new Promise(r => setTimeout(r, 300));
                return { success: true, data: MOCK_DATA.filterMenu(params) };
            }
            throw error;
        }
    },

    getCategories: async () => {
        try {
            return await apiFetch(`${API_BASE_URL}/menu/categories`);
        } catch (error) {
            if (IS_DEV) {
                return {
                    success: true,
                    data: ['Appetizers', 'Main Course', 'Breads & Rice', 'Desserts', 'Beverages']
                };
            }
            throw error;
        }
    },

    getMenuById: async (id) => {
        return await apiFetch(`${API_BASE_URL}/menu/${encodeURIComponent(id)}`);
    },

    /** Admin – requires token */
    createMenuItem: async (data, token) => {
        return await apiFetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
    },

    /** Admin – requires token */
    updateMenuItem: async (id, data, token) => {
        return await apiFetch(`${API_BASE_URL}/menu/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
    },

    /** Admin – requires token */
    deleteMenuItem: async (id, token) => {
        return await apiFetch(`${API_BASE_URL}/menu/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    },

    /** Admin – requires token */
    uploadMenuImage: async (id, file, token) => {
        const formData = new FormData();
        formData.append('image', file);
        return await apiFetch(`${API_BASE_URL}/menu/${encodeURIComponent(id)}/image`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData
        });
    },

    // ── TESTIMONIALS ──────────────────────────────────────────────────────────

    getTestimonials: async (params = {}) => {
        try {
            const qs = new URLSearchParams(params).toString();
            return await apiFetch(`${API_BASE_URL}/testimonials?${qs}`);
        } catch (error) {
            if (IS_DEV && typeof MOCK_DATA !== 'undefined') {
                console.warn('[DEV ONLY] getTestimonials fell back to mock data:', error.message);
                await new Promise(r => setTimeout(r, 300));
                return { success: true, data: MOCK_DATA.testimonials };
            }
            throw error;
        }
    },

    /**
     * ⚠️  WRITE – never mocked.
     * If this fails the error propagates to the UI so the user is informed.
     */
    submitTestimonial: async (data) => {
        return await apiFetch(`${API_BASE_URL}/testimonials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    /** Admin – requires token */
    getTestimonialsAdmin: async (params = {}, token) => {
        const qs = new URLSearchParams(params).toString();
        return await apiFetch(`${API_BASE_URL}/testimonials/admin?${qs}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    },

    /** Admin – requires token */
    updateTestimonial: async (id, data, token) => {
        return await apiFetch(`${API_BASE_URL}/testimonials/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
    },

    // ── BOOKINGS ──────────────────────────────────────────────────────────────

    /**
     * ⚠️  WRITE – never mocked.
     * This is a catering business: showing a fake "Booking Confirmed" when the
     * backend is down would cause real financial and reputational harm.
     */
    createBooking: async (data) => {
        return await apiFetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    getBookingAvailability: async (month) => {
        return await apiFetch(
            `${API_BASE_URL}/bookings/availability?month=${encodeURIComponent(month)}`
        );
    },

    trackBooking: async (trackingCode) => {
        return await apiFetch(
            `${API_BASE_URL}/bookings/track/${encodeURIComponent(trackingCode)}`
        );
    },

    /** Admin – requires token */
    getBookings: async (params = {}, token) => {
        const qs = new URLSearchParams(params).toString();
        return await apiFetch(`${API_BASE_URL}/bookings?${qs}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    },

    /** Admin – requires token */
    updateBooking: async (id, data, token) => {
        return await apiFetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
    },

    // ── CONTACT ───────────────────────────────────────────────────────────────

    /**
     * ⚠️  WRITE – never mocked.
     * Customer expects a real response. Fake success means their query is lost.
     */
    submitInquiry: async (data) => {
        return await apiFetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    /** Admin – requires token */
    getContactInquiries: async (params = {}, token) => {
        const qs = new URLSearchParams(params).toString();
        return await apiFetch(`${API_BASE_URL}/contact?${qs}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    },

    /** Admin – requires token */
    updateContactInquiry: async (id, data, token) => {
        return await apiFetch(`${API_BASE_URL}/contact/${encodeURIComponent(id)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
    },

    // ── AUTH ──────────────────────────────────────────────────────────────────

    login: async (email, password) => {
        return await apiFetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    },

    // ── QUOTES ────────────────────────────────────────────────────────────────

    createQuoteEstimate: async (data) => {
        return await apiFetch(`${API_BASE_URL}/quotes/estimate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
};

window.API = API;
