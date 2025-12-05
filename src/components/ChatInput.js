import { useState, useRef } from "react";
import { socket } from "../socket";

export default function ChatInput({ onSend, chatId }) {
  const [val, setVal] = useState("");
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef(null);

  // store timeout across renders
  const typingTimeoutRef = useRef(null);

  const submit = () => {
    const text = val.trim();
    if (!text) return;
    onSend(text);
    setVal("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // stop typing when user sends message
    socket.emit("typing:stop", { chatId });
    setTyping(false);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setVal(v);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }

    // start typing
    if (!typing) {
      setTyping(true);
      socket.emit("typing:start", { chatId });
    }

    // reset previous timeout
    clearTimeout(typingTimeoutRef.current);

    // stop typing after 800ms of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.emit("typing:stop", { chatId });
    }, 800);
  };

  const handleKeyDown = (e) => {
    // Enter sends message, Shift+Enter adds new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        className="flex-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none resize-none overflow-y-auto"
        placeholder="Type a message (Shift+Enter for new line)"
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{ maxHeight: "150px" }}
      />
      <button
        onClick={submit}
        className="px-4 py-3 bg-teal-600 rounded-xl hover:bg-teal-500 h-fit"
      >
        Send
      </button>
    </div>
  );
}
