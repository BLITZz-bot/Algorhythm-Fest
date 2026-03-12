import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { eventsDay1, eventsDay2 } from "./Schedule";

export default function MyRegistrations({ isOpen, onClose }) {
    const [searchEmail, setSearchEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);

    const allEvents = [...eventsDay1, ...eventsDay2];

    useEffect(() => {
        if (!isOpen) {
            setSearchEmail("");
            setResults([]);
            setError("");
            setLoading(false);
        }
    }, [isOpen]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchEmail) return;

        setLoading(true);
        setError("");
        setResults([]);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${encodeURIComponent(searchEmail)}`);
            const data = await res.json();

            if (res.ok && data.success) {
                setResults(data.data);
            } else {
                setError(data.message || "No registrations found.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReceipt = (registration) => {
        // Find the full event details to rebuild the receipt
        const event = allEvents.find(e => e.title === registration.eventTitle);

        if (!event) {
            alert("Could not find event details for this registration.");
            return;
        }

        try {
            const safeName = registration.fullName ? registration.fullName.replace(/\s+/g, '_') : 'Attendee';
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
            doc.text(registration.fullName, 25, 115);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(71, 85, 105);
            doc.text(`College: ${registration.college}`, 25, 125);
            doc.text(`Email: ${registration.email}`, 25, 133);
            doc.text(`Phone: ${registration.phone}`, 25, 141);

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
            doc.setTextColor(5, 150, 105); // green
            doc.text(isFree ? "Free Registration" : "Successful", 150, 115);

            doc.setTextColor(30, 41, 59);
            doc.text("Total:", 130, 125);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(79, 70, 229); // indigo
            doc.text(isFree ? "Rs. 0" : "Rs. 150", 150, 125);

            if (!isFree) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(148, 163, 184);
                doc.text("TRANSACTION REF (UTR)", 130, 146);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(12);
                doc.setTextColor(71, 85, 105);
                doc.text(registration.transactionId || "N/A", 130, 154);
            }

            // Team Members Module
            let currentY = 175;
            const teamMembers = registration.teamMembers || [];
            if (teamMembers.length > 0) {
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

            doc.save(`AlgoRhythm_Receipt_${safeName}_${event.title.replace(/\s+/g, '')}.pdf`);
        } catch (err) {
            console.error("PDF Gen Error:", err);
            alert("Failed to generate PDF document.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* MODAL */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0f111a] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-900/50 overflow-y-auto max-h-[90vh]"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>

                        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            Your Registrations
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Enter the Leader's email address used during registration to find your access pass.
                        </p>

                        {/* SEARCH FORM */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
                            <input
                                type="email"
                                required
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="name@college.edu"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </form>

                        {/* ERROR MSG */}
                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">
                                {error}
                            </motion.div>
                        )}

                        {/* RESULTS */}
                        {results.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white/90 mb-4 border-b border-white/10 pb-2">
                                    Found {results.length} Registration{results.length > 1 ? 's' : ''}
                                </h3>

                                {results.map((reg) => (
                                    <motion.div
                                        key={reg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                                    >
                                        <div>
                                            <h4 className="font-bold text-xl text-white mb-1">{reg.eventTitle}</h4>
                                            <p className="text-sm text-gray-400">Registered on: {new Date(reg.timestamp).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Status: <span className="text-emerald-400 font-medium">Successful</span>
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDownloadReceipt(reg)}
                                            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 m-0 sm:ml-auto"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            Download Receipt
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
