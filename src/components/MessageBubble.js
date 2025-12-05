// import { useState } from "react";
// import dayjs from "dayjs";
// import { socket } from "../socket";

// export default function MessageBubble({ mine, text, time, status, messageId, chatId }) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const renderTicks = () => {
//     if (!mine) return null;

//     if (status === "seen") return <span className="text-blue-400">✔✔</span>;
//     if (status === "delivered") return <span className="text-gray-300">✔✔</span>;
//     return <span className="text-gray-300">✔</span>;
//   };

//   const deleteForMe = () => {
//     socket.emit("message:delete", { messageId, forEveryone: false });
//     setMenuOpen(false);
//   };

//   const deleteForEveryone = () => {
//     if (!mine) return; // Only sender can delete for everyone
//     socket.emit("message:delete", { messageId, forEveryone: true });
//     setMenuOpen(false);
//   };

//   return (
//     <div className={`relative max-w-[75%] ${mine ? "ml-auto" : ""}`}>
//       {/* 3-dot menu button */}
//       <div className="absolute -top-2 -right-2">
//         <button
//           className="text-neutral-400 text-sm hover:text-neutral-200"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ⋮
//         </button>

//         {/* Dropdown menu */}
//         {menuOpen && (
//           <div className="absolute right-0 mt-1 bg-neutral-800 rounded-lg shadow-lg p-2 text-xs min-w-[120px] border border-neutral-700 z-20">
//             <button
//               className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
//               onClick={deleteForMe}
//             >
//               Delete for me
//             </button>

//             {mine && (
//               <button
//                 className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded text-red-400"
//                 onClick={deleteForEveryone}
//               >
//                 Delete for everyone
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Bubble */}
//       <div
//         className={`rounded-2xl px-4 py-2 ${
//           mine ? "bg-teal-700" : "bg-neutral-800"
//         }`}
//       >
//         <div className="whitespace-pre-wrap">{text}</div>

//         {/* Time + ticks */}
//         <div className="text-[10px] text-neutral-300 text-right mt-1 flex gap-1 justify-end items-center">
//           <span>{dayjs(time).format("HH:mm")}</span>
//           {renderTicks()}
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import dayjs from "dayjs";
// import { socket } from "../socket";

// export default function MessageBubble({ message, mine }) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const isDeletedForAll = message.deletedForEveryone;
//   const isDeletedForMe = message.deletedFor?.includes?.(message.currentUserId);

//   const isDeleted = isDeletedForAll || isDeletedForMe;

//   const renderTicks = () => {
//     if (isDeleted) return null;
//     if (!mine) return null;

//     if (message.status === "seen") return <span className="text-blue-400">✔✔</span>;
//     if (message.status === "delivered") return <span className="text-gray-300">✔✔</span>;
//     return <span className="text-gray-300">✔</span>;
//   };

//   const deleteForMe = () => {
//     socket.emit("message:delete", {
//       messageId: message._id,
//       forEveryone: false
//     });
//     setMenuOpen(false);
//   };

//   const deleteForEveryone = () => {
//     if (!mine) return;
//     socket.emit("message:delete", {
//       messageId: message._id,
//       forEveryone: true
//     });
//     setMenuOpen(false);
//   };

//   // ✅ Deleted UI (WhatsApp style)
//   if (isDeleted) {
//     return (
//       <div className={`max-w-[75%] ${mine ? "ml-auto" : ""}`}>
//         <div className="bg-neutral-800 text-neutral-400 italic px-3 py-2 rounded-xl text-sm">
//           This message was deleted
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`relative max-w-[75%] ${mine ? "ml-auto" : ""}`}>

//       {/* Menu button */}
//       <div className="absolute -top-2 -right-2 z-20">
//         <button
//           className="text-neutral-400 text-sm hover:text-neutral-200"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ⋮
//         </button>

