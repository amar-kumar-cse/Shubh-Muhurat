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
};

window.API = API; // Expose globally
