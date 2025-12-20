import React from "react";

export default function ContactInfoModal({ contact, open, onClose }) {
    if (!open || !contact) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 grid place-items-center z-[100] p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white border border-background-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Banner Area */}
                <div className="relative h-32 bg-gradient-to-r from-primary to-primary-light">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-6 pb-8 -mt-16 relative">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-background overflow-hidden mx-auto mb-4 scale-in duration-500">
                        {contact.avatar ? (
                            <img src={contact.avatar} alt={contact.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary-dark grid place-items-center text-4xl font-bold text-white uppercase">
                                {(contact.full_name || contact.phone)?.[0]}
                            </div>
                        )}
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-1">
                            {contact.full_name || "Anonymous User"}
                        </h2>
                        <p className="text-primary/60 font-medium">
                            {contact.phone}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* About Section */}
                        <div className="bg-background rounded-xl p-4 border border-background-dark/50">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-secondary-dark mb-1 block">About</label>
                            <p className="text-primary/80 text-sm leading-relaxed italic">
                                "{contact.about || "No status available."}"
                            </p>
                        </div>

                        {/* Email Section */}
                        {contact.email && (
                            <div className="bg-background rounded-xl p-4 border border-background-dark/50">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-secondary-dark mb-1 block">Email</label>
                                <p className="text-primary/80 text-sm font-medium">
                                    {contact.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-background-dark/30 px-6 py-4 flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all shadow-md active:scale-95 text-sm"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
