import { useState } from "react";
import { useAuth } from "../context/AuthContext.js";

export default function Register() {
  const { register } = useAuth();
  const [phone, setPhone] = useState("");
  const [full_name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Create account</h2>
      <input className="w-full bg-neutral-700 rounded px-3 py-2" placeholder="Phone" onChange={e=>setPhone(e.target.value)} />
      <input className="w-full bg-neutral-700 rounded px-3 py-2" placeholder="Full name" onChange={e=>setName(e.target.value)} />
      <input className="w-full bg-neutral-700 rounded px-3 py-2" type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={()=>register(phone, full_name, password)} className="w-full bg-teal-600 hover:bg-teal-500 rounded py-2">Register</button>
    </div>
  );
}
