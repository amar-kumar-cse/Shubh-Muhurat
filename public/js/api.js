/**
 * API Client Wrapper
 * Handles all backend communication
 */

const API_BASE_URL = '/api';

const API = {
    // Menu
    getMenu: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/menu?${queryString}`);
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            console.warn('API failed, using mock data for menu');
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                success: true,
                data: MOCK_DATA.filterMenu(params)
            };
        }
    },

    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/menu/categories`);
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            return {
                success: true,
                data: ['Appetizers', 'Main Course', 'Breads & Rice', 'Desserts', 'Beverages']
            };
        }
    },

    getMenuById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    createMenuItem: async (data, token) => {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    updateMenuItem: async (id, data, token) => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    deleteMenuItem: async (id, token) => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    uploadMenuImage: async (id, file, token) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/menu/${id}/image`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    // Testimonials
    getTestimonials: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/testimonials?${queryString}`);
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            console.warn('API failed, using mock data for testimonials');
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                success: true,
                data: MOCK_DATA.testimonials
            };
        }
    },

    submitTestimonial: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            console.warn('API failed, mocking submission');
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                message: 'Testimonial submitted successfully (Mock)',
                data: data
            };
        }
    },

    // Bookings
    createBooking: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            console.warn('API failed, mocking booking');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                success: true,
                message: 'Booking created successfully (Mock)',
                data: { ...data, _id: 'mock_id_' + Date.now() }
            };
        }
    },

    // Contact
    submitInquiry: async (data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('API Error');
            return await response.json();
        } catch (error) {
            console.warn('API failed, mocking inquiry');
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                message: 'Inquiry sent successfully (Mock)',
                data: data
            };
        }
    }

    getBookingAvailability: async (month) => {
        const response = await fetch(`${API_BASE_URL}/bookings/availability?month=${encodeURIComponent(month)}`);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    trackBooking: async (trackingCode) => {
        const response = await fetch(`${API_BASE_URL}/bookings/track/${encodeURIComponent(trackingCode)}`);
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    getBookings: async (params = {}, token) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/bookings?${queryString}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    updateBooking: async (id, data, token) => {
        const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },
};

    getContactInquiries: async (params = {}, token) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/contact?${queryString}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    updateContactInquiry: async (id, data, token) => {
        const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    // Testimonials admin
    getTestimonialsAdmin: async (params = {}, token) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/testimonials/admin?${queryString}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    updateTestimonial: async (id, data, token) => {
        const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    },

    // Auth
    login: async (username, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Invalid credentials');
        return await response.json();
    },

    // Quotes
    createQuoteEstimate: async (data) => {
        const response = await fetch(`${API_BASE_URL}/quotes/estimate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    }
    ,submitInquiry: async (data) => {
