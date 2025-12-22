import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DisabledAccount() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-card bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-2xl animate-premium-in">
                {/* Warning Icon */}
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-red-500/10">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Account Disabled</h1>

                <p className="text-white/60 text-lg mb-8 leading-relaxed">
                    Your account has been temporarily disabled due to community reports. We prioritize the safety and well-being of all our users.
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                        <p className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Next Steps</p>
                        <p className="text-white/80">Please contact the administrator to review your case and request account reactivation.</p>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold transition-all duration-300 border border-white/10 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Logout
                    </button>
                </div>

                <p className="mt-8 text-white/30 text-sm">
                    &copy; 2025 BlueChat Safety Team
                </p>
            </div>
        </div>
    );
}
