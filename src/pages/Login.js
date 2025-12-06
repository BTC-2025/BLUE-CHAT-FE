import { useState } from "react";
import { useAuth } from "../context/AuthContext.js";

export default function Login() {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-3">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Welcome back</h2>
      <input
        className="w-full bg-slate-700 rounded-lg px-3 py-2.5 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder="Phone"
        onChange={e => setPhone(e.target.value)}
      />
      <input
        className="w-full bg-slate-700 rounded-lg px-3 py-2.5 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button
        onClick={() => login(phone, password)}
        className="w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-2.5 font-medium text-sm sm:text-base transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
