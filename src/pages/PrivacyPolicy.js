import React from "react";
import logo from "../assets/Blue-Chat.jpeg";

export default function PrivacyPolicy() {
    const handleBack = () => {
        window.history.pushState(null, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    return (
        <div className="min-h-screen bg-[#040712] text-white p-6 sm:p-12 font-sans selection:bg-blue-500/30">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center mb-12 animate-premium-in">
                    <img src={logo} alt="BlueChat" className="w-20 h-20 rounded-2xl mb-4 shadow-2xl ring-1 ring-white/10" />
                    <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Privacy Policy</h1>
                    <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">Last Updated: December 20, 2025</p>
                </div>

                {/* Content */}
                <div className="space-y-10 glass-panel p-8 sm:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl animate-premium-in" style={{ animationDelay: '100ms' }}>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">1</span>
                            Introduction
                        </h2>
                        <p className="text-white/70 leading-relaxed">
                            Welcome to <strong>BlueChat</strong>, operated by BURJ Tech consultancy (OPC) Pvt Ltd. We are committed to providing a secure communication platform that prioritizes user privacy above all else. Our architecture is designed so that we cannot read your messages or listen to your calls.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">2</span>
                            Our "Zero-Knowledge" Philosophy
                        </h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            Unlike traditional messaging apps, BlueChat employs a Zero-Knowledge architecture. This means:
                        </p>
                        <ul className="list-none space-y-4 ml-4">
                            <li className="flex gap-3">
                                <span className="text-blue-400 mt-1">✦</span>
                                <span className="text-white/70"><strong>No Decryption Keys:</strong> Encryption keys are stored only on your device. We do not have access to them.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-blue-400 mt-1">✦</span>
                                <span className="text-white/70"><strong>No Data Monetization:</strong> We do not sell, rent, or trade your personal data or metadata to third parties.</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">3</span>
                            Information We Collect
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-white/90 mb-2">A. Account Information</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-3">
                                    <strong>Verified Identity:</strong> To ensure a "One User, One Account" ecosystem, we utilize Identity Verification. We store only a unique cryptographic hash of your identity to prevent duplicate accounts. We do NOT store your raw National ID numbers.
                                </p>
                                <p className="text-white/60 text-sm">
                                    <strong>Phone Number:</strong> Used as your primary identifier for account discovery.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-wider text-white/90 mb-2">B. Messages and Media</h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-3">
                                    <strong>End-to-End Encryption (E2EE):</strong> All messages, photos, videos, and files are encrypted before they leave your device. Only the intended recipient can decrypt them.
                                </p>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    <strong>Ephemeral Storage:</strong> Undelivered messages are stored in encrypted form on our servers for up to 30 days and are deleted immediately upon delivery.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">4</span>
                            Permissions We Request
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <li className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-white font-bold text-sm mb-1">Contacts</div>
                                <div className="text-white/50 text-[11px] leading-tight text-pretty">To discover which of your contacts are already on the App. We do not store your contact list on our servers.</div>
                            </li>
                            <li className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-white font-bold text-sm mb-1">Microphone/Camera</div>
                                <div className="text-white/50 text-[11px] leading-tight text-pretty">For encrypted voice and video calls.</div>
                            </li>
                            <li className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="text-white font-bold text-sm mb-1">Storage</div>
                                <div className="text-white/50 text-[11px] leading-tight text-pretty">To save encrypted media files you choose to download.</div>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">5</span>
                            Data Security & Storage
                        </h2>
                        <p className="text-white/70 leading-relaxed">
                            We employ a dedicated Cybersecurity team to manage hardware firewalls and intrusion detection systems. All data is processed on our proprietary high-security GPU clusters.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">6</span>
                            Compliance
                        </h2>
                        <p className="text-white/70 leading-relaxed">
                            <strong>Data Deletion:</strong> You may request account deletion at any time via App settings. Upon deletion, all associated metadata and undelivered messages are purged from our servers.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-white/5">
                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">Contact Us</h2>
                        <div className="bg-blue-600 p-6 rounded-3xl">
                            <div className="text-white/80 text-sm mb-4">For any privacy-related inquiries, please contact our Data Protection Officer:</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-white font-bold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    burjtechconsultancy@gmail.com
                                </div>
                                <div className="flex items-start gap-3 text-white/90 text-sm">
                                    <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    BURJ Tech Consultancy, Tiruvallur, India - 602025.
                                </div>
                            </div>
                        </div>
                    </section>

                    <button
                        onClick={handleBack}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all active:scale-[0.98]"
                    >
                        Back to Application
                    </button>

                </div>

                <div className="mt-12 text-center text-white/20 text-xs font-medium uppercase tracking-widest pb-12">
                    © 2025 BURJ Tech Consultancy (OPC) Pvt Ltd.
                </div>
            </div>
        </div>
    );
}
