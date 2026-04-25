# 🍽️ Shubh Muhurat — Catering Management System

A production-ready backend system built to digitize and automate catering business workflows. Handles everything from bookings and menu management to customer inquiries and testimonials — all through clean REST APIs.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

---

## 🚀 Features

- **Booking Management** — Create, track, and manage catering bookings with status updates (Pending → Confirmed → Completed)
- **Menu Management** — Full menu CRUD with categories, vegetarian filters, pricing, and availability control
- **Customer Testimonials** — Admin approval system for reviews with featured testimonial support
- **Contact & Inquiries** — Priority-based inquiry tracking with status management (New → In Progress → Resolved)
- **Booking Statistics** — Real-time stats dashboard for business insights
- **Pagination & Filtering** — All endpoints support pagination, date range filters, and status filters
- **WhatsApp Notifications** — Automated booking confirmation messages via WhatsApp API

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| API Style | RESTful |
| Notifications | WhatsApp API |

---

## 📁 Project Structure

```
shubh-muhurat/
├── controllers/        # Business logic for each module
│   ├── bookingController.js
│   ├── menuController.js
│   ├── testimonialController.js
│   └── contactController.js
├── models/             # MongoDB schemas
├── routes/             # API route definitions
├── middleware/         # Auth & error handling
├── public/             # Static frontend files
├── seedData.js         # Database seeding script
└── server.js           # App entry point
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/amar-kumar-cse/Shubh-Muhurat.git
cd Shubh-Muhurat

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI

# Seed the database with sample data
npm run seed

# Start the server
npm start
```

Server runs at `http://localhost:3000`

---

## 📡 API Overview

Base URL: `http://localhost:3000/api`

| Module | Endpoint | Methods |
|---|---|---|
| Bookings | `/api/bookings` | GET, POST, PUT, DELETE |
| Menu | `/api/menu` | GET, POST, PUT, DELETE |
| Testimonials | `/api/testimonials` | GET, POST, PUT, DELETE |
| Contact | `/api/contact` | GET, POST, PUT, DELETE |
| Health | `/api/health` | GET |

### Sample Request — Create Booking

```bash
POST /api/bookings
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 9876543210",
  "eventType": "Wedding",
  "guests": 300,
  "date": "2026-06-20",
  "requests": "Pure vegetarian menu"
}
```

### Sample Response

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Rahul Sharma",
    "eventType": "Wedding",
    "status": "Pending",
    "guests": 300
  }
}
```

> 📄 Full API docs: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📊 Data Models

**Event Types:** Wedding · Corporate Event · Birthday Party · Anniversary · Private Party

**Booking Status:** `Pending` → `Confirmed` → `Completed` · `Cancelled`

**Menu Categories:** Appetizers · Main Course · Breads & Rice · Desserts · Beverages

**Menu Types:** Regular · Shaadi (Wedding) · Corporate

---

## 🌱 Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/shubh_muhurat
PORT=3000
WHATSAPP_API_KEY=your_whatsapp_api_key
```

---

## 👨‍💻 Author

**Amar Kumar**
- GitHub: [@amar-kumar-cse](https://github.com/amar-kumar-cse)
- LinkedIn: [linkedin.com/in/amarkumarr](https://linkedin.com/in/amarkumarr)
