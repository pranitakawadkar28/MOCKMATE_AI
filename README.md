# MockMate AI 🚀

An intelligent, full-stack application designed to help users prepare for interviews through AI-powered mock sessions, resume analysis, and skill tracking.

## 🌟 Features

- **Secure Authentication:** User login and registration powered by JWT, bcrypt, and Passport.js (Google OAuth).
- **AI Mock Interviews:** (Core feature based on project naming) AI-driven interview practice.
- **Resume Processing:** Upload and analyze resumes using `pdfjs-dist`, and generate reports/resumes with `jspdf`.
- **Premium Subscriptions:** Integrated with **Razorpay** for handling premium user tiers and payments.
- **Performance Analytics:** Visual progress tracking using `recharts` and `react-circular-progressbar`.
- **Fast & Scalable:** Backend caching implemented with **Redis** to ensure quick response times.
- **Modern UI/UX:** Built with React, styled using **Tailwind CSS**, and enhanced with **Framer Motion** animations.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 (via Vite)
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Form Handling:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Caching:** Redis
- **Authentication:** JWT & Passport.js (Google OAuth2.0)
- **File Handling:** Multer
- **Payments:** Razorpay
- **Email Services:** Nodemailer

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)
- Redis Server

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd MOCKMATE_AI
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in the `Backend` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window.
```bash
cd Client
npm install
```
Create a `.env` file in the `Client` directory:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

## 📂 Project Structure

```
MOCKMATE_AI/
├── Backend/               # Node.js + Express backend
│   ├── src/               # Backend source code (controllers, models, routes)
│   ├── server.js          # Entry point
│   └── package.json       # Backend dependencies
└── Client/                # React frontend
    ├── public/            # Static assets
    ├── src/               # React components, pages, redux slices
    ├── vite.config.js     # Vite configuration
    └── package.json       # Frontend dependencies
```

## 📄 License
This project is licensed under the ISC License.