//         {menuOpen && (
//           <div className="absolute right-0 mt-1 bg-neutral-800 rounded-lg 
//                           shadow-lg p-2 text-xs min-w-[140px] 
//                           border border-neutral-700 z-30">

//             {/* DELETE FOR ME */}
//             <button
//               className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
//               onClick={deleteForMe}
//             >
//               Delete for me
//             </button>

//             {/* DELETE FOR EVERYONE — only sender */}
//             {mine && (
//               <button
//                 className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded text-red-400"
//                 onClick={deleteForEveryone}
//               >
//                 Delete for everyone
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Bubble */}
//       <div
//         className={`rounded-2xl px-4 py-2 ${
//           mine ? "bg-teal-700" : "bg-neutral-800"
//         }`}
//       >
//         {/* Message text */}
//         <div className="whitespace-pre-wrap">{message.body}</div>

//         {/* Time + ticks */}
//         <div className="text-[10px] text-neutral-300 text-right mt-1 flex gap-1 items-center">
//           <span>{dayjs(message.createdAt).format("HH:mm")}</span>
//           {renderTicks()}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from "react";
import dayjs from "dayjs";
import { socket } from "../socket";

export default function MessageBubble({ message, mine, isGroup }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Determine if deleted
  const isDeletedForAll = message.deletedForEveryone;
  const isDeletedForMe =
    Array.isArray(message.deletedFor) &&
    message.deletedFor.includes(message.currentUserId);

  const isDeleted = isDeletedForAll || isDeletedForMe;

  // ✅ Get sender name for group chats
  const senderName = message.sender?.full_name || message.sender?.phone || "Unknown";

  const renderTicks = () => {
    if (isDeleted) return null;
    if (!mine) return null;

    if (message.status === "seen") return <span className="text-blue-400">✔✔</span>;
    if (message.status === "delivered") return <span className="text-gray-300">✔✔</span>;
    return <span className="text-gray-300">✔</span>;
  };

  const deleteForMe = () => {
    socket.emit("message:delete", {
      messageId: message._id,
      forEveryone: false
    });
    setMenuOpen(false);
  };

  const deleteForEveryone = () => {
    if (!mine) return;
    socket.emit("message:delete", {
      messageId: message._id,
      forEveryone: true
    });
    setMenuOpen(false);
  };

  // ✅ Show Deleted Bubble Only
  if (isDeleted) {
    return (
      <div className={`max-w-[75%] ${mine ? "ml-auto" : ""}`}>
        <div className="bg-neutral-800 text-neutral-400 italic px-3 py-2 rounded-xl text-sm">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`relative max-w-[75%] ${mine ? "ml-auto" : ""}`}>

      {/* ⋮ Menu */}
      <div className="absolute -top-2 -right-2 z-20">
        <button
          className="text-neutral-400 text-sm hover:text-neutral-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 bg-neutral-800 rounded-lg shadow-lg 
                          p-2 text-xs min-w-[140px] border border-neutral-700 z-30">

            <button
              className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
              onClick={deleteForMe}
            >
              Delete for me
            </button>

            {mine && (
              <button
                className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded text-red-400"
                onClick={deleteForEveryone}
              >
                Delete for everyone
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ Chat Bubble */}
      <div
        className={`rounded-2xl px-4 py-2 ${mine ? "bg-teal-700" : "bg-neutral-800"
          }`}
      >
        {/* ✅ Show sender name for group chats (only for other users' messages) */}
        {isGroup && !mine && (
          <div className="text-xs text-purple-400 font-semibold mb-1">
            {senderName}
          </div>
        )}

        <div className="whitespace-pre-wrap">{message.body}</div>

        {/* ✅ Ticks + Time */}
        <div className="text-[10px] text-neutral-300 text-right mt-1 flex gap-1 items-center">
          <span>{dayjs(message.createdAt).format("HH:mm")}</span>
          {renderTicks()}
        </div>
      </div>
    </div>
  );
}
