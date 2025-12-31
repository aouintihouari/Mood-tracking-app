# 🧠 MoodTracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-maintenance-orange.svg)

**MoodTracker** is a full-stack wellness application designed to help users track their daily mood, sleep patterns, and emotional well-being. Built with the MERN stack, it features secure authentication, data visualization, and a personalized dashboard.

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)

### Backend

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Services & Tools

![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-black?style=for-the-badge&logo=resend&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%2300C7B7.svg?style=for-the-badge&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

---

## ✨ Key Features

- **🔐 Secure Authentication:**
  - JWT-based auth using **HTTPOnly Cookies** (XSS protection).
  - Email verification flow using **Resend**.
  - Password reset functionality.
- **📊 Dynamic Dashboard:**
  - Visual trend charts for Mood & Sleep (Mobile responsive with horizontal scroll).
  - Calculated averages and trend indicators (Up/Down/Stable).
- **📝 Daily Check-ins:**
  - Multi-step modal to log mood, sleep hours, tags, and daily reflections.
  - Data aggregation for the last 7 days.
- **👤 User Profile:**
  - Avatar upload and storage via **Cloudinary**.
  - Image resizing and optimization using **Sharp**.
  - Profile update settings (Name & Photo).
- **📱 Responsive Design:**
  - Mobile-first approach using **Tailwind CSS**.
  - Custom UI components (Modals, Dropdowns, Cards).

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Resend Account (or Gmail SMTP)

### 1. Clone the repository

```bash
git clone [https://github.com/your-username/mood-tracker.git](https://github.com/your-username/mood-tracker.git)
cd mood-tracker
```

### 2. Backend Setup

Navigate to the server directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a .env file in the server folder:

```bash
PORT=5000
DATABASE=mongodb+srv://<your-mongo-uri>
DATABASE_PASSWORD=<your-db-password>

# JWT Config
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Frontend URL (For CORS and Email Links)
FRONTEND_URL=http://localhost:5173

# Email Service (Resend)
RESEND_API_KEY=re_123...
EMAIL_FROM=onboarding@resend.dev

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Start the server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies.

```bash
cd client
npm install
```

Create a .env file in the client folder:

```bash
# Point to your local backend
VITE_API_URL=http://localhost:5000/api/v1
```

Start the React app:

```bash
npm run dev
```

Visit http://localhost:5173 in your browser.

## 📁 Project Structure

```bash
mood-tracker/
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── api/ # Axios instance
│ │ ├── components/ # Reusable UI components (Charts, Modals, etc.)
│ │ ├── pages/ # Auth & Dashboard pages
│ │ ├── schemas/ # Zod validation schemas
│ │ └── utils/ # Helper functions
│ └── ...
│
└── server/ # Backend (Node.js + Express)
├── controllers/ # Request logic (Auth, User, CheckIn)
├── middlewares/ # Auth protection, Image upload (Multer)
├── models/ # Mongoose Models (User, CheckIn)
├── routes/ # API Routes
└── utils/ # Email, Cloudinary, Error handling
```

## 🛡️ Security Highlights

Cookie-based Auth: We do not store JWTs in LocalStorage to prevent XSS attacks.

Data Validation: All inputs are validated on the backend using Zod (via middlewares) and Mongoose schemas.

Password Hashing: Passwords are hashed using bcryptjs before storage.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
