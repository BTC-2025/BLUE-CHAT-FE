import { useState, useRef } from "react";
import { socket } from "../socket";

export default function ChatInput({ onSend, chatId }) {
  const [val, setVal] = useState("");
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const submit = () => {
    const text = val.trim();
    if (!text) return;
    onSend(text);
    setVal("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    socket.emit("typing:stop", { chatId });
    setTyping(false);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setVal(v);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing:start", { chatId });
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit("typing:stop", { chatId });
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        className="flex-1 bg-slate-800 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 outline-none resize-none overflow-y-auto text-sm sm:text-base focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder="Type a message..."
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{ maxHeight: "150px" }}
      />
      <button
        onClick={submit}
        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors font-medium text-sm sm:text-base"
      >
        <span className="hidden sm:inline">Send</span>
        <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}
