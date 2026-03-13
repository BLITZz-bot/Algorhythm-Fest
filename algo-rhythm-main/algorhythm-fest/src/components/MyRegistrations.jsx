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
                format: [180, 260]
            });

            // 1. Dark Background (Slate 900)
            doc.setFillColor(15, 23, 42);
            doc.rect(0, 0, 180, 260, 'F');

            // 2. Ticket Outline/Container
            doc.setDrawColor(168, 85, 247); // Purple 500
            doc.setLineWidth(1);
            doc.roundedRect(5, 5, 170, 250, 8, 8, 'D');

            // Inner dark card fill
            doc.setFillColor(30, 41, 59); // Slate 800
            doc.roundedRect(5, 5, 170, 250, 8, 8, 'F');

            // 3. Header Banner Block
            doc.setFillColor(219, 39, 119); // Pink 600
            doc.roundedRect(5, 5, 170, 45, 8, 8, 'F');
            doc.rect(5, 20, 170, 30, 'F');

            // Header Text
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("A L G O R H Y T H M  3 . 0", 90, 21, { align: "center" });

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(253, 164, 175); // Pink 300
            doc.text("O F F I C I A L   A C C E S S   P A S S", 90, 33, { align: "center" });

            // 4. Barcode/Ticket Tear Line
            doc.setDrawColor(71, 85, 105); // Slate 600
            doc.setLineDash([3, 3], 0);
            doc.line(10, 60, 170, 60);
            doc.setLineDash([], 0);

            // 5. Registration ID & Status Badge
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184); // Slate 400
            doc.text("UTR NO:", 15, 75);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(255, 255, 255);
            const ticketId = registration.transactionId ? registration.transactionId.substring(0, 16).toUpperCase() : `ALG-${Math.floor(Math.random() * 1000000)}`;
            doc.text(ticketId, 15, 81);

            // Status Badge
            doc.setFillColor(16, 185, 129); // Emerald 500
            doc.roundedRect(140, 71, 30, 12, 6, 6, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            const isFree = event.prize === "Participation";
            doc.text(isFree ? "FREE" : "VERIFIED", 155, 79, { align: "center" });

            // 6. MAIN EVENT DETAILS
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(168, 85, 247); // Purple 500
            doc.text(event.title.toUpperCase(), 90, 105, { align: "center" });

            // Time & Location Box
            doc.setFillColor(15, 23, 42); 
            doc.roundedRect(15, 115, 150, 24, 4, 4, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.text("TIME:", 25, 125);
            doc.text("VENUE:", 85, 125);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(203, 213, 225); // slate 300
            doc.text(event.time, 25, 133);

            const venueLines = doc.splitTextToSize(event.location, 75);
            doc.text(venueLines, 85, 133);

            // 7. ATTENDEE DATA
            let currentY = 160;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(253, 164, 175); // Pink 300
            doc.text("PARTICIPANTS DETAILS", 15, currentY);
            currentY += 8;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(15);
            doc.setTextColor(255, 255, 255);
            doc.text(registration.fullName.toUpperCase(), 15, currentY);
            currentY += 8;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184); // slate 400
            doc.text(`College: ${registration.college}`, 15, currentY);
            currentY += 6;
            doc.text(`Email: ${registration.email}`, 15, currentY);
            currentY += 6;
            doc.text(`Phone: ${registration.phone}`, 15, currentY);
            currentY += 12;

            // 8. TEAM MODULE
            const teamMembers = registration.teamMembers || [];
            if (teamMembers.length > 0) {
                if (registration.teamName) {
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(10);
                    doc.setTextColor(168, 85, 247); // purple 500
                    doc.text(`TEAM: ${registration.teamName.toUpperCase()}`, 15, currentY);
                    currentY += 6;
                }

                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(203, 213, 225); // slate 300

                teamMembers.forEach((m, i) => {
                    const memberLine = `${i + 1}. ${m.fullName} | ${m.email} | ${m.phone}`;
                    const textLines = doc.splitTextToSize(memberLine, 150);
                    doc.text(textLines, 15, currentY);
                    currentY += (textLines.length * 4);
                });
            }

            // 9. FINANCIALS
            let pdfFeeText = registration.amountPaid ? registration.amountPaid.toString().replace(/₹/g, "Rs. ") : "Free";
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(253, 164, 175); // Pink 300
            doc.text(registration.passType || "REGISTRATION FEE", 15, 232);

            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.text(pdfFeeText, 15, 238);

            // 10. FOOTER
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text("Present this digital pass at the registration desk for entry.", 90, 242, { align: "center" });

            // Visual flair
            doc.setFillColor(148, 163, 184); 
            for (let i = 0; i < 45; i++) {
                const width = Math.random() * 2 + 0.3;
                doc.rect(12 + (i * 3.5), 244, width, 8, 'F');
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(7)
            doc.setTextColor(255, 255, 255);
            doc.text("THANKS FOR REGISTERING!", 78, 259, { align: "center", charSpace: 1 });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.setTextColor(51, 65, 85); 
            doc.text("DESIGNED BY GRAFIK", 173, 248, { angle: 90 });

            doc.save(`Access_Pass_${safeName}.pdf`);
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
