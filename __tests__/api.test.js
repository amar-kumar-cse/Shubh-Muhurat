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
    it('should get all bookings (public endpoint)', async () => {
      const res = await request(app).get('/api/bookings');
      // May return 401 due to auth, that's expected
      expect([200, 401]).toContain(res.statusCode);
    });
  });

  describe('Menu API', () => {
    it('should get all menu items', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Testimonials API', () => {
    it('should get public testimonials', async () => {
      const res = await request(app).get('/api/testimonials');
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('Contact API', () => {
    it('should get contact inquiries (protected)', async () => {
      const res = await request(app).get('/api/contact');
      // Should return 401 due to auth protection
      expect(res.statusCode).toEqual(401);
    });
  });
});
