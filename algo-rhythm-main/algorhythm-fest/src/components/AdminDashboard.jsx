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
    const [eventStatuses, setEventStatuses] = useState([]);
    const [deleteTargetId, setDeleteTargetId] = useState(null); // null for 'all', or specific id
    const [deleteTargetName, setDeleteTargetName] = useState("");
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [clearPassword, setClearPassword] = useState("");
    const [clearConfirm, setClearConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [clearError, setClearError] = useState("");

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
        setEmailStatus("");
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/send-report`, {
                method: 'POST',
                headers: { 'x-admin-password': password }
            });
            const data = await res.json();
            if (data.success) {
                setEmailStatus("Report Emailed Successfully!");
                setTimeout(() => setEmailStatus(""), 5000);
            } else {
                setEmailStatus(data.message || "Email Failed");
            }
        } catch (err) {
            setEmailStatus("Server Error - check credentials");
        } finally {
            setEmailing(false);
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
                : `${import.meta.env.VITE_API_URL}/api/admin/registrations/clear`;

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'x-admin-password': clearPassword }
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message);
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

    // Reset password on close
    useEffect(() => {
        if (!isOpen) {
            setIsAuthenticated(false);
            setPassword("");
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
                const rowValue = {
                    id: reg.id,
                    timestamp: new Date(reg.timestamp).toLocaleString(),
                    fullName: reg.fullName,
                    email: reg.email,
                    phone: reg.phone,
                    college: reg.college,
                    transactionId: reg.transactionId,
                    teamMembers: reg.teamMembers?.map(m => `${m.fullName} (${m.email}, ${m.phone})`).join(" | ") || "N/A",
                    screenshot: reg.screenshotPath ? `${import.meta.env.VITE_API_URL}/uploads/${reg.screenshotPath}` : "N/A"
                };
                const row = worksheet.addRow(rowValue);

                // Style link cell
                if (reg.screenshotPath) {
                    const linkCell = row.getCell('screenshot');
                    linkCell.value = {
                        text: 'Link to Screenshot',
                        hyperlink: `${import.meta.env.VITE_API_URL}/uploads/${reg.screenshotPath}`
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
                        className="relative w-full h-full max-w-[100vw] max-h-screen bg-[#0f111a] p-6 sm:p-12 overflow-hidden flex flex-col"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Console</h2>
                                <p className="text-gray-400 text-sm">Live Registeration Details</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button onClick={() => { fetchRegistrations(); setCountdown(30); }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition flex items-center gap-2">
                                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                    Refresh ({countdown}s)
                                </button>
                                <button onClick={downloadExcel} className="px-4 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm hover:bg-emerald-600/30 transition flex items-center gap-2 font-semibold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    Export Excel
                                </button>
                                <button
                                    onClick={sendToAdminEmail}
                                    disabled={emailing}
                                    className={`px-4 py-2 border rounded-xl text-sm transition flex items-center gap-2 font-semibold ${emailing ? 'bg-gray-600/20 border-gray-500/30 text-gray-500' : 'bg-pink-600/20 border-pink-500/30 text-pink-400 hover:bg-pink-600/30'
                                        }`}
                                >
                                    <svg className={`w-4 h-4 ${emailing ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    {emailing ? 'Sending...' : 'GMAIL'}
                                </button>
                                <button onClick={onClose} className="p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex border-b border-white/10 mb-6 gap-6">
                            <button
                                onClick={() => setActiveTab("registrations")}
                                className={`text-sm font-bold pb-3 px-2 transition-colors ${activeTab === "registrations" ? "text-purple-400 border-b-2 border-purple-500" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                Registrations Data
                            </button>
                            <button
                                onClick={() => setActiveTab("controls")}
                                className={`text-sm font-bold pb-3 px-2 transition-colors ${activeTab === "controls" ? "text-purple-400 border-b-2 border-purple-500" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                Event Settings (Open/Close)
                            </button>
                            <button
                                onClick={() => setActiveTab("manage")}
                                className={`text-sm font-bold pb-3 px-2 transition-colors ${activeTab === "manage" ? "text-purple-400 border-b-2 border-purple-500" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                Handle Registrations
                            </button>
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
                                    {emailStatus && (
                                        <span className={`text-sm font-bold ${emailStatus.includes("Success") ? 'text-emerald-400' : 'text-pink-400'}`}>
                                            {emailStatus}
                                        </span>
                                    )}
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
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Payment / UTR</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/10">Proof</th>
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
                                                            <div className="text-xs text-gray-500 mt-1">{new Date(reg.timestamp).toLocaleString()}</div>
                                                            {reg.teamMembers?.length > 0 && (
                                                                <div className="mt-2 flex flex-wrap gap-1">
                                                                    {reg.teamMembers.map((m, idx) => (
                                                                        <span key={idx} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-400 border border-white/10">{m.fullName.split(' ')[0]}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-5 font-mono text-sm text-amber-400">
                                                            {reg.transactionId}
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            {reg.screenshotPath ? (
                                                                <a
                                                                    href={`${import.meta.env.VITE_API_URL}/uploads/${reg.screenshotPath}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group"
                                                                >
                                                                    VIEW SCREENSHOT
                                                                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                                                </a>
                                                            ) : <span className="text-gray-600 text-xs italic">No Screenshot</span>}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">No registrations found for this selection.</td>
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
                        ) : (
                            <div className="flex-1 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Handle Registrations</h3>
                                        <p className="text-gray-400 text-sm">Manage individual records or clear the entire database.</p>
                                    </div>
                                    <button 
                                        onClick={() => { setIsClearModalOpen(true); setClearError(""); setClearPassword(""); setClearConfirm(false); }}
                                        className="px-8 py-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                    >
                                        CLEAR ALL REGISTRATIONS
                                    </button>
                                </div>
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
                            <p className="text-gray-400 text-sm mb-6">
                                {clearConfirm 
                                    ? "This is your last chance. Are you absolutely sure you want to delete EVERY registration record?" 
                                    : "To clear all registrations, please enter the admin password to verify your identity."}
                            </p>

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
            </div>
        </AnimatePresence>
    );
}
