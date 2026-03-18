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
