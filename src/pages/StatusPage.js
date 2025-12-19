import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function StatusPage({ onBack }) {
    const { user } = useAuth();
    const [statusGroups, setStatusGroups] = useState([]);
    const [selectedGroupIdx, setSelectedGroupIdx] = useState(0);
    const [currentStatusIdx, setCurrentStatusIdx] = useState(0);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const fetchStatuses = async () => {
        try {
            const { data } = await axios.get("https://btc-chat-be.onrender.com/api/status", {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setStatusGroups(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch statuses:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.token) fetchStatuses();
    }, [user?.token]);

    const currentGroup = statusGroups[selectedGroupIdx];
    const currentStatus = currentGroup?.statuses?.[currentStatusIdx];
    const isMine = currentGroup?.user?._id === user?.id;

    // Progress bar and auto-advance
    useEffect(() => {
        if (!currentStatus) return;

        setProgress(0);
        const duration = 5000;
        const interval = 50;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [selectedGroupIdx, currentStatusIdx, statusGroups]);

    const handleNext = () => {
        if (!currentGroup) return;
        if (currentStatusIdx < currentGroup.statuses.length - 1) {
            setCurrentStatusIdx(currentStatusIdx + 1);
        } else if (selectedGroupIdx < statusGroups.length - 1) {
            setSelectedGroupIdx(selectedGroupIdx + 1);
            setCurrentStatusIdx(0);
        } else {
            onBack();
        }
    };

    const handlePrev = () => {
        if (!currentGroup) return;
        if (currentStatusIdx > 0) {
            setCurrentStatusIdx(currentStatusIdx - 1);
        } else if (selectedGroupIdx > 0) {
            const prevGroupIdx = selectedGroupIdx - 1;
            setSelectedGroupIdx(prevGroupIdx);
            setCurrentStatusIdx(statusGroups[prevGroupIdx].statuses.length - 1);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await axios.post("https://btc-chat-be.onrender.com/api/upload", formData, {
                headers: { Authorization: `Bearer ${user?.token}`, "Content-Type": "multipart/form-data" }
            });
            await axios.post("https://btc-chat-be.onrender.com/api/status",
                { content: uploadRes.data.url, type: "image" },
                { headers: { Authorization: `Bearer ${user?.token}` } }
            );

            // Refresh and jump to my status
            const { data } = await axios.get("https://btc-chat-be.onrender.com/api/status", {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setStatusGroups(data);

            const myIdx = data.findIndex(g => g.user._id === user.id);
            if (myIdx !== -1) {
                setSelectedGroupIdx(myIdx);
                setCurrentStatusIdx(0);
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Failed to upload status.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteStatus = async () => {
        if (!window.confirm("Delete this status?")) return;
        try {
            await axios.delete(`https://btc-chat-be.onrender.com/api/status/${currentStatus._id}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            await fetchStatuses();
            if (currentGroup.statuses.length === 1) {
                if (selectedGroupIdx < statusGroups.length - 1) handleNext();
                else onBack();
            } else {
                handleNext();
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    if (loading) return (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white animate-spin rounded-full" />
        </div>
    );

    return (
        <div className="h-screen w-screen bg-black flex relative overflow-hidden select-none">
            {/* Background Layer (Blurred) */}
            {currentStatus && (
                <div
                    className="absolute inset-0 opacity-30 blur-3xl scale-110 pointer-events-none transition-all duration-700"
                    style={{ backgroundImage: `url(${currentStatus.content})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
            )}

            {/* LEFT SIDEBAR (Desktop/Tablet) */}
            <div className={`
                ${isSidebarOpen ? 'w-80' : 'w-0'} 
                hidden md:flex flex-col bg-black/40 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 z-50 overflow-hidden
            `}>
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-white font-bold text-xl tracking-tight">Status</h2>
                    <button onClick={onBack} title="Back to Chats" className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 scrollbar-hide">
                    {/* My Status Trigger */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-white/5 border border-transparent transition-all mb-4 bg-white/5"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full p-[2px] bg-secondary">
                                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-white/5">
                                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold">{user?.full_name?.[0]}</div>}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white border border-black text-[10px] font-bold">+</div>
                        </div>
                        <div>
                            <div className="text-white font-bold text-sm">My Status</div>
                            <div className="text-white/40 text-[10px]">Click to add update</div>
                        </div>
                    </div>

                    <div className="px-2 py-2 text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Recent Updates</div>

                    {statusGroups.map((g, idx) => (
                        <div
                            key={g.user._id}
                            onClick={() => { setSelectedGroupIdx(idx); setCurrentStatusIdx(0); }}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${idx === selectedGroupIdx ? 'bg-primary/20 border border-primary/20 shadow-lg' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className={`w-12 h-12 rounded-full p-[2px] ${idx === selectedGroupIdx ? 'bg-primary' : 'bg-gradient-to-tr from-primary/30 to-secondary/30 group-hover:from-primary'}`}>
                                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-white/5">
                                    {g.user.avatar ? <img src={g.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold">{g.user.full_name?.[0]}</div>}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="text-white font-bold text-sm truncate">{g.user.full_name}</div>
                                <div className="text-white/40 text-[10px] truncate">
                                    {g.statuses.length} updates • {new Date(g.statuses[0].createdAt).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN VIEWER AREA */}
            <div className="flex-1 flex flex-col relative">
                {/* TOP HEADER CONTROLS */}
                <div className="absolute top-0 inset-x-0 p-4 sm:p-6 z-[60] flex flex-col gap-4 bg-gradient-to-b from-black/80 to-transparent">
                    {/* Progress Bars */}
                    {currentGroup && (
                        <div className="flex gap-1.5 w-full max-w-[500px] mx-auto">
                            {currentGroup.statuses.map((_, idx) => (
                                <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white transition-all duration-75 linear"
                                        style={{ width: idx < currentStatusIdx ? "100%" : idx === currentStatusIdx ? `${progress}%` : "0%" }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Header Controls */}
                    <div className="flex items-center justify-between w-full max-w-[500px] mx-auto mt-2">
                        <div className="flex items-center gap-3">
                            <button onClick={onBack} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-white/10 shadow-lg">
                                    {currentGroup?.user?.avatar ? <img src={currentGroup.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold">{currentGroup?.user?.full_name?.[0]}</div>}
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-white font-bold text-sm leading-tight drop-shadow-md">{currentGroup?.user?.full_name || 'No Activity'}</div>
                                    <div className="text-white/70 text-[11px] font-medium drop-shadow-sm">{currentStatus ? new Date(currentStatus.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Join the conversation'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {isMine && (
                                <button onClick={handleDeleteStatus} title="Delete status" className="text-white/60 hover:text-red-400 p-2 transition-colors rounded-full hover:bg-white/10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                            <button onClick={() => fileInputRef.current?.click()} className="text-white/60 hover:text-white p-2 transition-colors rounded-full hover:bg-white/10" title="Add status">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                            <button onClick={onBack} title="Close" className="hidden md:flex text-white/60 hover:text-white p-2 transition-colors rounded-full hover:bg-white/10">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* CONTENT VIEWER */}
                <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-black/20 to-black/40" onClick={(e) => {
                    const x = e.clientX;
                    const width = window.innerWidth;
                    if (x < width / 3) handlePrev();
                    else handleNext();
                }}>
                    {currentStatus ? (
                        <div className="w-full h-full flex items-center justify-center p-0 sm:p-8 animate-in fade-in zoom-in duration-500">
                            <img
                                src={currentStatus.content}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm sm:rounded-xl ring-1 ring-white/10"
                                alt="Status Content"
                                onLoad={() => setProgress(0)}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6 space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                                <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white text-2xl font-bold tracking-tight">No statuses available</h3>
                                <p className="text-white/40 text-sm max-w-[200px] mx-auto">Share your moment or wait for contact updates.</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Share Update
                            </button>
                        </div>
                    )}

                    {/* DESKTOP NAVIGATION ARROWS */}
                    <div className="hidden md:flex absolute inset-y-0 left-0 right-0 justify-between items-center px-10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none group">
                        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-4 rounded-full bg-black/40 text-white pointer-events-auto hover:bg-black/60 border border-white/10 backdrop-blur-xl transition-all hover:scale-110 active:scale-90">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-4 rounded-full bg-black/40 text-white pointer-events-auto hover:bg-black/60 border border-white/10 backdrop-blur-xl transition-all hover:scale-110 active:scale-90">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                {/* BOTTOM TAB PREVIEW (Mobile Only Overlay) */}
                <div className="md:hidden absolute bottom-6 inset-x-0 flex justify-center z-50 overflow-hidden pointer-events-none px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 pointer-events-auto no-scrollbar max-w-full">
                        {statusGroups.map((g, idx) => (
                            <div
                                key={g.user._id}
                                onClick={(e) => { e.stopPropagation(); setSelectedGroupIdx(idx); setCurrentStatusIdx(0); }}
                                className={`w-12 h-12 flex-shrink-0 rounded-full border-2 transition-all p-0.5 ${idx === selectedGroupIdx ? 'border-primary scale-110' : 'border-white/20 opacity-50'}`}
                            >
                                <div className="w-full h-full rounded-full overflow-hidden bg-black ring-1 ring-black">
                                    {g.user.avatar ? <img src={g.user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-[10px]">{g.user.full_name?.[0]}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <input type="file" hidden ref={fileInputRef} onChange={handleUpload} accept="image/*" />

            {uploading && (
                <div className="absolute inset-0 bg-black/80 z-[200] flex flex-col items-center justify-center backdrop-blur-xl">
                    <div className="w-14 h-14 border-4 border-primary border-t-transparent animate-spin rounded-full mb-6" />
                    <span className="text-white font-bold tracking-[0.2em] text-xs uppercase animate-pulse">Processing Moment...</span>
                </div>
            )}
        </div>
    );
}
