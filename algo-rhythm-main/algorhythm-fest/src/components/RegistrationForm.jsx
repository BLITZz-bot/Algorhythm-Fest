import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"
import JsBarcode from "jsbarcode"

export default function RegistrationForm({ event, onClose }) {
    const [step, setStep] = useState(1)
    const receiptRef = useRef(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)
    const [utrError, setUtrError] = useState("")
    const [teamMembers, setTeamMembers] = useState([])
    const [passType, setPassType] = useState('standard') // 'standard' or 'combo'
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        college: "",
        teamName: "",
        transactionId: "",
        paymentDate: "",
        paymentScreenshot: null
    })

    const cat = event?.category || "Tech"
    const buttonGradients = {
        Tech: "from-cyan-500 to-blue-600",
        Fun: "from-purple-600 to-pink-600",
        Workshop: "from-emerald-600 to-teal-600",
    }
    const buttonShadows = {
        Tech: "hover:shadow-cyan-500/40",
        Fun: "hover:shadow-pink-500/40",
        Workshop: "hover:shadow-emerald-500/40",
    }

    const comboPassDetails = event?.comboPass || event?.ComboPass;
    const standardFeeString = event?.fee || event?.fees || (event?.prize === "Participation" ? "Free" : "₹150");

    useEffect(() => {
        if (event && event.minTeamSize > 1) {
            setTeamMembers(Array.from({ length: event.minTeamSize - 1 }, () => ({ fullName: "", email: "", phone: "" })));
        } else {
            setTeamMembers([]);
        }
    }, [event]);


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === 'transactionId') {
            const val = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
            setFormData(prev => ({ ...prev, [name]: val }));
            setUtrError("");
            return;
        }
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (event.prize !== "Participation") {
            if (!formData.transactionId) {
                setUtrError("Please enter your Transaction ID (UTR) number.");
                return;
            }
            if (formData.transactionId.length !== 12) {
                setUtrError("UTR/Transaction ID must be exactly 12 digits.");
                return;
            }
        }

        // Prepare FormData for multipart/form-data backend
        const submissionData = new FormData()
        submissionData.append("fullName", formData.fullName)
        submissionData.append("email", formData.email)
        submissionData.append("phone", formData.phone)
        submissionData.append("college", formData.college)
        submissionData.append("transactionId", formData.transactionId)
        submissionData.append("paymentDate", formData.paymentDate)
        submissionData.append("eventTitle", event.title)
        submissionData.append("category", event.category || "Tech")
        submissionData.append("teamMembers", JSON.stringify(teamMembers))

        const minTeamSize = event.minTeamSize || 1;
        const maxTeamSize = event.maxTeamSize || 1;
        if (minTeamSize >= 2 || maxTeamSize > 1) {
            submissionData.append("teamName", formData.teamName)
        }

        if (formData.paymentScreenshot) {
            submissionData.append("paymentScreenshot", formData.paymentScreenshot)
        }

        // Let the backend know if they paid for a combo pass
        if (comboPassDetails && passType === 'combo') {
            submissionData.append("passType", "Combo Pass")
            submissionData.append("amountPaid", comboPassDetails)
        } else {
            submissionData.append("passType", "Standard Pass")
            submissionData.append("amountPaid", standardFeeString)
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                body: submissionData,
            })

            if (!response.ok) {
                throw new Error("Registration failed")
            }

            // Move to success step
            setStep(3)
        } catch (error) {
            console.error("Error submitting registration:", error)
            alert("There was an error submitting your registration. Please try again. If the issue persists, contact us at bharatha9483@gmail.com or 7975871167.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDownloadPDF = () => {
        setIsDownloading(true);

        try {
            // ==========================================
            // PREMIUM DARK TICKET DESIGN FOR PDF
            // ==========================================
            const safeName = formData?.fullName ? formData.fullName.replace(/\s+/g, '_') : 'Attendee';
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [180, 260]
            });

            const pdfColors = {
                Tech: {
                    banner: [14, 116, 144], // Cyan 700
                    border: [6, 182, 212], // Cyan 500
                    accent: [34, 211, 238],  // Cyan 400
                    label: [103, 232, 249]   // Cyan 300
                },
                Fun: {
                    banner: [225, 29, 72],  // Rose 600
                    border: [168, 85, 247], // Purple 500
                    accent: [232, 121, 249],  // Fuchsia 400
                    label: [253, 164, 175]   // Pink 300
                },
                Workshop: {
                    banner: [5, 150, 105],  // Emerald 600
                    border: [20, 184, 166], // Teal 500
                    accent: [45, 212, 191],   // Teal 400
                    label: [110, 231, 183]    // Emerald 300
                }
            }
            const colors = pdfColors[cat] || pdfColors.Tech;

            // Helper function to draw the common background, header, barcode and footer
            const drawTicketBase = (pageDoc) => {
                // 1. Solid Outside Background (Deep Navy/Black)
                pageDoc.setFillColor(15, 17, 26);
                pageDoc.rect(0, 0, 180, 260, 'F');

                // 2. Main Ticket Container with Rounded Corners
                pageDoc.setDrawColor(...colors.border);
                pageDoc.setLineWidth(1);
                pageDoc.roundedRect(8, 8, 164, 244, 15, 15, 'D');

                // 3. Inner Content Background (Deep slate)
                pageDoc.setFillColor(30, 41, 59);
                pageDoc.roundedRect(8, 8, 164, 244, 15, 15, 'F');

                // 4. HEADER BANNER (DYNAMIC COLOR)
                pageDoc.setFillColor(...colors.banner);
                pageDoc.roundedRect(8, 8, 164, 50, 15, 15, 'F');
                pageDoc.rect(8, 25, 164, 33, 'F');

                // Header Text (PRESERVING COORDINATES)
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.setFont("helvetica", "bold");
                pageDoc.setFontSize(24);
                pageDoc.text("ALGORHYTHM 3.0", 83, 25, { align: "center", charSpace: 1 });

                pageDoc.setFontSize(10);
                pageDoc.setFont("helvetica", "normal");
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("OFFICIAL ACCESS PASS", 65.9, 38, { align: "center", charSpace: 2.5 });

                // 5. Tear Line (Dashed)
                pageDoc.setDrawColor(71, 85, 105);
                pageDoc.setLineDash([2, 2], 0);
                pageDoc.line(15, 65, 165, 65);
                pageDoc.setLineDash([], 0);

                // Registration Desk Instruction (PRESERVING COORDINATES)
                pageDoc.setFont("helvetica", "italic");
                pageDoc.setFontSize(7);
                pageDoc.setTextColor(148, 163, 184);
                pageDoc.text("SUBMIT THIS PASS AT THE REGISTRATION DESK", 90, 246, { align: "center" });


                // Footer Text (PRESERVING COORDINATES)
                pageDoc.setFont("helvetica", "bold");
                pageDoc.setCharSpace(2);
                pageDoc.setFontSize(8);
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("THANKS FOR REGISTERING!", 67, 257, { align: "center" });
                pageDoc.setCharSpace(0);

                // Vertical Watermark (PRESERVING COORDINATES)
                pageDoc.setFontSize(7);
                pageDoc.setTextColor(52, 65, 85);
                pageDoc.text("DESIGNED BY GRAFIK", 171, 230, { angle: 90 });
            };

            // START PAGE 1
            drawTicketBase(doc);

            // 6. UTR & VERIFIED Badge
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text("UTR NO:", 20, 80);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            const ticketId = formData.transactionId || `ALG-${Math.floor(Math.random() * 1000000)}`;
            doc.text(ticketId, 20, 88);

            // Status Badge (Green Pill)
            doc.setFillColor(16, 185, 129); // Emerald 500
            doc.roundedRect(135, 76, 30, 12, 6, 6, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.text("VERIFIED", 150, 84, { align: "center" });

            // 7. EVENT TITLE
            doc.setFont("helvetica", "bold");
            doc.setFontSize(30);
            doc.setTextColor(...colors.border);
            doc.text(event.title.toUpperCase(), 90, 115, { align: "center" });

            // 8. TIME & VENUE BOX (Dark Card)
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(20, 125, 140, 28, 6, 6, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.text("TIME:", 30, 137);
            doc.text("VENUE:", 85, 137);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(event.time, 30, 146);

            const venueLines = doc.splitTextToSize(event.location, 70);
            doc.text(venueLines, 85, 146);

            // 9. LEADER DATA ONLY ON PAGE 1
            let currentY = 175;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...(colors.label || [253, 164, 175])); // Dynamic Label
            doc.text("PARTICIPANTS DETAILS", 20, currentY);
            currentY += 10;

            if (isTeamEvent && formData.teamName) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(...colors.border);
                doc.text(`TEAM: ${formData.teamName.toUpperCase()}`, 20, currentY);
                currentY += 8;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            doc.text(formData.fullName.toUpperCase(), 20, currentY);
            currentY += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`College: ${formData.college}`, 20, currentY);
            currentY += 7;
            doc.text(`Email: ${formData.email}`, 20, currentY);
            currentY += 7;
            doc.text(`Phone: ${formData.phone}`, 20, currentY);

            // 10. FINANCIALS 
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...(colors.label || [253, 164, 175]));
            doc.text(passType === 'combo' ? "COMBO PASS FEE" : "STANDARD FEE", 20, 230);
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            let feeText = (passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString;
            doc.text(feeText.toString().replace(/₹/g, "Rs. "), 20, 238);


            // PAGE 2 (TEAM MEMBERS)
            if (teamMembers && teamMembers.length > 0) {
                doc.addPage([180, 260], 'portrait');
                drawTicketBase(doc); // Re-draw branding

                let teamY = 80;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(...colors.border);
                doc.text(formData.teamName ? `TEAM: ${formData.teamName.toUpperCase()}` : "TEAM MEMBERS", 90, teamY, { align: "center" });
                teamY += 15;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(203, 213, 225);

                teamMembers.forEach((m, i) => {
                    if (teamY > 220) { // Safety check to prevent running off bottom
                        doc.addPage([180, 260], 'portrait');
                        drawTicketBase(doc);
                        teamY = 80;
                    }
                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(255, 255, 255);
                    doc.text(`${i + 1}. ${m.fullName.toUpperCase()}`, 20, teamY);
                    teamY += 6;
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(148, 163, 184);
                    doc.text(`   ${m.phone} | ${m.email}`, 20, teamY);
                    teamY += 10;
                });
            }

            doc.save(`Access_Pass_${safeName}.pdf`);


        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Failed to create PDF document: " + (err.message || err.toString()));
        } finally {
            setIsDownloading(false);
        }
    }

    if (!event) return null

    const minTeamSize = event.minTeamSize || 1;
    const maxTeamSize = event.maxTeamSize || 1;
    const isTeamEvent = minTeamSize >= 2 || maxTeamSize > 1;

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (isTeamEvent && (!formData.teamName || formData.teamName.trim() === "")) {
            alert("Please enter a Team Name.");
            return;
        }
        if (teamMembers.length + 1 < minTeamSize) {
            alert(`This event requires a minimum team size of ${minTeamSize}. Please add ${minTeamSize - 1 - teamMembers.length} more member(s).`);
            return;
        }
        setStep(2);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#020617] flex flex-col overflow-y-auto w-full min-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
            {/* ... rest of the component content ... */}
            {/* Animated Background Energy */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[5%] w-[45%] h-[45%] bg-pink-600/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -60, 0],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 blur-[80px] rounded-full"
                />
            </div>

            {/* Header Section */}
            <div className="relative p-6 sm:p-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md z-20">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {event.title} <span className="text-purple-500">Registration</span>
                    </h2>
                    <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        {event.time} • {event.location}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-8 px-6 sm:px-10 max-w-3xl mx-auto w-full z-20">
                <div className="flex items-center justify-between relative">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 rotate-45 ${step >= s ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                                <div className="-rotate-45">
                                    {step > s ? (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <span className="font-bold text-white text-sm">{s}</span>
                                    )}
                                </div>
                            </div>
                            <span className={`text-[10px] mt-4 font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${step >= s ? 'text-purple-400' : 'text-slate-600'}`}>
                                {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Success'}
                            </span>
                        </div>
                    ))}
                    {/* Connecting Lines background */}
                    <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] bg-slate-800 -z-0" />
                    {/* Connecting Lines active */}
                    <div className="absolute top-[20px] left-[10%] right-[10%] h-[2px] -z-0">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-10 flex-1 flex flex-col">
                {step === 1 && (
                    <motion.form
                        key="step1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        onSubmit={handleStep1Submit}
                        className="space-y-6 max-w-3xl mx-auto w-full py-8 z-20"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{isTeamEvent ? "Team Leader Full Name" : "Enter your full name"} <span className="text-pink-500">*</span></label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300" placeholder="" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email <span className="text-pink-500">*</span></label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300" placeholder="cse@example.com" />
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone <span className="text-pink-500">*</span></label>
                                    <input required type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" maxLength="10" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300" placeholder="987*****10" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">College <span className="text-pink-500">*</span></label>
                                    <input required type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300" placeholder="Your College Name" />
                                </div>
                            </div>
                        </div>

                        {isTeamEvent && (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="relative z-10 mb-8 space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Team Name <span className="text-pink-500">*</span></label>
                                    <input required type="text" name="teamName" value={formData.teamName} onChange={handleChange} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300" placeholder="Your Team Name" />
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-white tracking-tight">Team Roster</h3>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/20">
                                        {teamMembers.length + 1} / {maxTeamSize} Members
                                    </span>
                                </div>

                                <div className="relative z-10 space-y-4">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative group/member hover:border-white/20 transition-colors duration-300">
                                            {index >= (minTeamSize - 1) && (
                                                <button type="button" onClick={() => {
                                                    const newMembers = [...teamMembers];
                                                    newMembers.splice(index, 1);
                                                    setTeamMembers(newMembers);
                                                }} className="absolute top-4 right-4 text-slate-500 hover:text-pink-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            )}
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                Member {index + 2} {index < (minTeamSize - 1) && <span className="text-[10px] text-slate-500">(Required)</span>}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
                                                    <input required type="text" value={member.fullName} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].fullName = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="Full Name" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                                                    <input required type="email" value={member.email} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].email = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="email@example.com" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
                                                    <input required type="tel" pattern="[0-9]{10}" maxLength="10" value={member.phone} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].phone = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all" placeholder="Phone" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {teamMembers.length + 1 < maxTeamSize && (
                                    <button type="button" onClick={() => setTeamMembers([...teamMembers, { fullName: "", email: "", phone: "" }])} className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-white/10 text-slate-400 font-bold hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all duration-300 flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        Add Another Member
                                    </button>
                                )}
                            </div>
                        )}

                        {comboPassDetails && (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                                <h3 className="text-lg font-bold text-white tracking-tight mb-6">Choose Your Experience</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <label className={`relative flex flex-col p-6 cursor-pointer rounded-3xl border-2 transition-all duration-300 ${passType === 'standard' ? 'bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                        <input type="radio" name="passType" value="standard" checked={passType === 'standard'} onChange={() => setPassType('standard')} className="sr-only" />
                                        <span className="font-bold text-white text-lg tracking-tight">Standard Pass</span>
                                        <span className="text-slate-400 mt-1 font-medium">{standardFeeString}</span>
                                        <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${passType === 'standard' ? 'border-purple-500 bg-purple-500' : 'border-slate-700'}`}>
                                            {passType === 'standard' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </label>

                                    <label className={`relative flex flex-col p-6 cursor-pointer rounded-3xl border-2 transition-all duration-300 ${passType === 'combo' ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                        <input type="radio" name="passType" value="combo" checked={passType === 'combo'} onChange={() => setPassType('combo')} className="sr-only" />
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-lg tracking-tight">Combo Pass</span>
                                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-500 text-amber-950 uppercase tracking-tighter">BEST VALUE</span>
                                        </div>
                                        <span className="text-amber-500/80 mt-1 font-medium text-sm">{comboPassDetails}</span>
                                        <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${passType === 'combo' ? 'border-amber-500 bg-amber-500' : 'border-slate-700'}`}>
                                            {passType === 'combo' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="text-center space-y-2 mt-4">
                            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                                Need assistance? Any issue with registration? Contact(Bharath)
                            </p>
                            <a href="tel:7975871167" className="text-[11px] font-bold text-purple-400 tracking-wider hover:text-purple-300 transition-colors">
                                7975871167
                            </a>
                        </div>

                        <div className="pt-4 flex justify-center sm:justify-end mb-10 sm:mb-0">
                            <button type="submit" className={`group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r ${buttonGradients[cat] || buttonGradients.Tech} rounded-[2rem] text-white font-black uppercase tracking-widest text-sm ${buttonShadows[cat] || buttonShadows.Tech} transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg] pointer-events-none" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Continue to Payment
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                            </button>
                        </div>
                    </motion.form>
                )}
                {step === 2 && (
                    <motion.form
                        key="step2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-6 max-w-2xl mx-auto w-full py-8 z-20"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-30 pointer-events-none" />

                            <div className="relative z-10 relative text-center mb-8">
                                <h3 className="text-xl font-bold text-white tracking-tight mb-2">Complete Payment</h3>
                                <p className="text-slate-400 text-sm">Scan the dynamic QR below to secure your spot</p>
                            </div>

                            <div className="relative mx-auto w-56 h-56 group/qr transition-transform duration-500 hover:scale-105">
                                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2.5rem] opacity-20 blur-2xl group-hover/qr:opacity-40 transition-opacity" />
                                <div className="relative h-full bg-white rounded-[2rem] p-4 flex items-center justify-center border border-white/20 shadow-2xl">
                                    <img src="/scan-me.jpeg" alt="Payment QR" className="w-[180px] h-[180px] object-contain" />
                                </div>
                            </div>

                            <div className="mt-8 bg-black/40 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
                                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
                                    <span>Plan Type</span>
                                    <span>Total Amount</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-white font-bold text-lg">{passType === 'combo' ? 'Combo Pass' : 'Standard Entry'}</span>
                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 tracking-tighter">
                                        {(passType === 'combo' && comboPassDetails) ? comboPassDetails : standardFeeString}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                                    Transaction ID (UTR) {event.prize === "Participation" ? "(Optional)" : <span className="text-pink-500">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    className={`w-full bg-white/5 border ${utrError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-white/10'} rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all`}
                                    placeholder="12-digit Ref No."
                                />
                                <AnimatePresence>
                                    {utrError && (
                                        <motion.p initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-[10px] font-black uppercase tracking-widest ml-1 mt-1">
                                            {utrError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Enter the date of payment done</label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        value={formData.paymentDate}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split("T")[0]}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Screenshot of payment showing UTR number <span className="text-pink-500">*</span></label>
                                    <div className="relative group/file">
                                        <input required type="file" name="paymentScreenshot" accept="image/*" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white transition-all group-hover/file:border-purple-500/50 flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            <span className="text-sm font-bold truncate max-w-[120px]">{formData.paymentScreenshot ? formData.paymentScreenshot.name : "Choose File"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                             <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">
                                Technical Support: <span className="text-white font-bold ml-1">Bharath</span>
                            </p>
                             <p className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-4">
                                <a href="tel:7975871167" className="text-purple-400 hover:text-purple-300 transition-colors">7975871167</a>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="text-pink-400">@bharatha01</span>
                            </p>
                        </div>

                        <div className="pt-4 flex justify-between items-center">
                            <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="px-8 py-4 rounded-2xl text-slate-500 font-bold hover:text-white transition-colors">
                                ← Edit Details
                            </button>
                            <button type="submit" disabled={isSubmitting} className={`group relative px-10 py-5 bg-gradient-to-r ${buttonGradients[cat] || buttonGradients.Tech} rounded-[2rem] text-white font-black uppercase tracking-widest text-sm ${buttonShadows[cat] || buttonShadows.Tech} transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3`}>
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Verifying...
                                    </div>
                                ) : (
                                    <>
                                        Complete Registration
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-12 max-w-2xl mx-auto w-full z-20 flex flex-col items-center"
                    >
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 sm:p-14 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full text-center">
                            <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-gradient-x" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />

                            <div className="relative mb-10">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl rotate-12 flex items-center justify-center mx-auto border border-green-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                    <div className="-rotate-12">
                                        <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    </div>
                                </div>
                                <div className="absolute -inset-2 bg-green-500/20 blur-2xl rounded-full opacity-50 -z-10" />
                            </div>

                            <h3 className="text-4xl font-black text-white tracking-tighter mb-4">Spot Secured!</h3>
                            <p className="text-slate-400 font-medium mb-12">Registration for <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold">{event.title}</span> is successful.</p>

                            <div className="bg-black/30 rounded-3xl p-8 border border-white/5 backdrop-blur-md space-y-4 mb-10 text-left">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">LEADER NAME</label>
                                    <span className="text-white font-bold">{formData.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Event Pass</label>
                                    <span className="text-purple-400 font-bold uppercase tracking-wider text-sm">{passType} Pass</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</label>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 text-[10px] font-black uppercase tracking-tighter">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        S E C U R E D
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.3em]">NOW YOU CAN DOWNLOAD ACCESS PASS IN DASHBOARD</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full">
                            <button onClick={handleDownloadPDF} disabled={isDownloading} className={`group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r ${buttonGradients[cat] || buttonGradients.Tech} text-white rounded-[2rem] font-black uppercase tracking-[0.15em] text-xs transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 overflow-hidden ${buttonShadows[cat] || buttonShadows.Tech}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                {isDownloading ? (
                                    <svg className="animate-spin h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                )}
                                {isDownloading ? "Preparing Pass..." : "Download Access Pass"}
                            </button>
                            <button onClick={onClose} className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 rounded-[2rem] font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-300">
                                Back to Home
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
