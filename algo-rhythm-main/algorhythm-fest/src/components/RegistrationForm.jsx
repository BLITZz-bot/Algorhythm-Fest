import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { jsPDF } from "jspdf"

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
        transactionId: "",
        paymentScreenshot: null
    })

    const comboPassDetails = event?.comboPass || event?.ComboPass;
    const standardFeeString = event?.fee || (event?.prize === "Participation" ? "Free" : "₹150");

    useEffect(() => {
        if (event && event.minTeamSize > 1) {
            setTeamMembers(Array.from({ length: event.minTeamSize - 1 }, () => ({ fullName: "", email: "", phone: "" })));
        } else {
            setTeamMembers([]);
        }
    }, [event]);

    const handleChange = (e) => {
        if (e.target.name === 'transactionId') setUtrError("");
        if (e.target.name === 'paymentScreenshot') {
            setFormData({ ...formData, paymentScreenshot: e.target.files[0] })
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (event.prize !== "Participation" && !formData.transactionId) {
            setUtrError("Please enter your Transaction ID (UTR) number.")
            return;
        }

        // Prepare FormData for multipart/form-data backend
        const submissionData = new FormData()
        submissionData.append("fullName", formData.fullName)
        submissionData.append("email", formData.email)
        submissionData.append("phone", formData.phone)
        submissionData.append("college", formData.college)
        submissionData.append("transactionId", formData.transactionId)
        submissionData.append("eventTitle", event.title)
        submissionData.append("teamMembers", JSON.stringify(teamMembers))

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
            alert("There was an error submitting your registration. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDownloadPDF = () => {
        setIsDownloading(true);

        try {
            const safeName = formData?.fullName ? formData.fullName.replace(/\s+/g, '_') : 'Attendee';
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Add background
            doc.setFillColor(248, 250, 252);
            doc.rect(0, 0, 210, 297, 'F');

            // Header Banner
            doc.setFillColor(79, 70, 229);
            // Overdraw slightly to ensure no white gaps in restrictive viewer margins
            doc.rect(-5, -5, 220, 45, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("REGISTRATION DETAILS", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text("AlgoRhythm Fest 2026", 105, 30, { align: "center" });

            // White container card
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(15, 50, 180, 230, 5, 5, 'FD');

            // Event Details
            doc.setTextColor(30, 41, 59);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.text(event.title, 25, 70);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            doc.text(`${event.time} | ${event.location}`, 25, 80);

            doc.setDrawColor(226, 232, 240);
            doc.line(25, 90, 185, 90);

            // Registrant Info
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text("REGISTRANT DETAILS", 25, 105);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.text(formData.fullName, 25, 115);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(71, 85, 105);
            doc.text(`College: ${formData.college}`, 25, 125);
            doc.text(`Email: ${formData.email}`, 25, 133);
            doc.text(`Phone: ${formData.phone}`, 25, 141);

            // Payment Info
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text("PAYMENT INFO", 130, 105);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(30, 41, 59);
            doc.text("Status:", 130, 115);

            const isFree = event.prize === "Participation";
            doc.setTextColor(5, 150, 105); // always green success
            doc.text(isFree ? "Free Registration" : "Successful", 150, 115);

            doc.setTextColor(30, 41, 59);
            doc.text("Total:", 130, 125);
            doc.setTextColor(79, 70, 229);

            // Dynamic fee parsing for PDF
            let pdfFeeText = (passType === 'combo' && comboPassDetails)
                ? comboPassDetails
                : standardFeeString;

            doc.text(pdfFeeText, 150, 125);

            if (formData.transactionId) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(148, 163, 184);
                doc.text("TRANSACTION REF (UTR)", 130, 145);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.setTextColor(51, 65, 85);
                doc.text(formData.transactionId, 130, 153);
            }

            // Team Members Module
            let currentY = 175;
            if (teamMembers && teamMembers.length > 0) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(148, 163, 184);
                doc.text("TEAM MEMBERS", 25, currentY);
                currentY += 10;

                teamMembers.forEach((member, idx) => {
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(11);
                    doc.setTextColor(30, 41, 59);
                    doc.text(`${idx + 2}. ${member.fullName}`, 25, currentY);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(100, 116, 139);
                    doc.text(`Email: ${member.email}  |  Phone: ${member.phone}`, 25, currentY + 6);
                    currentY += 16;
                });
            }

            doc.setDrawColor(226, 232, 240);
            doc.line(25, 265, 185, 265);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text("Thank you for registering for AlgoRhythm Fest!", 105, 273, { align: "center" });
            doc.text("This receipt is auto-generated and does not require a signature.", 105, 278, { align: "center" });

            doc.save(`Registration_Receipt_${safeName}.pdf`);
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
    const isTeamEvent = maxTeamSize > 1;

    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (teamMembers.length + 1 < minTeamSize) {
            alert(`This event requires a minimum team size of ${minTeamSize}. Please add ${minTeamSize - 1 - teamMembers.length} more member(s).`);
            return;
        }
        setStep(2);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 z-[60] bg-slate-900 flex flex-col overflow-y-auto w-full min-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {/* Header */}
                <div className="relative p-6 sm:p-10 border-b border-purple-500/30">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white transition bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                        ✕
                    </button>
                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
                        Register for {event.title}
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base">
                        {event.time} • {event.location}
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-10 flex-1 flex flex-col">
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            onSubmit={handleStep1Submit}
                            className="space-y-8 max-w-3xl mx-auto w-full my-auto"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-purple-200">Full Name <span className="text-pink-500">*</span></label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition" placeholder="John Doe" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-purple-200">Email Address <span className="text-pink-500">*</span></label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-purple-200">Phone Number <span className="text-pink-500">*</span></label>
                                    <input required type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" maxLength="10" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition" placeholder="9876543210" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-purple-200">College Name <span className="text-pink-500">*</span></label>
                                    <input required type="text" name="college" value={formData.college} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 text-lg text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition" placeholder="Your College" />
                                </div>
                            </div>

                            {isTeamEvent && (
                                <div className="pt-6 border-t border-purple-500/30">
                                    <h3 className="text-xl font-bold text-white mb-4">Team Members ({teamMembers.length + 1} / {maxTeamSize})</h3>
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4 relative">
                                            {index >= (minTeamSize - 1) && (
                                                <button type="button" onClick={() => {
                                                    const newMembers = [...teamMembers];
                                                    newMembers.splice(index, 1);
                                                    setTeamMembers(newMembers);
                                                }} className="absolute top-4 right-4 text-gray-400 hover:text-red-400 text-xl">✕</button>
                                            )}
                                            <h4 className="text-purple-300 font-medium mb-4">Member {index + 2} {index < (minTeamSize - 1) && "(Required)"}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200">Full Name <span className="text-pink-500">*</span></label>
                                                    <input required type="text" value={member.fullName} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].fullName = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-900" placeholder="Name" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200">Email <span className="text-pink-500">*</span></label>
                                                    <input required type="email" value={member.email} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].email = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-900" placeholder="Email" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-purple-200">Phone <span className="text-pink-500">*</span></label>
                                                    <input required type="tel" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" maxLength="10" value={member.phone} onChange={(e) => {
                                                        const newMembers = [...teamMembers];
                                                        newMembers[index].phone = e.target.value;
                                                        setTeamMembers(newMembers);
                                                    }} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2 mt-1 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 text-slate-900" placeholder="9876543210" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {teamMembers.length + 1 < maxTeamSize && (
                                        <button type="button" onClick={() => setTeamMembers([...teamMembers, { fullName: "", email: "", phone: "" }])} className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-xl border border-pink-500/20 hover:bg-pink-500/20 transition">
                                            + Add Team Member
                                        </button>
                                    )}
                                </div>
                            )}

                            {comboPassDetails && (
                                <div className="pt-6 border-t border-purple-500/30">
                                    <h3 className="text-xl font-bold text-white mb-4">Select Registration Type <span className="text-pink-500">*</span></h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all ${passType === 'standard' ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                            <input type="radio" name="passType" value="standard" checked={passType === 'standard'} onChange={() => setPassType('standard')} className="sr-only" />
                                            <span className="font-semibold text-white text-lg">Standard Pass</span>
                                            <span className="text-purple-300 mt-1">{standardFeeString}</span>
                                            {passType === 'standard' && <div className="absolute top-4 right-4 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                                        </label>

                                        <label className={`relative flex flex-col p-4 cursor-pointer rounded-2xl border-2 transition-all ${passType === 'combo' ? 'bg-amber-500/20 border-amber-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                            <input type="radio" name="passType" value="combo" checked={passType === 'combo'} onChange={() => setPassType('combo')} className="sr-only" />
                                            <span className="font-semibold text-white text-lg flex items-center gap-2">Combo Pass <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-amber-950 uppercase">Best Value</span></span>
                                            <span className="text-amber-300 mt-1 text-sm">{comboPassDetails}</span>
                                            {passType === 'combo' && <div className="absolute top-4 right-4 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-full"></div></div>}
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 flex justify-end">
                                <button type="submit" className="px-10 py-4 text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition hover:scale-105">
                                    Proceed to Payment →
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            onSubmit={handleSubmit}
                            className="space-y-10 max-w-2xl mx-auto w-full my-auto"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 pointer-events-none" />
                                <h3 className="text-lg font-semibold text-white mb-6">Scan the QR code below to complete your payment</h3>

                                {/* ========================================== */}
                                {/* 🖼️ REPLACE THE "src" BELOW WITH YOUR QR CODE */}
                                {/* Example: src="/your-qr-code.png"           */}
                                {/* ========================================== */}
                                <div className="mx-auto w-48 h-48 bg-white rounded-xl p-3 flex items-center justify-center mb-6">
                                    <img src="my-qr-code.png" alt="Payment QR" className="w-[150px] h-[150px] object-contain" />
                                </div>

                                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-xl">
                                    Amount to Pay: {(passType === 'combo' && comboPassDetails)
                                        ? comboPassDetails
                                        : standardFeeString}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-purple-200">
                                    Transaction ID {event.prize === "Participation" ? "(Optional)" : <span className="text-pink-500">*</span>}
                                </label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    value={formData.transactionId}
                                    onChange={handleChange}
                                    className={`w-full bg-white border ${utrError ? 'border-red-500 ring-2 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-pink-500 focus:ring-pink-500'} rounded-2xl px-6 py-4 text-lg text-slate-900 focus:outline-none focus:ring-2 transition`}
                                    placeholder="Enter UPI Ref No. (UTR)"
                                />
                                <AnimatePresence>
                                    {utrError && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-red-400 text-sm mt-1"
                                        >
                                            {utrError}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium text-purple-200">Upload Payment Screenshot (Showing UTR) <span className="text-pink-500">*</span></label>
                                <div className="w-full bg-white border border-gray-300 rounded-2xl px-6 py-4 flex items-center justify-center focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500 transition cursor-pointer relative group">
                                    <input
                                        required
                                        type="file"
                                        name="paymentScreenshot"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex items-center space-x-3 text-slate-600 group-hover:text-pink-600 transition">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        <span className="text-lg font-medium">{formData.paymentScreenshot ? formData.paymentScreenshot.name : "Choose an image..."}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Accepted formats: JPG, PNG. Max size: 5MB.</p>
                            </div>

                            <div className="pt-8 flex justify-between items-center">
                                <button type="button" onClick={() => setStep(1)} disabled={isSubmitting} className="px-8 py-4 text-lg rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50">
                                    ← Back
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-10 py-4 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed flex items-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : "Complete Registration"}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-8 max-w-2xl mx-auto w-full my-auto"
                        >
                            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

                                <div className="flex flex-col items-center text-center mb-8 relative z-10">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Registration Confirmed!</h3>
                                    <p className="text-gray-400">Your spot for <span className="text-pink-400 font-semibold">{event.title}</span> is secured.</p>
                                </div>

                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 relative z-10 mb-8 backdrop-blur-sm">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">Attendee</span>
                                        <span className="text-white font-medium text-right">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">Email</span>
                                        <span className="text-white font-medium text-right truncate pl-4">{formData.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">Phone</span>
                                        <span className="text-white font-medium text-right">{formData.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">College</span>
                                        <span className="text-white font-medium text-right">{formData.college}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-gray-400">Pass Type</span>
                                        <span className="text-white font-medium text-right capitalize">{passType} Pass</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-400">Payment Status</span>
                                        <span className="inline-flex py-1 px-3 rounded-full bg-green-500/20 text-green-400 font-medium text-sm border border-green-500/30">
                                            {standardFeeString === "Free" ? "Free" : "Pending Verification"}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-6 text-center">A copy of this receipt has been saved to your dashboard.</p>
                            </div>

                            <div className="text-center relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                                <button onClick={handleDownloadPDF} disabled={isDownloading} type="button" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait">
                                    {isDownloading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            Download Receipt
                                        </>
                                    )}
                                </button>
                                <button onClick={onClose} type="button" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition hover:scale-105 active:scale-95 disabled:opacity-50">
                                    Explore More
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
