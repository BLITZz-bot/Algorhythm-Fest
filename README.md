<<<<<<< HEAD
# 🚀 Algorhythm Fest

Welcome to the official repository for **Algorhythm Fest**, a complete Full-Stack web application for event registration and management! 

This repository contains both the modern, interactive frontend (built with React and Vite) and the robust backend API (built with Node.js and Express).

---

## 📂 Repository Structure

The project is structured as a monorepo containing two main directories:

- **[`algorhythm-fest/`](./algorhythm-fest/)**: The interactive React frontend web application.
- **[`server/`](./server/)**: The Node.js and Express backend API for managing registrations.

---

## 🎨 Frontend (`algorhythm-fest/`)

The frontend is a beautifully designed, highly interactive web application built to showcase the event schedule, event details, and handle user registrations seamlessly.

### 🛠 Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS + Framer Motion (for smooth animations)
- **Visuals**: `react-tsparticles` (for dynamic particle backgrounds)
- **Utilities**: `jspdf`, `exceljs`, `html2canvas` (for receipt/combo pass generation and downloads)

### 🚀 Getting Started (Frontend)

1. Navigate to the frontend directory:
   ```bash
   cd algorhythm-fest
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## ⚙️ Backend (`server/`)

The backend is a secure and scalable API designed to manage student registrations, handle combo passes, send automated emails, and connect to the database.

### 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via `mongoose`)
- **File Uploads**: `multer`
- **Email Services**: `nodemailer`
- **Additional Tools**: `cors`, `dotenv`, `exceljs`

### 🚀 Getting Started (Backend)

1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `server` directory and add your required variables (e.g., MongoDB URI, Email credentials).
   
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

---

## ✨ Key Features

- **Interactive UI**: Engaging user interface with modern micro-animations using Framer Motion and dynamic particle backgrounds.
- **Seamless Registration Flow**: Users can register for individual events or select combo passes.
- **Automated Receipt Generation**: Generates PDF receipts and downloadable combo pass visual tickets dynamically.
- **Admin Capabilities**: Backend supports exporting registration lists via Excel and managing uploaded receipt images via Multer.
- **Responsive Design**: Fully responsive, mobile-first approach using Tailwind CSS.
=======
# 🚀 AlgoRhythm Fest 2026

**AlgoRhythm 3.0** is the official professional techno-cultural fest platform for Gopalan College of Engineering and Management (GCEM). This repository contains the complete frontend and backend infrastructure for event registrations, dynamic scheduling, and automated high-fidelity pass generation.

---

## 🌟 Key Features

### 🏆 Premium Event Dashboard
- **Dynamic Scheduling**: Real-time event updates and category-based filtering (Tech, Fun, Workshop).
- **Interactive UI**: Motion-enhanced experience powered by Framer Motion and Tailwind CSS.
- **Prize Pool Announcements**: Integrated showcase for event rewards and competitions.

### 🎟️ Automated Registration System
- **High-Fidelity PDF Passes**: Automated generation of dark-themed, premium access passes matching the website design.
- **Team Registration Support**: Multi-page PDF generation for team events with leader and member details.
- **Verification System**: Professional "VERIFIED" badge and automated transaction ID (UTR) tracking.
- **Deep-Link Integration**: Quick access to passes via automated Gmail confirmation links.

### 🛡️ Secure Backend Infrastructure
- **MongoDB Integration**: Robust data storage for thousands of participants.
- **Cloudinary Storage**: Secure, high-speed hosting for payment proof and screenshots.
- **SMTP Automation**: Reliable Gmail-based confirmation system with PDF attachments.
- **Admin Control**: Centralized dashboard for registration management and reporting.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React, jsPDF
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary, Nodemailer, PDFKit
- **DevOps**: GitHub, Vercel (Frontend), Render (Backend)

---

## 👨‍💻 Project Credit & Ownership

This project was envisioned and developed under the leadership of **[Bharatha01](https://github.com/BLITZz-bot)**. 

**Lead Developer & Visionary**: Bharatha01  
**Project Role**: Design Lead, Architecture, and Core Logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account
- Cloudinary Account
- Gmail account with App Password

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/BLITZz-bot/Algorhythm-Fest.git
   ```

2. **Initialize Frontend**
   ```bash
   cd algorhythm-fest
   npm install
   npm run dev
   ```

3. **Initialize Backend**
   ```bash
   cd server
   npm install
   node index.js
   ```

4. **Environment Setup**
   Create a `.env` file in both `algorhythm-fest` and `server` folders and add your credentials (MONGODB_URI, CLOUDINARY_URL, SENDER_EMAIL, etc.).

---

## 📄 License

This project is proprietary and built specifically for **AlgoRhythm Fest 2026**.

---

*“Coding the rhythm of the future.”* 🎶✨
>>>>>>> 0b84cf6 (Add secondary auth for Event Controls)
