import { useAuth } from "./context/AuthContext.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Home from "./pages/Home.js";
import { useState } from "react";

export default function App() {
  const { user } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="w-full max-w-md bg-neutral-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex gap-4 mb-4">
            <button className={`px-3 py-1 rounded ${mode==='login'?'bg-teal-600':''}`} onClick={()=>setMode("login")}>Login</button>
            <button className={`px-3 py-1 rounded ${mode==='register'?'bg-teal-600':''}`} onClick={()=>setMode("register")}>Register</button>
          </div>
          {mode === "login" ? <Login /> : <Register />}
        </div>
      </div>
    );
  }

  return <Home />;
}
