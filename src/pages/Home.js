import Sidebar from "../components/Sidebar.js";
import ChatWindow from "../components/ChatWindow.js";
import { useState,useEffect } from "react";

export default function Home() {
  const [activeChat, setActiveChat] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
  const force = () => setReloadKey(k => k + 1);
  window.addEventListener("chat:reload", force);
  return () => window.removeEventListener("chat:reload", force);
}, []);


  return (
    <div className="h-screen w-screen overflow-hidden bg-neutral-900">
      <div className="h-full w-full grid grid-cols-12 overflow-hidden">

        {/* ✅ FIXED SIDEBAR */}
        <div className="col-span-4 h-full overflow-hidden border-r border-neutral-700">
          <Sidebar
            onOpenChat={setActiveChat}
            activeChatId={activeChat?.id}
          />
        </div>

        {/* ✅ ONLY CHATWINDOW CAN SCROLL */}
        <div className="col-span-8 h-full overflow-hidden">
          {activeChat ? (
            <ChatWindow key={activeChat?.id + reloadKey} chat={activeChat} />
          ) : (
            <div className="h-full grid place-items-center text-neutral-400">
              Select a chat or search by phone to start messaging.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
