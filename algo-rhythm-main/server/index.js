const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const dns = require('dns'); // Network workaround for restricted SRV DNS queries

const app = express();
const PORT = process.env.PORT || 5000;

// Trim config values to prevent hidden character issues
const SENDER_EMAIL = (process.env.SENDER_EMAIL || "").trim();
const SENDER_PASSWORD = (process.env.SENDER_PASSWORD || "").trim();
const ADMIN_RECEIVER_EMAIL = (process.env.ADMIN_RECEIVER_EMAIL || "").trim();
const BASE_URL = (process.env.BASE_URL || "").trim().replace(/\/$/, "");
const FRONTEND_URL = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");

// Middleware
const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, "")) : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Cleanup incoming origin for comparison
        const cleanOrigin = origin.replace(/\/$/, "");

        if (!process.env.FRONTEND_URL || allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.log(`CORS Blocked Origin: ${origin}. Allowed: ${allowedOrigins}`);
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
    const connectDB = async () => {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB Successfully!');
        } catch (err) {
            console.log('Initial connection failed, likely due to restrictive network DNS. Retrying with public DNS workaround...');
            try {
                dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
                await mongoose.connect(MONGODB_URI);
                console.log('Connected to MongoDB Successfully (Using Public DNS Fallback)!');
            } catch (errFallback) {
                console.error('MongoDB Connection Error:', errFallback);
            }
        }
    };
    connectDB();
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
    teamName: { type: String, default: null },
    teamMembers: [{
        fullName: String,
        email: String,
        phone: String
    }],
    transactionId: { type: String, default: 'N/A' },
    paymentDate: { type: String, default: 'N/A' },
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

// Root Route for Health Checks (Render Compatibility)
app.get('/', (req, res) => {
    res.status(200).send('AlgoRhythm Fest API is Online 🚀');
});

// Routes
app.post('/api/register', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { fullName, email, phone, college, teamName, transactionId, paymentDate, eventTitle, teamMembers } = req.body;

        const newRegistration = new Registration({
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            eventTitle,
            fullName,
            email,
            phone,
            college,
            teamName: teamName || null,
            teamMembers: teamMembers ? JSON.parse(teamMembers) : [],
            transactionId: transactionId || "N/A",
            paymentDate: paymentDate || "N/A",
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
                { header: 'Team Name', key: 'teamName', width: 25 },
                { header: 'ID', key: 'id', width: 15 },
                { header: 'Date of Registration', key: 'timestamp', width: 25 },
                { header: 'Full Name', key: 'fullName', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'College', key: 'college', width: 30 },
                { header: 'UTR', key: 'transactionId', width: 20 },
                { header: 'Date of Payment', key: 'paymentDate', width: 20 },
                { header: 'Team Members details', key: 'teamMembers', width: 50 },
                { header: 'Screenshot Proof', key: 'screenshot', width: 40 },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '9333EA' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            grouped[eventTitle].forEach(reg => {
                const row = worksheet.addRow({
                    teamName: reg.teamName || "N/A",
                    id: reg.id,
                    timestamp: new Date(reg.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                    fullName: reg.fullName,
                    email: reg.email,
                    phone: reg.phone,
                    college: reg.college,
                    transactionId: reg.transactionId,
                    paymentDate: reg.paymentDate || "N/A",
                    teamMembers: reg.teamMembers?.length > 0
                        ? reg.teamMembers.map(m => `Name: ${m.fullName}\nEmail: ${m.email}\nPhone: ${m.phone}`).join("\n\n")
                        : "N/A",
                    screenshot: reg.screenshotPath ? `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${reg.screenshotPath}` : "N/A"
                });

                // Enable text wrapping for team members cell to allow multiple lines
                row.getCell('teamMembers').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('timestamp').alignment = { vertical: 'top' };
                row.getCell('fullName').alignment = { vertical: 'top' };
                row.getCell('college').alignment = { wrapText: true, vertical: 'top' };

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

        if (!SENDER_EMAIL || !SENDER_PASSWORD || !ADMIN_RECEIVER_EMAIL) {
            console.error("CRITICAL: Email credentials missing in environment variables!");
            return res.status(500).json({ success: false, message: 'Server configuration error (Email Credentials).' });
        }

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SENDER_EMAIL,
                pass: SENDER_PASSWORD
            },
            logger: true, // Enable nodemailer logs
            debug: true // Show SMTP traffic
        });

        // Verify connection on-the-fly
        try {
            await transporter.verify();
            console.log("Nodemailer Transporter is ready to take our messages");
        } catch (verifyErr) {
            console.error("SMTP Connection Error during verify:", verifyErr);
            return res.status(500).json({ success: false, message: `SMTP Connection Failed: ${verifyErr.message}` });
        }

        const mailOptions = {
            from: SENDER_EMAIL,
            to: ADMIN_RECEIVER_EMAIL,
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
        console.log(`✅ Automated Report Emailed successfully to: ${ADMIN_RECEIVER_EMAIL}`);
        res.status(200).json({ success: true, message: 'Report emailed successfully!' });

    } catch (error) {
        console.error("Email Automation Error:", error);
        res.status(500).json({ success: false, message: `Failed to send email: ${error.message || 'Unknown error'}` });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

