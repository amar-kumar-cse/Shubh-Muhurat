# Shubh Muhurat Caterer - API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints Overview

- **Bookings**: `/api/bookings`
- **Menu**: `/api/menu`
- **Testimonials**: `/api/testimonials`
- **Contact**: `/api/contact`

---

## 🎯 Bookings API

### Get All Bookings
```
GET /api/bookings
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (Pending, Confirmed, Cancelled, Completed)
- `eventType` (optional): Filter by event type
- `dateFrom` (optional): Filter events from date (YYYY-MM-DD)
- `dateTo` (optional): Filter events to date (YYYY-MM-DD)

**Example:**
```
GET /api/bookings?status=Confirmed&page=1&limit=10
```

### Get Booking by ID
```
GET /api/bookings/:id
```

### Create New Booking
```
POST /api/bookings
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "eventType": "Wedding",
  "guests": 200,
  "date": "2026-05-15",
  "requests": "Vegetarian menu only"
}
```

### Update Booking
```
PUT /api/bookings/:id
Content-Type: application/json

{
  "status": "Confirmed",
  "totalAmount": 50000
}
```

### Delete Booking
```
DELETE /api/bookings/:id
```

### Get Booking Statistics
```
GET /api/bookings/stats
```

---

## 🍽️ Menu API

### Get All Menu Items
```
GET /api/menu
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 50)
- `category` (optional): Filter by category (Appetizers, Main Course, Breads & Rice, Desserts, Beverages)
- `menuType` (optional): Filter by menu type (Regular, Shaadi, Corporate)
- `isVegetarian` (optional): Filter vegetarian items (true/false)
- `isAvailable` (optional): Filter available items (true/false)
- `maxPrice` (optional): Filter by maximum price

**Example:**
```
GET /api/menu?category=Appetizers&isVegetarian=true
```

### Get Menu Item by ID
```
GET /api/menu/:id
```

### Create Menu Item
```
POST /api/menu
Content-Type: application/json

{
  "name": "Paneer Butter Masala",
  "description": "Rich and creamy paneer curry",
  "category": "Main Course",
  "menuType": "Regular",
  "price": 180,
  "isVegetarian": true,
  "spiceLevel": "Mild",
  "preparationTime": 35
}
```

### Update Menu Item
```
PUT /api/menu/:id
```

### Delete Menu Item
```
DELETE /api/menu/:id
```

### Get All Categories
```
GET /api/menu/categories
```

---

## ⭐ Testimonials API

### Get All Testimonials (Public - Approved Only)
```
GET /api/testimonials
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 10)
- `eventType` (optional): Filter by event type
- `rating` (optional): Minimum rating (1-5)
- `isFeatured` (optional): Filter featured testimonials (true/false)

### Get All Testimonials (Admin - All)
```
GET /api/testimonials/admin
```

**Query Parameters:**
- `isApproved` (optional): Filter by approval status (true/false)

### Get Testimonial by ID
```
GET /api/testimonials/:id
```

### Create Testimonial
```
POST /api/testimonials
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "rating": 5,
  "comment": "Excellent service and delicious food!",
  "eventType": "Wedding",
  "eventDate": "2025-12-20"
}
```

### Update Testimonial (Approve/Feature)
```
PUT /api/testimonials/:id
Content-Type: application/json

{
  "isApproved": true,
  "isFeatured": true
}
```

### Delete Testimonial
```
DELETE /api/testimonials/:id
```

### Get Average Rating
```
GET /api/testimonials/rating
```

---

## 📧 Contact API

### Get All Inquiries
```
GET /api/contact
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (New, Read, In Progress, Resolved, Closed)
- `priority` (optional): Filter by priority (Low, Medium, High, Urgent)

### Get Inquiry by ID
```
GET /api/contact/:id
```
*Note: Automatically marks status as 'Read' if it was 'New'*

### Create Contact Inquiry
```
POST /api/contact
Content-Type: application/json

{
  "name": "Alice Brown",
  "email": "alice@example.com",
  "phone": "+91 9876543210",
  "subject": "Catering Query",
  "message": "I would like to know about your corporate catering packages."
}
```

### Update Inquiry
```
PUT /api/contact/:id
Content-Type: application/json

{
  "status": "Resolved",
  "notes": "Called customer and provided quote"
}
```

### Delete Inquiry
```
DELETE /api/contact/:id
```

### Get Inquiry Statistics
```
GET /api/contact/stats
```

---

## 🔧 Utility Endpoints

### Health Check
```
GET /api/health
```

### API Information
```
GET /api
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error details"]
}
```

---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/shubh_muhurat
   PORT=3000
   ```

3. **Seed Database**
   ```bash
   npm run seed
   ```

4. **Start Server**
   ```bash
   npm start
   ```

5. **Test API**
   ```bash
   curl http://localhost:3000/api
   ```

---

## 📊 Data Models

### Event Types
- Wedding
- Corporate Event
- Birthday Party
- Anniversary
- Private Party
- Other

### Booking Status
- Pending
- Confirmed
- Cancelled
- Completed

### Contact Status
- New
- Read
- In Progress
- Resolved
- Closed

### Menu Categories
- Appetizers
- Main Course
- Breads & Rice
- Desserts
- Beverages

### Menu Types
- Regular
- Shaadi (Wedding)
- Corporate
