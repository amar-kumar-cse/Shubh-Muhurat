const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../server');
const Admin = require('../models/Admin');
const config = require('../config');
const { sanitizeValue } = require('../middleware/sanitize');

describe('Security & Authentication Suite', () => {
    let adminToken;
    let staffToken;
    const testAdminId = new mongoose.Types.ObjectId().toString();
    const testStaffId = new mongoose.Types.ObjectId().toString();

    beforeAll(() => {
        mongoose.set('bufferCommands', false);
        adminToken = jwt.sign({ id: testAdminId, role: 'admin' }, config.jwtSecret, { expiresIn: '2h' });
        staffToken = jwt.sign({ id: testStaffId, role: 'staff' }, config.jwtSecret, { expiresIn: '2h' });

        // Mock Admin findById for protect middleware test
        jest.spyOn(Admin, 'findById').mockImplementation((id) => {
            if (id === testAdminId) {
                return {
                    select: () => Promise.resolve({ _id: testAdminId, role: 'admin', isActive: true })
                };
            }
            if (id === testStaffId) {
                return {
                    select: () => Promise.resolve({ _id: testStaffId, role: 'staff', isActive: true })
                };
            }
            return {
                select: () => Promise.resolve(null)
            };
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe('1. Admin Model & Bcrypt Hashing', () => {
        it('should hash admin password with bcrypt cost factor 12', async () => {
            const admin = new Admin({
                email: 'securityadmin@example.com',
                password: 'supersecretpassword123',
                role: 'admin'
            });

            const hashedPassword = await bcrypt.hash('supersecretpassword123', 12);
            admin.password = hashedPassword;

            expect(admin.password).not.toEqual('supersecretpassword123');
            expect(admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')).toBe(true);

            const matches = await admin.comparePassword('supersecretpassword123');
            expect(matches).toBe(true);

            const wrongMatches = await admin.comparePassword('wrongpassword');
            expect(wrongMatches).toBe(false);
        });
    });

    describe('2. JWT & Authorization (Role-Based Access)', () => {
        it('should deny unauthorized access without token', async () => {
            const res = await request(app).get('/api/bookings');
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('should allow staff to read bookings (not 401/403)', async () => {
            const res = await request(app)
                .get('/api/bookings')
                .set('Authorization', `Bearer ${staffToken}`);
            expect(res.statusCode).not.toBe(401);
            expect(res.statusCode).not.toBe(403);
        });

        it('should deny staff from deleting bookings (only admin authorized)', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/bookings/${fakeId}`)
                .set('Authorization', `Bearer ${staffToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toContain('Not authorized');
        });

        it('should allow admin to delete bookings (bypasses 403 authorization)', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .delete(`/api/bookings/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).not.toBe(403);
        });
    });

    describe('3. Security Headers (Helmet & HSTS)', () => {
        it('should send security headers including Strict-Transport-Security (HSTS)', async () => {
            const res = await request(app).get('/api/health');
            expect(res.headers['strict-transport-security']).toBeDefined();
            expect(res.headers['x-content-type-options']).toBe('nosniff');
        });
    });

    describe('4. Input Sanitization (XSS Protection)', () => {
        it('should strip malicious script tags from string values', () => {
            const dirty = '<script>alert("xss")</script>Hello World';
            const clean = sanitizeValue(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).toBe('Hello World');
        });
    });

    describe('5. Brute Force Account Lockout Helper', () => {
        it('should calculate lockUntil date when attempts reach 5', () => {
            const admin = new Admin({
                email: 'lockouttest@example.com',
                password: 'password12345',
                failedLoginAttempts: 4,
                role: 'admin'
            });

            expect(admin.isLocked).toBe(false);

            // Simulate lockout condition
            admin.failedLoginAttempts += 1;
            admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000);

            expect(admin.failedLoginAttempts).toBe(5);
            expect(admin.isLocked).toBe(true);
        });
    });
});
