import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { eventsDay1, eventsDay2 } from "./Schedule";

export default function MyRegistrations({ isOpen, onClose, initialEmail, autoDownload }) {
    const [searchEmail, setSearchEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [results, setResults] = useState([]);

    const allEvents = [...eventsDay1, ...eventsDay2];

    useEffect(() => {
        if (isOpen) {
            window.history.pushState({ modal: "registrations" }, "");
            const handlePopState = (e) => {
                if (!e.state || e.state.modal !== "registrations") {
                    onClose();
                }
            };
            window.addEventListener("popstate", handlePopState);
            return () => {
                window.removeEventListener("popstate", handlePopState);
                if (window.history.state?.modal === "registrations") {
                    window.history.back();
                }
            };
        } else {
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

    // Auto-search if initialEmail is provided (deep link)
    useEffect(() => {
        if (isOpen && initialEmail && results.length === 0) {
            setSearchEmail(initialEmail);
            const triggerSearch = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations/${encodeURIComponent(initialEmail)}`);
                    const data = await res.json();
                    if (data.success) {
                        setResults(data.data);
                        // Auto-download IF we have exactly one result and flag is set
                        if (autoDownload && data.data.length === 1) {
                            setTimeout(() => {
                                handleDownloadReceipt(data.data[0]);
                            }, 500); // Small delay to ensure allEvents is ready
                        }
                    }
                } catch (err) {
                    console.error("Auto-search failed", err);
                } finally {
                    setLoading(false);
                }
            };
            triggerSearch();
        }
    }, [isOpen, initialEmail]);

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

            const cat = event.category || "Tech";
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
                // 1. Solid Outside Background
                pageDoc.setFillColor(15, 17, 26);
                pageDoc.rect(0, 0, 180, 260, 'F');

                // 2. Main Ticket Container
                pageDoc.setDrawColor(...colors.border); 
                pageDoc.setLineWidth(1);
                pageDoc.roundedRect(8, 8, 164, 244, 15, 15, 'D');

                // 3. Inner Content Background
                pageDoc.setFillColor(30, 41, 59); 
                pageDoc.roundedRect(8, 8, 164, 244, 15, 15, 'F');

                // 4. HEADER BANNER (DYNAMIC)
                pageDoc.setFillColor(...colors.banner); 
                pageDoc.roundedRect(8, 8, 164, 50, 15, 15, 'F');
                pageDoc.rect(8, 25, 164, 33, 'F');

                // Header Text (MATCHING USER COORDINATES FROM REG FORM)
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.setFont("helvetica", "bold");
                pageDoc.setFontSize(24);
                pageDoc.text("ALGORHYTHM 3.0", 83, 25, { align: "center", charSpace: 1 });

                pageDoc.setFontSize(10);
                pageDoc.setFont("helvetica", "normal");
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("OFFICIAL ACCESS PASS", 65.9, 38, { align: "center", charSpace: 2.5 });

                // 5. Tear Line
                pageDoc.setDrawColor(71, 85, 105);
                pageDoc.setLineDash([2, 2], 0);
                pageDoc.line(15, 65, 165, 65);
                pageDoc.setLineDash([], 0);

                // Instruction (MATCHING USER COORDINATES)
                pageDoc.setFont("helvetica", "italic");
                pageDoc.setFontSize(7);
                pageDoc.setTextColor(148, 163, 184);
                pageDoc.text("PRESENT THIS PASS AT THE REGISTRATION DESK", 90, 240, { align: "center" });

                // Barcode (MATCHING USER COORDINATES)
                pageDoc.setFillColor(140, 130, 140); 
                const barcodeBars = 40;
                const barcodeWidth = barcodeBars * 2;
                const startXPos = (180 - barcodeWidth) / 2;
                for (let i = 0; i < barcodeBars; i++) {
                    const widthLimit = Math.random() * 1 + 0.3;
                    pageDoc.rect(startXPos + (i * 2), 242, widthLimit, 8, 'F');
                }

                // Footer Text (MATCHING USER COORDINATES)
                pageDoc.setFont("helvetica", "bold");
                pageDoc.setCharSpace(2);
                pageDoc.setFontSize(8);
                pageDoc.setTextColor(255, 255, 255);
                pageDoc.text("THANKS FOR REGISTERING!", 67, 259, { align: "center" });
                pageDoc.setCharSpace(0);

                // Vertical Watermark (MATCHING USER COORDINATES)
                pageDoc.setFontSize(7);
                pageDoc.setTextColor(51, 65, 85);
                pageDoc.text("DESIGNED BY GRAFIK", 173, 235, { angle: 90 });
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
            const ticketId = registration.transactionId || `ALG-${Math.floor(Math.random() * 1000000)}`;
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

            // 8. TIME & VENUE BOX
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
            doc.setTextColor(...(colors.label || [253, 164, 175])); 
            doc.text("PARTICIPANTS DETAILS", 20, currentY);
            currentY += 10;

            if (registration.teamName) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(...colors.border);
                doc.text(`TEAM: ${registration.teamName.toUpperCase()}`, 20, currentY);
                currentY += 8;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            doc.text(registration.fullName.toUpperCase(), 20, currentY);
            currentY += 10;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text(`College: ${registration.college}`, 20, currentY);
            currentY += 7;
            doc.text(`Email: ${registration.email}`, 20, currentY);
            currentY += 7;
            doc.text(`Phone: ${registration.phone}`, 20, currentY);
            
            // 10. FINANCIALS
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...(colors.label || [253, 164, 175]));
            doc.text(registration.passType === 'Combo Pass' ? "COMBO PASS FEE" : "STANDARD FEE", 20, 230);
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            let feeText = registration.amountPaid ? registration.amountPaid.toString().replace(/₹/g, "Rs. ") : "Free";
            doc.text(feeText, 20, 238);


            // PAGE 2 (TEAM MEMBERS)
            const teamMembers = registration.teamMembers || [];
            if (teamMembers.length > 0) {
                doc.addPage([180, 260], 'portrait');
                drawTicketBase(doc);

                let teamY = 80;
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(...colors.border);
                doc.text(registration.teamName ? `TEAM: ${registration.teamName.toUpperCase()}` : "TEAM MEMBERS", 90, teamY, { align: "center" });
                teamY += 15;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(203, 213, 225);
                
                teamMembers.forEach((m, i) => {
                    if (teamY > 220) {
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
                                            <p className="text-sm font-semibold text-purple-400 mb-1">{reg.fullName.toUpperCase()} <span className="text-gray-500 font-normal">| {reg.passType || "Standard Pass"}</span></p>
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
