import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { eventsDay1, eventsDay2 } from './Schedule';

export default function AdminDashboard({ isOpen, onClose }) {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [registrations, setRegistrations] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterEvent, setFilterEvent] = useState("All");
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [emailing, setEmailing] = useState(false);
    const [emailStatus, setEmailStatus] = useState("");
    const [countdown, setCountdown] = useState(30);
    const [activeTab, setActiveTab] = useState("registrations");
    const [eventStatuses, setEventStatuses] = useState([]);
    const [deleteTargetId, setDeleteTargetId] = useState(null); // null for 'all', or specific id
    const [deleteTargetName, setDeleteTargetName] = useState("");
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [clearPassword, setClearPassword] = useState("");
    const [clearConfirm, setClearConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [clearError, setClearError] = useState("");
    const [isResendModalOpen, setIsResendModalOpen] = useState(false);
    const [resendPassword, setResendPassword] = useState("");
    const [resendConfirm, setResendConfirm] = useState(false);
    const [resendError, setResendError] = useState("");

    // Secondary Authentication states
    const [isManageAuth, setIsManageAuth] = useState(false);
    const [isEmailAuth, setIsEmailAuth] = useState(false);
    const [managePassInput, setManagePassInput] = useState("");
    const [emailPassInput, setEmailPassInput] = useState("");
    const [manageAuthErr, setManageAuthErr] = useState("");
    const [emailAuthErr, setEmailAuthErr] = useState("");

    const [individualResending, setIndividualResending] = useState({}); // Tracking individual resends
    const [resending, setResending] = useState(false);

    // Custom Notifications (Toasts)
    const [toasts, setToasts] = useState([]);
    
    // Custom Action Confirmation
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        type: "primary"
    });

    const addToast = (message, type = "success") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    const handleActionConfirm = (title, message, onConfirm, type = "primary") => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
            },
            type
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "algorhythm@admin2026") {
            setIsAuthenticated(true);
            setLoginError("");
            fetchRegistrations(password); // Automatically load data instantly on successful login
            fetchEventStatuses(); // Load event toggles
        } else {
            setLoginError("Invalid Admin Password");
        }
    };

    const handleManageAuth = (e) => {
        e.preventDefault();
        if (managePassInput === "bharatha2111") {
            setIsManageAuth(true);
            setManageAuthErr("");
        } else {
            setManageAuthErr("Incorrect Password");
        }
    };

    const handleEmailAuth = (e) => {
        e.preventDefault();
        if (emailPassInput === "bharatha2111") {
            setIsEmailAuth(true);
            setEmailAuthErr("");
        } else {
            setEmailAuthErr("Incorrect Password");
        }
    };

    const resendIndividualEmail = async (reg) => {
        handleActionConfirm(
            "Confirm Resend",
            `Resend confirmation email to ${reg.fullName}?`,
            async () => {
                setIndividualResending(prev => ({ ...prev, [reg.id]: true }));
                try {
                    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend-confirmation/${reg.id}`, {
                        method: 'POST',
                        headers: { 'x-admin-password': password }
                    });
                    const data = await res.json();
                    if (data.success) {
                        addToast(`✅ Success: Sent to ${reg.email}`, "success");
                    } else {
                        addToast(`❌ Failed: ${data.message}`, "error");
                    }
                } catch (err) {
                    addToast("❌ Server Error", "error");
                } finally {
                    setIndividualResending(prev => ({ ...prev, [reg.id]: false }));
                }
            },
            "primary"
        );
    };

    const fetchEventStatuses = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/status?t=${Date.now()}`);
            const data = await res.json();
            if (data.success) {
                setEventStatuses(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch event statuses", err);
        }
    };

    const toggleEventStatus = async (eventTitle, currentStatus) => {
        // Optimistic update for instant UI feedback
        setEventStatuses(prev => {
            const next = [...prev];
            const idx = next.findIndex(s => s.title === eventTitle);
            if (idx >= 0) {
                next[idx].isOpen = !currentStatus;
            } else {
                next.push({ title: eventTitle, isOpen: !currentStatus });
            }
            return next;
        });

        // Broadcast instant payload to the rest of the app
        window.dispatchEvent(new CustomEvent('eventStatusChanged', {
            detail: { eventTitle, isOpen: !currentStatus }
        }));

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/events/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-password': password
                },
                body: JSON.stringify({ eventTitle, isOpen: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchEventStatuses(); // background sync
            } else {
                fetchEventStatuses(); // revert on fail
            }
        } catch (err) {
            console.error("Toggle failed", err);
            fetchEventStatuses(); // revert on error
        }
    };

    const sendToAdminEmail = async () => {
        setEmailing(true);
        addToast("📤 Preparing registration report...", "info");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/send-report`, {
                method: 'POST',
                headers: { 'x-admin-password': password }
            });
            const data = await res.json();
            if (data.success) {
                addToast("📬 Report Emailed Successfully!", "success");
            } else {
                addToast(data.message || "Email Failed", "error");
            }
        } catch (err) {
            addToast("❌ Connection Error", "error");
        } finally {
            setEmailing(false);
        }
    };

    const resendAllConfirmations = async () => {
        if (resendPassword !== "algorhythm@admin2026") {
            setResendError("Incorrect password");
            return;
        }
        if (!resendConfirm) {
            setResendConfirm(true);
            setResendError("");
            return;
        }

        setResending(true);
        setResendError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/resend-all-confirmations`, {
                method: 'POST',
                headers: { 'x-admin-password': resendPassword }
            });
            const data = await res.json();
            if (data.success) {
                addToast(`✅ ${data.message}`, "success");
                setIsResendModalOpen(false);
                setResendPassword("");
                setResendConfirm(false);
            } else {
                setResendError(data.message || "Failed");
            }
        } catch (err) {
            setResendError("Server Error - check connection");
        } finally {
            setResending(false);
        }
    };

    const handleClearRegistrations = async () => {
        if (clearPassword !== "algorhythm@admin2026") {
            setClearError("Incorrect password");
            return;
        }
        if (!clearConfirm) {
            setClearConfirm(true);
            setClearError("");
            return;
        }

        setClearing(true);
        setClearError("");
        try {
            const url = deleteTargetId
                ? `${import.meta.env.VITE_API_URL}/api/admin/registrations/${deleteTargetId}`
                : `${import.meta.env.VITE_API_URL}/api/admin/registrations-all`;

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'x-admin-password': clearPassword }
            });
            const data = await res.json();
            if (data.success) {
                addToast(`✅ ${data.message}`, "success");
                setIsClearModalOpen(false);
                setClearPassword("");
                setClearConfirm(false);
                setDeleteTargetId(null);
                setDeleteTargetName("");
                fetchRegistrations(); // Refresh data
            } else {
                setClearError(data.message || "Action Failed");
            }
        } catch (err) {
            setClearError("Server Error during operation");
        } finally {
            setClearing(false);
        }
    };

    const fetchRegistrations = async (pass) => {
        setLoading(true);
        setFetchError("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/registrations`, {
                headers: { 'x-admin-password': pass || password }
            });
            const data = await res.json();
            if (data.success) {
                setRegistrations(data.data);
                setFilteredData(data.data);
            } else {
                setFetchError(data.message || "Failed to fetch registrations");
            }
        } catch (err) {
            setFetchError("Connection error. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    // Reset password on close and handle back button
    useEffect(() => {
        if (isOpen) {
            window.history.pushState({ modal: "admin" }, "");
            const handlePopState = (e) => {
                if (!e.state || e.state.modal !== "admin") {
                    onClose();
                }
            };
            window.addEventListener("popstate", handlePopState);
            return () => {
                window.removeEventListener("popstate", handlePopState);
                if (window.history.state?.modal === "admin") {
                    window.history.back();
                }
            };
        } else {
            setIsAuthenticated(false);
            setIsManageAuth(false);
            setIsEmailAuth(false);
            setPassword("");
            setManagePassInput("");
            setEmailPassInput("");
            setLoginError("");
        }
    }, [isOpen]);

    // Auto-refresh timer
    useEffect(() => {
        let timer;
        if (isAuthenticated && isOpen) {
            timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        fetchRegistrations(); // It uses the `password` state seamlessly now
                        return 30;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setCountdown(30);
        }
        return () => clearInterval(timer);
    }, [isAuthenticated, isOpen, password]);

    // Handle filtering
    useEffect(() => {
        if (filterEvent === "All") {
            setFilteredData(registrations);
        } else {
            setFilteredData(registrations.filter(r => r.eventTitle === filterEvent));
        }
    }, [filterEvent, registrations]);

    const downloadExcel = async () => {
        if (registrations.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'AlgoRhythm Admin';
        workbook.lastModifiedBy = 'AlgoRhythm Admin';
        workbook.created = new Date();

        // Group data by event
        const grouped = registrations.reduce((acc, curr) => {
            const title = curr.eventTitle || "Uncategorized";
            if (!acc[title]) acc[title] = [];
            acc[title].push(curr);
            return acc;
        }, {});

        Object.keys(grouped).sort().forEach(eventTitle => {
            // Sheet name max 31 chars, no special chars
            const sheetName = eventTitle.substring(0, 31).replace(/[\\\?\*\[\]\/]/g, "");
            const worksheet = workbook.addWorksheet(sheetName);

            // Define columns
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

            // Style headers
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '9333EA' } // Purple-600
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Add data
            grouped[eventTitle].forEach(reg => {
                const row = worksheet.addRow({
                    passType: reg.passType || "Standard Pass",
                    amountPaid: reg.amountPaid || "N/A",
                    teamName: reg.teamName || "N/A",
                    id: reg.id,
                    timestamp: new Date(reg.timestamp).toLocaleString('en-IN'),
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
                    screenshot: reg.screenshotPath || "N/A"
                });

                // Add formatting for better readability
                row.getCell('teamMembers').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('college').alignment = { wrapText: true, vertical: 'top' };

                // Style link cell
                if (reg.screenshotPath) {
                    const linkCell = row.getCell('screenshot');
                    linkCell.value = {
                        text: 'Link to Screenshot',
                        hyperlink: reg.screenshotPath
                    };
                    linkCell.font = { color: { argb: '2563EB' }, underline: true };
                }
            });

            // Freeze first row
            worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `AlgoRhythm_2026_Master_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    };



    const uniqueEvents = ["All", ...new Set(registrations.map(r => r.eventTitle))];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f18] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-[#0a0f18] to-[#0a0f18]">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                />

                {!isAuthenticated ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full max-w-md bg-[#1a1c2e] border border-white/10 rounded-3xl p-8 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center underline decoration-purple-500 underline-offset-8">Admin Access</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                                    placeholder="••••••••"
                                />
                            </div>
                            {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
                            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition">
                                Enter Dashboard
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative w-full h-full max-w-[100vw] max-h-screen bg-[#0f111a] p-4 sm:p-6 md:p-12 overflow-hidden flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Console</h2>
                                <p className="text-gray-400 text-xs md:text-sm">Live Registration Details</p>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-2 sm:gap-3">
                                <button onClick={() => { fetchRegistrations(); setCountdown(30); }} className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] sm:text-sm hover:bg-white/10 transition flex items-center gap-1.5 min-w-0">
                                    <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    <span className="truncate">Refresh ({countdown}s)</span>
                                </button>
                                <button onClick={downloadExcel} className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[10px] sm:text-sm hover:bg-emerald-600/30 transition flex items-center gap-1.5 font-semibold min-w-0">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <span className="hidden sm:inline">Export Excel</span>
                                    <span className="sm:hidden">EXCEL</span>
                                </button>
                                <button
                                    onClick={sendToAdminEmail}
                                    disabled={emailing}
                                    className={`px-3 py-2 border rounded-xl text-[10px] sm:text-sm transition flex items-center gap-1.5 font-semibold min-w-0 ${emailing ? 'bg-gray-600/20 border-gray-500/30 text-gray-500' : 'bg-pink-600/20 border-pink-500/30 text-pink-400 hover:bg-pink-600/30'}`}
                                >
                                    <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${emailing ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    <span className="hidden sm:inline">{emailing ? 'Sending...' : 'GMAIL REPORT'}</span>
                                    <span className="sm:hidden">GMAIL</span>
                                </button>
                                <button onClick={onClose} className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* TABS - Optimized for Mobile Scrolling */}
                        <div className="relative mb-6">
                            <div className="flex border-b border-white/10 gap-4 sm:gap-6 overflow-x-auto whitespace-nowrap hide-scrollbar pr-10">
                                <button
                                    onClick={() => setActiveTab("registrations")}
                                    className={`text-xs sm:text-sm font-bold pb-3 px-1 sm:px-2 transition-colors flex-shrink-0 ${activeTab === "registrations" ? "text-purple-400 border-b-2 border-purple-500 font-extrabold" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    Registrations Data
                                </button>
                                <button
                                    onClick={() => setActiveTab("controls")}
                                    className={`text-xs sm:text-sm font-bold pb-3 px-1 sm:px-2 transition-colors flex-shrink-0 ${activeTab === "controls" ? "text-purple-400 border-b-2 border-purple-500 font-extrabold" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    Event Settings
                                </button>
                                <button
                                    onClick={() => setActiveTab("manage")}
                                    className={`text-xs sm:text-sm font-bold pb-3 px-1 sm:px-2 transition-colors flex-shrink-0 ${activeTab === "manage" ? "text-red-400 border-b-2 border-red-500 font-extrabold" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    Manage Data
                                </button>
                                <button
                                    onClick={() => setActiveTab("emails")}
                                    className={`text-xs sm:text-sm font-bold pb-3 px-1 sm:px-2 transition-colors flex-shrink-0 ${activeTab === "emails" ? "text-amber-400 border-b-2 border-amber-500 font-extrabold" : "text-gray-500 hover:text-gray-300"}`}
                                >
                                    Bulk Resend
                                </button>
                            </div>
                            <div className="absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-[#0f111a] to-transparent pointer-events-none md:hidden" />
                        </div>

                        {activeTab === "registrations" ? (
                            <>
                                {/* FILTERS */}
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-gray-400 text-sm font-medium">Filter by Event:</span>
                                    <select
                                        value={filterEvent}
                                        onChange={(e) => setFilterEvent(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition cursor-pointer"
                                    >
                                        {uniqueEvents.map(ev => <option key={ev} value={ev} className="bg-[#1a1c2e]">{ev}</option>)}
                                    </select>
                                    <span className="ml-auto text-purple-400 font-bold">{filteredData.length} records found</span>
                                </div>

                                {/* TABLE */}
                                <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/20">
                                    {fetchError ? (
                                        <div className="p-20 text-center">
                                            <p className="text-red-400">{fetchError}</p>
                                            <button onClick={() => fetchRegistrations()} className="mt-4 text-purple-400 underline uppercase text-xs font-bold tracking-widest">Retry Connection</button>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left border-collapse min-w-[1000px]">
                                            <thead className="sticky top-0 bg-[#1a1c2e] z-10">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Student</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Contact Info</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Event Details</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Team</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Payment Date</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Pass Type</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Amount</th>
                                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">UTR No</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10">
                                                {filteredData.length > 0 ? filteredData.map((reg) => (
                                                    <tr key={reg.id} className="hover:bg-white/5 transition">
                                                        <td className="px-6 py-5">
                                                            <div className="font-bold text-white">{reg.fullName}</div>
                                                            <div className="text-xs text-purple-400 mt-1">{reg.college}</div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <a href={`mailto:${reg.email}`} title="Click to email student" className="text-sm text-blue-400 hover:underline block mb-1 flex items-center gap-2">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                {reg.email}
                                                            </a>
                                                            <div className="text-sm text-gray-400">{reg.phone}</div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-sm font-semibold text-white">{reg.eventTitle}</div>
                                                            <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Reg: {new Date(reg.timestamp).toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            {reg.teamMembers?.length > 0 ? (
                                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                                    {reg.teamMembers.map((m, idx) => (
                                                                        <span key={idx} className="text-[9px] bg-purple-500/10 px-2 py-0.5 rounded-md text-purple-300 border border-purple-500/20 whitespace-nowrap">
                                                                            {m.fullName}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : <span className="text-gray-600 text-[10px]">Individual</span>}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-300 font-bold">
                                                            {reg.paymentDate || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${reg.passType === 'Combo Pass' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/10 text-blue-300'}`}>
                                                                {reg.passType || "Standard"}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                            {reg.amountPaid || "N/A"}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                            {reg.transactionId}
                                                        </td>
                                                        <td className="px-6 py-5 flex items-center gap-4">
                                                            {reg.screenshotPath ? (
                                                                <a
                                                                    href={reg.screenshotPath}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                                                                >
                                                                    SCREENSHOT
                                                                </a>
                                                            ) : <span className="text-gray-600 text-[10px] italic">NONE</span>}
                                                            <button 
                                                                onClick={() => resendIndividualEmail(reg)}
                                                                disabled={individualResending[reg.id]}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${individualResending[reg.id] ? 'bg-gray-700 text-gray-400' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30'}`}
                                                            >
                                                                <svg className={`w-3 h-3 ${individualResending[reg.id] ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                {individualResending[reg.id] ? 'RESENDING...' : 'RESEND'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="9" className="px-6 py-20 text-center text-gray-500 italic">No registrations found for this selection.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </>
                        ) : activeTab === "controls" ? (
                            <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Event Registerations Control</h3>
                                <p className="text-gray-400 text-sm mb-8">Use this section to control the registration status of events.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...eventsDay1, ...eventsDay2].map(eventObj => {
                                        const ev = eventObj.title;
                                        const statusObj = eventStatuses.find(s => s.title === ev);
                                        const isOpen = statusObj ? statusObj.isOpen : true; // default true
                                        return (
                                            <div key={ev} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between shadow-lg hover:border-white/20 transition-colors">
                                                <span className="text-white font-medium pr-4">{ev}</span>
                                                <button
                                                    onClick={() => toggleEventStatus(ev, isOpen)}
                                                    className={`px-4 py-2 rounded-lg text-xs tracking-wider font-bold transition-all shadow-md ${isOpen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30'}`}
                                                >
                                                    {isOpen ? "OPEN" : "CLOSED"}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : activeTab === "manage" ? (
                            <div className="flex-1 overflow-auto rounded-3xl border border-white/10 bg-[#0f111a] flex flex-col items-center justify-center">
                                {!isManageAuth ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-w-sm w-full p-8 bg-white/5 border border-white/10 rounded-3xl shadow-2xl text-center"
                                    >
                                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Manage Access</h3>
                                        <p className="text-gray-400 text-sm mb-6">Secondary authentication required to modify registration records.</p>
                                        <form onSubmit={handleManageAuth} className="space-y-4">
                                            <input
                                                type="password"
                                                autoFocus
                                                value={managePassInput}
                                                onChange={(e) => setManagePassInput(e.target.value)}
                                                placeholder="Secondary Password"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition"
                                            />
                                            {manageAuthErr && <p className="text-red-400 text-xs font-bold">{manageAuthErr}</p>}
                                            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition">
                                                Unlock Manage Data
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full p-8 overflow-auto">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-bold text-white">Manage Database</h3>
                                            <button 
                                                onClick={() => { setDeleteTargetId(null); setDeleteTargetName("ALL"); setIsClearModalOpen(true); }}
                                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg"
                                            >
                                                PURGE ALL DATA
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {registrations.map((reg) => (
                                                <div key={reg.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                                    <div className="overflow-hidden">
                                                        <div className="text-white font-bold text-sm truncate">{reg.fullName}</div>
                                                        <div className="text-gray-500 text-[10px] truncate">{reg.eventTitle}</div>
                                                    </div>
                                                    <button onClick={() => { setDeleteTargetId(reg.id); setDeleteTargetName(reg.fullName); setIsClearModalOpen(true); }} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold hover:bg-red-500 hover:text-white transition">DELETE</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-auto rounded-3xl border border-white/10 bg-[#0f111a] flex flex-col items-center justify-center">
                                {!isEmailAuth ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="max-w-sm w-full p-8 bg-white/5 border border-white/10 rounded-3xl shadow-2xl text-center"
                                    >
                                        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-400">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">Bulk Email Access</h3>
                                        <p className="text-gray-400 text-sm mb-6">Secondary authentication required for bulk communication actions.</p>
                                        <form onSubmit={handleEmailAuth} className="space-y-4">
                                            <input
                                                type="password"
                                                autoFocus
                                                value={emailPassInput}
                                                onChange={(e) => setEmailPassInput(e.target.value)}
                                                placeholder="Secondary Password"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                                            />
                                            {emailAuthErr && <p className="text-red-400 text-xs font-bold">{emailAuthErr}</p>}
                                            <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition">
                                                Unlock Bulk Actions
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <div className="w-full h-full p-2 sm:p-6 flex flex-col">
                                        {/* Bulk Section */}
                                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-4 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start mb-1 sm:mb-2">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-lg sm:rounded-xl flex items-center justify-center text-amber-500">
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                                                    </div>
                                                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">Bulk Resend Tool</h3>
                                                </div>
                                                <p className="text-gray-400 text-xs sm:text-sm max-w-md">Sends tickets to every student in the database.</p>
                                            </div>
                                            <button 
                                                onClick={() => { setIsResendModalOpen(true); setResendError(""); setResendPassword(""); setResendConfirm(false); }}
                                                className="w-full md:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl sm:rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap text-xs sm:text-sm"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                                TRIGGER SYSTEM-WIDE RESEND
                                            </button>
                                        </div>

                                        {/* Individual Section */}
                                        <div className="flex-1 flex flex-col min-h-0">
                                            <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
                                                <h4 className="text-[10px] sm:text-sm font-bold text-gray-500 sm:text-gray-400 uppercase tracking-widest">Individual Quick Resend</h4>
                                                <span className="text-[8px] sm:text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 sm:py-1 rounded-md">{registrations.length} STUDENTS</span>
                                            </div>
                                            <div className="flex-1 overflow-auto rounded-xl sm:rounded-2xl border border-white/5 bg-white/[0.02]">
                                                {registrations.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2 sm:gap-3 p-2 sm:p-3">
                                                        {registrations.map((reg) => (
                                                            <div key={reg.id} className="bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between hover:bg-white/[0.08] transition-colors group gap-2 overflow-hidden">
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="text-white font-bold text-xs sm:text-sm truncate">{reg.fullName}</div>
                                                                    <div className="flex flex-col gap-0.5 mt-0.5 sm:mt-1">
                                                                        <div className="text-gray-500 text-[9px] sm:text-[10px] truncate flex items-center gap-1">
                                                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                            <span className="truncate">{reg.email}</span>
                                                                        </div>
                                                                        <div className="text-gray-500 text-[9px] sm:text-[10px] truncate flex items-center gap-1">
                                                                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                                            {reg.phone}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => resendIndividualEmail(reg)}
                                                                    disabled={individualResending[reg.id]}
                                                                    className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold transition flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0 ${individualResending[reg.id] ? 'bg-gray-700 text-gray-500' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white group-hover:scale-105'}`}
                                                                >
                                                                    {individualResending[reg.id] ? (
                                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                                    ) : (
                                                                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                                    )}
                                                                    {individualResending[reg.id] ? '...' : 'RESEND'}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-20 text-center text-gray-600 italic">No registrations found.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* CLEAR CONFIRMATION MODAL */}
                {isClearModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#1a1c2e] border border-red-500/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{clearConfirm ? "FINAL WARNING!" : "Administrative Action"}</h3>
                            <div className="text-gray-400 text-sm mb-6">
                                {clearConfirm
                                    ? <p>You are about to permanently delete <span className="text-red-400 font-bold">{deleteTargetName}</span>. This cannot be undone.</p>
                                    : <p>Deleting <span className="text-purple-400 font-bold">{deleteTargetName}</span> requires admin access. Please enter password.</p>}
                            </div>

                            {!clearConfirm && (
                                <input
                                    type="password"
                                    value={clearPassword}
                                    onChange={(e) => setClearPassword(e.target.value)}
                                    placeholder="Admin Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-red-500 transition"
                                />
                            )}

                            {clearError && <p className="text-red-400 text-xs mb-4">{clearError}</p>}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsClearModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl font-bold hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearRegistrations}
                                    disabled={clearing}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition shadow-lg ${clearConfirm ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-white text-[#1a1c2e] hover:bg-gray-200'}`}
                                >
                                    {clearing ? "Processing..." : (clearConfirm ? "DELETE ALL" : "Verify")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* RESEND CONFIRMATION MODAL */}
                {isResendModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#1a1c2e] border border-amber-500/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_30px_rgba(245,158,11,0.15)] text-center"
                        >
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{resendConfirm ? "FINAL WARNING!" : "Administrative Action"}</h3>
                            <div className="text-gray-400 text-sm mb-6">
                                {resendConfirm
                                    ? <p>You are about to resend confirmation emails to <span className="text-amber-400 font-bold">ALL REGISTERED LEADERS</span>. This will take a few minutes.</p>
                                    : <p>Resending bulk emails requires admin verification. Please enter password.</p>}
                            </div>

                            {!resendConfirm && (
                                <input
                                    type="password"
                                    value={resendPassword}
                                    onChange={(e) => setResendPassword(e.target.value)}
                                    placeholder="Admin Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-amber-500 transition"
                                />
                            )}

                            {resendError && <p className="text-pink-400 text-xs mb-4">{resendError}</p>}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsResendModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 text-gray-300 rounded-xl font-bold hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={resendAllConfirmations}
                                    disabled={resending}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold transition shadow-lg ${resendConfirm ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white text-[#1a1c2e] hover:bg-gray-200'}`}
                                >
                                    {resending ? "Processing..." : (resendConfirm ? "RESEND ALL" : "Verify")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* --- CUSTOM NOTIFICATION SYSTEM (TOASTS) --- */}
                <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map(toast => (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl min-w-[300px] ${
                                    toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                    toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                                    "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                }`}
                            >
                                <div className="flex-1 text-sm font-bold">{toast.message}</div>
                                <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-current opacity-50 hover:opacity-100 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* --- CUSTOM ACTION CONFIRMATION MODAL --- */}
                <AnimatePresence>
                    {confirmModal.isOpen && (
                        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm bg-black/60">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="w-full max-w-sm bg-[#1a1c2e] border border-white/10 rounded-3xl p-6 shadow-2xl"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{confirmModal.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{confirmModal.message}</p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmModal.onConfirm}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AnimatePresence>
    );
}
