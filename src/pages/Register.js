import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.js";
import axios from "axios";
import { API_BASE } from "../api";

export default function Register() {
  const { register, sendOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const [full_name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleAvatarSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAvatar(response.data.url);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOtp(email);
      setOtpSent(true);
      setSuccess("Verification code sent to your email!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!phone || !full_name || !password || !email || !otp) {
      setError("Please fill in all fields including the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(phone, full_name, password, email, otp, avatar);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Verification code might be incorrect or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-semibold text-primary">Create account</h2>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm animate-fade-in">
          {success}
        </div>
      )}

      {!otpSent ? (
        <>
          {/* Avatar Picker */}
          <div className="flex justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading || loading}
              className="relative group"
            >
              <div className={`w-20 h-20 rounded-full border-2 border-dashed border-secondary/50 flex items-center justify-center overflow-hidden bg-secondary/10 transition-all ${avatarUploading ? 'animate-pulse' : 'hover:border-secondary'}`}>
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : avatarUploading ? (
                  <svg className="w-6 h-6 text-secondary animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs shadow-md">
                +
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-center text-primary/50">Add profile picture (optional)</p>

          <input
            className="w-full bg-white border border-background-dark rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-primary placeholder:text-primary/40 shadow-sm"
            placeholder="Full name"
            value={full_name}
            onChange={e => setName(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full bg-white border border-background-dark rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-primary placeholder:text-primary/40 shadow-sm"
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full bg-white border border-background-dark rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-primary placeholder:text-primary/40 shadow-sm"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full bg-white border border-background-dark rounded-xl px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-primary placeholder:text-primary/40 shadow-sm"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || !email || !full_name || !phone || !password}
            className="w-full bg-primary hover:bg-primary-light text-white rounded-xl py-3 font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Send Verification Code"}
          </button>
        </>
      ) : (
        <div className="space-y-4 py-4 animate-premium-in">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-primary">A verification code was sent to</p>
            <p className="text-sm font-bold text-blue-600">{email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-primary/40 uppercase tracking-widest px-1">Verification Code</label>
            <input
              className="w-full bg-white border border-background-dark rounded-xl px-4 py-4 text-center text-2xl font-black tracking-[0.5em] outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-primary placeholder:text-primary/10 shadow-sm"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading || otp.length < 6}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 font-black text-sm sm:text-base transition-all shadow-xl hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Complete Registration"}
          </button>

          <button
            onClick={() => setOtpSent(false)}
            className="w-full text-xs font-bold text-primary/50 hover:text-primary transition-colors text-center"
          >
            Entered wrong email? Go back
          </button>
        </div>
      )}
    </div>
  );
}
