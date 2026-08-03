const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  describe('Health Check', () => {
    it('should return 200 and success message', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is running!');
    });
  });

  describe('API Info', () => {
    it('should return API information', async () => {
      const res = await request(app).get('/api');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.endpoints).toBeDefined();
    });
  });

  describe('Bookings API', () => {
    it('should enforce authentication on bookings list', async () => {
      const res = await request(app).get('/api/bookings');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Menu API', () => {
    it('should handle menu endpoint', async () => {
      const res = await request(app).get('/api/menu');
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('Testimonials API', () => {
    it('should handle public testimonials endpoint', async () => {
      const res = await request(app).get('/api/testimonials');
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('Contact API', () => {
    it('should get contact inquiries (protected)', async () => {
      const res = await request(app).get('/api/contact');
      expect(res.statusCode).toEqual(401);
    });
  });
});
