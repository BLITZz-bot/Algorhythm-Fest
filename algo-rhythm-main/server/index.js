const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || !process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Persistent Storage Confirmation
console.log(`📁 Persistent screenshot storage initialized at: ${path.join(__dirname, 'uploads')}`);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error("CRITICAL ERROR: MONGODB_URI is not defined in .env");
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('Connected to MongoDB Successfully!'))
        .catch(err => console.error('MongoDB Connection Error:', err));
}

// Ensure directories exist for locally stored screenshots
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Define Registration Schema
const registrationSchema = new mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    eventTitle: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    teamMembers: [{
        fullName: String,
        email: String,
        phone: String
    }],
    transactionId: { type: String, default: 'N/A' },
    screenshotPath: { type: String, default: null }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Define Event Status Schema (For Open/Close Toggles)
const eventStatusSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    isOpen: { type: Boolean, default: true }
});
const EventStatus = mongoose.model('EventStatus', eventStatusSchema);
// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
app.post('/api/register', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { fullName, email, phone, college, transactionId, eventTitle, teamMembers } = req.body;

        const newRegistration = new Registration({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            eventTitle,
            fullName,
            email,
            phone,
            college,
            teamMembers: teamMembers ? JSON.parse(teamMembers) : [],
            transactionId: transactionId || "N/A",
            screenshotPath: req.file ? req.file.filename : null
        });

        await newRegistration.save();
        console.log(`New registration received (DB) for ${eventTitle} by ${fullName}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: newRegistration
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});

// Lookup registrations by email
app.get('/api/registrations/:email', async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();
        const userRegistrations = await Registration.find({
            email: { $regex: new RegExp("^" + email + "$", "i") }
        });

        if (userRegistrations.length === 0) {
            return res.status(404).json({ success: false, message: 'No registrations found for this email address.' });
        }

        res.status(200).json({
            success: true,
            data: userRegistrations
        });
    } catch (error) {
        console.error("Lookup error:", error);
        res.status(500).json({ success: false, message: 'Server error during lookup' });
    }
});

// Serve uploaded UI locally (Host backend on persistent storage server)
app.use('/uploads', express.static(uploadDir));

// Admin registrations lookup
app.get('/api/admin/registrations', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const registrations = await Registration.find().sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: registrations.length,
            data: registrations
        });
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        res.status(500).json({ success: false, message: 'Server error during admin fetch' });
    }
});

// Get all event statuses (Public)
app.get('/api/events/status', async (req, res) => {
    try {
        const statuses = await EventStatus.find({});
        res.status(200).json({ success: true, data: statuses });
    } catch (error) {
        console.error("Fetch Status Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching event statuses' });
    }
});

// Toggle event status (Admin)
app.post('/api/admin/events/toggle', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { eventTitle, isOpen } = req.body;

        const updatedEvent = await EventStatus.findOneAndUpdate(
            { title: eventTitle },
            { isOpen: isOpen },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedEvent, message: `Event ${isOpen ? 'Opened' : 'Closed'} Successfully` });
    } catch (error) {
        console.error("Toggle Error:", error);
        res.status(500).json({ success: false, message: 'Server error toggling event' });
    }
});

// Automated Email Report Endpoint
app.post('/api/admin/send-report', async (req, res) => {
    console.log("--- New Email Report Request Received ---");
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const registrations = await Registration.find().sort({ eventTitle: 1 });

        if (registrations.length === 0) {
            return res.status(404).json({ success: false, message: 'No data to send' });
        }

        // 1. Create Excel Workbook
        const workbook = new ExcelJS.Workbook();
        const grouped = registrations.reduce((acc, curr) => {
            const title = curr.eventTitle || "Uncategorized";
            if (!acc[title]) acc[title] = [];
            acc[title].push(curr);
            return acc;
        }, {});

        Object.keys(grouped).sort().forEach(eventTitle => {
            const sheetName = eventTitle.substring(0, 31).replace(/[\\\?\*\[\]\/]/g, "");
            const worksheet = workbook.addWorksheet(sheetName);
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 15 },
                { header: 'Timestamp', key: 'timestamp', width: 22 },
                { header: 'Full Name', key: 'fullName', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'College', key: 'college', width: 30 },
                { header: 'UTR', key: 'transactionId', width: 20 },
                { header: 'Team Members', key: 'teamMembers', width: 40 },
                { header: 'Screenshot Proof', key: 'screenshot', width: 50 },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '9333EA' } };

            grouped[eventTitle].forEach(reg => {
                const row = worksheet.addRow({
                    id: reg.id,
                    timestamp: new Date(reg.timestamp).toLocaleString(),
                    fullName: reg.fullName,
                    email: reg.email,
                    phone: reg.phone,
                    college: reg.college,
                    transactionId: reg.transactionId,
                    teamMembers: reg.teamMembers?.map(m => `${m.fullName} (${m.email}, ${m.phone})`).join(" | ") || "N/A",
                    screenshot: reg.screenshotPath ? `http://localhost:5000/uploads/${reg.screenshotPath}` : "N/A"
                });

                if (reg.screenshotPath) {
                    const linkCell = row.getCell('screenshot');
                    // In production, localhost should be replaced with the actual domain link
                    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
                    linkCell.value = {
                        text: 'Link to Screenshot',
                        hyperlink: `${baseUrl}/uploads/${reg.screenshotPath}`
                    };
                    linkCell.font = { color: { argb: '2563EB' }, underline: true };
                }
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: process.env.ADMIN_RECEIVER_EMAIL,
            subject: `AlgoRhythm Fest 2026 - Master Registration Report (${new Date().toLocaleDateString()})`,
            text: `Hello Admin,\n\nPlease find the attached automated registration report for AlgoRhythm Fest 2026.\n\nTotal Registrations from DB: ${registrations.length}\nGenerated at: ${new Date().toLocaleString()}`,
            attachments: [
                {
                    filename: `AlgoRhythm_Master_Report_${Date.now()}.xlsx`,
                    content: buffer
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Report emailed successfully!' });

    } catch (error) {
        console.error("Email Automation Error:", error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

