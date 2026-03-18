const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const mongoose = require('mongoose');
const dns = require('dns');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = process.env.PORT || 5000;

// Trim config values to prevent hidden character issues
const SENDER_EMAIL = (process.env.SENDER_EMAIL || "").trim();
const SENDER_PASSWORD = (process.env.SENDER_PASSWORD || "").trim();
const ADMIN_RECEIVER_EMAIL = (process.env.ADMIN_RECEIVER_EMAIL || "").trim();
const BASE_URL = (process.env.BASE_URL || "").trim().replace(/\/$/, "");
const FRONTEND_URL = (process.env.FRONTEND_URL || "").trim().replace(/\/$/, "");

// Global Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify SMTP Connection on Startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Connection Error:", error);
    } else {
        console.log("🚀 SMTP Server is ready to send emails!");
    }
});

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, ""))
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'];

console.log("✅ Allowed CORS Origins:", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, "");

        // Allow all localhost for easier development
        if (cleanOrigin.startsWith('http://localhost:')) {
            return callback(null, true);
        }

        if (!process.env.FRONTEND_URL || allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS Blocked: ${origin}. Not in: ${allowedOrigins}`);
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
    category: { type: String, default: 'Tech' },
    amountPaid: { type: String, default: 'N/A' },
    passType: { type: String, default: 'Standard Pass' },
    screenshotPath: { type: String, default: null }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Define Event Status Schema (For Open/Close Toggles)
const eventStatusSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    isOpen: { type: Boolean, default: true }
});
const EventStatus = mongoose.model('EventStatus', eventStatusSchema);

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'algorhythm-registrations',
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return 'screenshot-' + uniqueSuffix;
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to extract Cloudinary public_id from URL
const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null; // Not a Cloudinary URL

    let startIndex = uploadIndex + 1;
    // Skip any parts that are likely transformations (e.g. c_fill, w_300) 
    // or version strings (e.g. v1234567)
    while (startIndex < parts.length - 1 &&
        (parts[startIndex].includes(',') ||
            (parts[startIndex].startsWith('v') && !isNaN(parts[startIndex].substring(1))))) {
        startIndex++;
    }

    const publicIdWithExtension = parts.slice(startIndex).join('/');
    // Remove extension but keep path (folder/public_id)
    return publicIdWithExtension.replace(/\.[^/.]+$/, "");
};

// Root Route for Health Checks (Render Compatibility)
app.get('/', (req, res) => {
    res.status(200).send('AlgoRhythm Fest API is Online 🚀');
});

// Helper: Send Confirmation Email to User with Website Download Link
/**
 * Generates a professional PDF pass using pdfkit
 */
const generatePDFPass = (reg) => {
    return new Promise((resolve, reject) => {
        const mmToPt = 2.8346;
        const width = 180 * mmToPt;
        const height = 260 * mmToPt;
        
        const doc = new PDFDocument({ 
            size: [width, height],
            margins: { top: 0, left: 0, bottom: 0, right: 0 } 
        });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', (err) => reject(err));

        // Background / Branding
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#ffffff');

        // Header Banner
        doc.rect(0, 0, doc.page.width, 140).fill('#9333ea');

        // Robust Category Normalization (Case-insensitive)
        const rawCat = reg.category || "Tech";
        const normalizedCategory = rawCat.trim().charAt(0).toUpperCase() + rawCat.trim().slice(1).toLowerCase();
        
        console.log(`DEBUG: Generating PDF for ${reg.email} | Event: ${reg.eventTitle} | Category: [${rawCat}] -> Normalized: [${normalizedCategory}]`);

        const colors = {
            Tech: { banner: '#0e748c', border: '#06b6d4', accent: '#22d3ee', label: '#67e8f9' },
            Fun: { banner: '#e11d48', border: '#a855f7', accent: '#e879f9', label: '#fdb4af' },
            Workshop: { banner: '#059669', border: '#14b8a6', accent: '#2dd4bf', label: '#6ee7b7' }
        };
        const activeColor = colors[normalizedCategory] || colors.Tech;

        const drawTicketBase = (pageDoc) => {
            pageDoc.rect(0, 0, width, height).fill('#0f111a');
            pageDoc.fillColor('#1e293b');
            pageDoc.roundedRect(8 * mmToPt, 8 * mmToPt, 164 * mmToPt, 244 * mmToPt, 15 * mmToPt).fill();
            pageDoc.lineWidth(1).strokeColor(activeColor.border);
            pageDoc.roundedRect(8 * mmToPt, 8 * mmToPt, 164 * mmToPt, 244 * mmToPt, 15 * mmToPt).stroke();
            pageDoc.fillColor(activeColor.banner);
            pageDoc.roundedRect(8 * mmToPt, 8 * mmToPt, 164 * mmToPt, 50 * mmToPt, 15 * mmToPt).fill();
            pageDoc.rect(8 * mmToPt, 25 * mmToPt, 164 * mmToPt, 33 * mmToPt).fill();
            pageDoc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold')
                   .text("ALGORHYTHM 3.0", 0, 18 * mmToPt, { align: 'center', characterSpacing: 1 });
            
            pageDoc.fontSize(10).font('Helvetica')
                   .text("OFFICIAL ACCESS PASS", 0, 31 * mmToPt, { align: 'center', characterSpacing: 2 });

            // Tear Line (Dashed)
            pageDoc.lineWidth(1).strokeColor('#475569').dash(2 * mmToPt, { space: 2 * mmToPt })
                   .moveTo(15 * mmToPt, 65 * mmToPt).lineTo(165 * mmToPt, 65 * mmToPt).stroke().undash();

            // Instructions Bottom
            pageDoc.fillColor('#94a3b8').fontSize(7).font('Helvetica-Oblique')
                   .text("SUBMIT THIS PASS AT THE REGISTRATION DESK", 0, 246 * mmToPt, { align: 'center' });

            pageDoc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold')
                   .text("THANKS FOR REGISTERING!", 0, 253 * mmToPt, { align: 'center', characterSpacing: 1 });
            pageDoc.save().translate(171 * mmToPt, 220 * mmToPt).rotate(90);
            pageDoc.fillColor('#344155').fontSize(7).font('Helvetica').text("DESIGNED BY GRAFIK", 0, 0);
            pageDoc.restore();
        };

        drawTicketBase(doc);
        // UTR & VERIFIED Badge
        doc.fillColor('#94a3b8').fontSize(9).font('Helvetica-Bold').text("UTR NO:", 20 * mmToPt, 80 * mmToPt);
        doc.fillColor('#ffffff').fontSize(12).font('Helvetica').text(reg.transactionId || 'VERIFIED', 20 * mmToPt, 88 * mmToPt);

        // Status Badge (Green Pill - Centered Text)
        doc.fillColor('#10b981').roundedRect(130 * mmToPt, 76 * mmToPt, 35 * mmToPt, 12 * mmToPt, 6 * mmToPt).fill();
        doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text("VERIFIED", 130 * mmToPt, 81 * mmToPt, { width: 35 * mmToPt, align: 'center' });
        doc.fillColor(activeColor.border).fontSize(30).font('Helvetica-Bold').text(reg.eventTitle.toUpperCase(), 0, 108 * mmToPt, { align: 'center' });
        doc.fillColor('#0f172a').roundedRect(20 * mmToPt, 125 * mmToPt, 140 * mmToPt, 28 * mmToPt, 6 * mmToPt).fill();
        doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text("TIME:", 30 * mmToPt, 133 * mmToPt);
        doc.text("VENUE:", 85 * mmToPt, 133 * mmToPt);
        doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text("9:00 AM ONWARDS", 30 * mmToPt, 142 * mmToPt);
        doc.text("GIS AUDITORIUM, GCEM", 85 * mmToPt, 142 * mmToPt);

        let currentY = 175 * mmToPt;
        doc.fillColor(activeColor.label).fontSize(10).font('Helvetica-Bold').text("PARTICIPANTS DETAILS", 20 * mmToPt, currentY);
        currentY += 10 * mmToPt;
        if (reg.teamName) { doc.fillColor(activeColor.border).fontSize(12).font('Helvetica-Bold').text(`TEAM: ${reg.teamName.toUpperCase()}`, 20 * mmToPt, currentY); currentY += 8 * mmToPt; }
        doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text(reg.fullName.toUpperCase(), 20 * mmToPt, currentY);
        currentY += 10 * mmToPt;
        doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text(`College: ${reg.college}`, 20 * mmToPt, currentY);
        currentY += 7 * mmToPt; doc.text(`Email: ${reg.email}`, 20 * mmToPt, currentY);
        currentY += 7 * mmToPt; doc.text(`Phone: ${reg.phone}`, 20 * mmToPt, currentY);
        doc.fillColor(activeColor.label).fontSize(10).font('Helvetica-Bold').text(reg.passType === 'combo' ? "COMBO PASS FEE" : "STANDARD FEE", 20 * mmToPt, 227 * mmToPt);
        doc.fillColor('#ffffff').fontSize(14).text(`Rs. ${reg.amountPaid.toString().replace(/₹/g, '')}`, 20 * mmToPt, 235 * mmToPt);

        if (reg.teamMembers && reg.teamMembers.length > 0) {
            doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } });
            drawTicketBase(doc);
            let teamY = 80 * mmToPt;
            doc.fillColor(activeColor.border).fontSize(16).font('Helvetica-Bold').text(reg.teamName ? `TEAM: ${reg.teamName.toUpperCase()}` : "TEAM MEMBERS", 0, teamY, { align: 'center' });
            teamY += 15 * mmToPt;
            reg.teamMembers.forEach((m, i) => {
                if (teamY > 220 * mmToPt) { doc.addPage({ size: [width, height], margins: { top: 0, left: 0, bottom: 0, right: 0 } }); drawTicketBase(doc); teamY = 80 * mmToPt; }
                doc.fillColor(activeColor.accent).fontSize(11).font('Helvetica-Bold').text(`Member ${i+2}: ${m.fullName.toUpperCase()}`, 25 * mmToPt, teamY);
                teamY += 6 * mmToPt;
                doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text(`Email: ${m.email} | Phone: ${m.phone}`, 25 * mmToPt, teamY);
                teamY += 10 * mmToPt;
            });
        }

        doc.end();
    });
};

const sendConfirmationEmail = async (reg) => {
    console.log(`📤 Attempting to send confirmation email to: ${reg.email}...`);
    try {
        // Generate PDF Buffer
        const pdfBuffer = await generatePDFPass(reg);
        // Get primary frontend URL for deep linking
        const primaryFrontend = process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(',')[0].trim().replace(/\/$/, "")
            : "https://algorhythmfest.vercel.app";

        const downloadUrl = `${primaryFrontend}/?openPass=true&email=${encodeURIComponent(reg.email)}&autoDownload=true`;

        const mailOptions = {
            from: SENDER_EMAIL,
            to: reg.email,
            subject: `Spot Secured! ${reg.eventTitle} is waiting for you 🚀`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; border-radius: 24px; background: #ffffff; color: #1a202c;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #9333ea; margin: 0; font-size: 28px; letter-spacing: -0.025em;">ALGO-RHYTHM 3.0</h1>
                        <p style="color: #718096; margin-top: 8px; font-weight: 500;">REGISTRATION SUCCESSFUL! ✅</p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${reg.fullName}</strong>,</p>
                    <p style="font-size: 16px; line-height: 1.6;">Your spot for <strong>${reg.eventTitle}</strong> at Gopalan College of Engineering and Management has been officially reserved! We are excited to see you there.</p>
                    
                    <div style="background: #f7fafc; border: 1px solid #edf2f7; padding: 25px; border-radius: 16px; margin: 30px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #718096; font-size: 14px; width: 120px;">Event Name:</td>
                                <td style="padding: 8px 0; font-weight: 700; color: #2d3748;">${reg.eventTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #718096; font-size: 14px;">College:</td>
                                <td style="padding: 8px 0; font-weight: 700; color: #2d3748;">${reg.college}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${downloadUrl}" 
                           style="background: #9333ea; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px 0 rgba(147, 51, 234, 0.39);">
                           DOWNLOAD OFFICIAL PDF PASS
                        </a>
                        <p style="color: #a0aec0; font-size: 12px; margin-top: 15px;">
                            Access your pass anytime using <strong>USED DURING THE REGISTRATION OR TEAM LEADER GMAIL</strong> on our website.
                        </p>
                    </div>

                    <div style="background: #faf5ff; border-left: 4px solid #9333ea; padding: 15px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0; color: #6b46c1; font-size: 14px;">
                            <strong>NOTE:</strong> All participants are required to arrive at the venue (GIS Auditorium) by 9:00 AM.
                        </p>
                    </div>
                    
                    <p style="font-size: 14px; color: #a0aec0; text-align: center; margin-top: 40px;">
                        AlgoRhythm 3.0 | Techno-Cultural Fest 2026<br/>
                        GCEM, Bengaluru
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: `AlgoRhythm_Pass_${reg.fullName.replace(/\s+/g, '_')}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Confirmation email sent! MessageID: ${info.messageId} | Recipient: ${reg.email}`);
    } catch (err) {
        console.error(`❌ SMTP Error for ${reg.email}:`, err.message);
        if (err.code === 'EENVELOPE') {
            console.error("DEBUG: Invalid recipient email address.");
        }
    }
};

// Routes
app.post('/api/register', upload.single('paymentScreenshot'), async (req, res) => {
    try {
        const { fullName, email, phone, college, teamName, transactionId, paymentDate, eventTitle, teamMembers, amountPaid, passType, category } = req.body;

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
            category: category || "Tech",
            amountPaid: amountPaid || "N/A",
            passType: passType || "Standard Pass",
            screenshotPath: req.file ? req.file.path : null
        });

        await newRegistration.save();
        console.log(`New registration received (DB) for ${eventTitle} by ${fullName} [Category: ${category || 'Tech'}]`);

        // Send success response IMMEDIATELY to frontend for 1-second "Success" screen
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: newRegistration
        });

        // Trigger automated confirmation email in the background (no AWAIT so frontend doesn't hang)
        sendConfirmationEmail(newRegistration).catch(err => {
            console.error("Delayed email error:", err);
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

// Admin Bulk Action: Clear All Registrations
app.delete('/api/admin/registrations-all', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // 1. Find all registrations to get their screenshot public_ids
        const registrations = await Registration.find({ screenshotPath: { $ne: null } });
        const publicIds = registrations
            .map(r => extractPublicId(r.screenshotPath))
            .filter(id => id !== null);

        // 2. Delete all screenshots from Cloudinary in bulk
        if (publicIds.length > 0) {
            try {
                await cloudinary.api.delete_resources(publicIds);
                console.log(`☁️ Cloudinary: Wiped ${publicIds.length} images.`);
            } catch (err) {
                console.error("Cloudinary Bulk Wipe Error:", err);
            }
        }

        const result = await Registration.deleteMany({});
        console.log(`🧹 Admin Bulk Wipe: ${result.deletedCount} records removed.`);

        res.status(200).json({
            success: true,
            message: `MASTER RESET SUCCESSFUL! ${result.deletedCount} registrations cleared.`,
            count: result.deletedCount
        });
    } catch (error) {
        console.error("Admin Bulk Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server error during master reset' });
    }
});

// Admin Delete Single Registration (New Route)
app.delete('/api/admin/registrations/:id', async (req, res) => {
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const { id } = req.params;
        const registration = await Registration.findOne({ id: id });

        if (!registration) {
            return res.status(404).json({ success: false, message: 'Registration not found' });
        }

        // Delete screenshot if exists
        if (registration.screenshotPath) {
            const publicId = extractPublicId(registration.screenshotPath);
            if (publicId) {
                // It's a Cloudinary image
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`☁️ Cloudinary: Screenshot deleted (${publicId})`);
                } catch (err) {
                    console.error("Cloudinary Cleanup Error:", err);
                }
            } else {
                // It might be a local file path
                const localPath = path.join(uploadDir, registration.screenshotPath);
                if (fs.existsSync(localPath)) {
                    fs.unlinkSync(localPath);
                    console.log(`📁 Local: File deleted (${registration.screenshotPath})`);
                }
            }
        }

        await Registration.deleteOne({ id: id });

        console.log(`🗑 Admin Deleted Registration: ${id} (${registration.fullName})`);
        res.status(200).json({
            success: true,
            message: `Registration for ${registration.fullName} deleted successfully.`
        });
    } catch (error) {
        console.error("Admin Single Delete Error:", error);
        res.status(500).json({ success: false, message: 'Server error during registration deletion' });
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

// 7. Manual Email Test Route (For Debugging)
app.get('/api/admin/test-email', async (req, res) => {
    console.log("--- Manual SMTP Test Request ---");
    try {
        const info = await transporter.sendMail({
            from: SENDER_EMAIL,
            to: SENDER_EMAIL, // Send it to self
            subject: "ALGORHYTHM SMTP TEST 🚀",
            text: "If you see this, your SMTP configuration is 100% correct!"
        });
        console.log("✅ Test email sent successfully! MessageID:", info.messageId);
        res.status(200).json({ success: true, message: "Test email sent!", messageId: info.messageId });
    } catch (err) {
        console.error("❌ SMTP Test Failed:", err);
        res.status(500).json({ success: false, message: "SMTP Test Failed", error: err.message });
    }
});

app.post('/api/admin/send-report', async (req, res) => {
    console.log("--- New Email Report Request Received ---");
    try {
        const password = req.headers['x-admin-password'];
        if (password !== 'algorhythm@admin2026') {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const registrations = await Registration.find().lean().sort({ eventTitle: 1 });

        if (registrations.length > 0) {
            console.log("DEBUG: First Registration Check:", {
                fullName: registrations[0].fullName,
                paymentDate: registrations[0].paymentDate,
                teamMembers: registrations[0].teamMembers,
                isTeamMembersArray: Array.isArray(registrations[0].teamMembers)
            });
        }

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
                { header: 'Pass Type', key: 'passType', width: 20 },
                { header: 'Amount Paid', key: 'amountPaid', width: 20 },
                { header: 'Team Name', key: 'teamName', width: 25 },
                { header: 'Booking ID', key: 'id', width: 15 },
                { header: 'Registration Time', key: 'timestamp', width: 25 },
                { header: 'Full Name', key: 'fullName', width: 25 },
                { header: 'Email', key: 'email', width: 30 },
                { header: 'Phone', key: 'phone', width: 15 },
                { header: 'College', key: 'college', width: 30 },
                { header: 'UTR (Transaction ID)', key: 'transactionId', width: 25 },
                { header: 'Date of Payment', key: 'paymentDate', width: 20 },
                { header: 'Team Members details', key: 'teamMembers', width: 60 },
                { header: 'Screenshot Proof', key: 'screenshot', width: 40 },
            ];

            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '9333EA' } };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            grouped[eventTitle].forEach(reg => {
                const row = worksheet.addRow({
                    passType: reg.passType || "Standard Pass",
                    amountPaid: reg.amountPaid || "N/A",
                    teamName: reg.teamName || "N/A",
                    id: reg.id,
                    timestamp: reg.timestamp ? new Date(reg.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : "N/A",
                    fullName: reg.fullName,
                    email: reg.email,
                    phone: reg.phone,
                    college: reg.college,
                    transactionId: reg.transactionId || "N/A",
                    paymentDate: reg.paymentDate || "N/A",
                    teamMembers: (reg.teamMembers && Array.isArray(reg.teamMembers) && reg.teamMembers.length > 0)
                        ? `Member 1 (Leader): ${reg.fullName}\nEmail: ${reg.email}\nPhone: ${reg.phone}\n\n` +
                        reg.teamMembers.map((m, idx) => `Member ${idx + 2}: ${m.fullName}\nEmail: ${m.email}\nPhone: ${m.phone}`).join("\n\n")
                        : "N/A",
                    screenshot: reg.screenshotPath ? reg.screenshotPath : "N/A"
                });

                // Enable text wrapping for team members cell to allow multiple lines
                row.getCell('teamMembers').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('timestamp').alignment = { vertical: 'top' };
                row.getCell('fullName').alignment = { vertical: 'top' };
                row.getCell('college').alignment = { wrapText: true, vertical: 'top' };

                if (reg.screenshotPath) {
                    const linkCell = row.getCell('screenshot');
                    linkCell.value = {
                        text: 'Link to Screenshot',
                        hyperlink: reg.screenshotPath
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

