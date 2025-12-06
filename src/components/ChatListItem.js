import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function ChatListItem({ item, active, onClick }) {
  const displayName = item.isGroup
    ? item.title
    : (item.other?.full_name || item.other?.phone);

  const avatarInitial = item.isGroup
    ? (item.title?.[0] || "G")
    : (item.other?.full_name?.[0] || item.other?.phone?.slice(-2));

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 sm:px-4 py-3 transition-colors ${active
          ? "bg-blue-900/50 border-l-4 border-blue-500"
          : "hover:bg-slate-800 border-l-4 border-transparent"
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full grid place-items-center uppercase text-xs sm:text-sm font-semibold flex-shrink-0 ${item.isGroup ? "bg-indigo-600" : "bg-blue-600"
          }`}>
          {avatarInitial}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium truncate text-sm sm:text-base">
              {displayName}
            </div>

            {/* Time */}
            <div className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">
              {item.lastAt ? dayjs(item.lastAt).fromNow() : ""}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            {/* Last message preview */}
            <div className="text-xs sm:text-sm text-slate-400 truncate">
              {item.lastMessage || "No messages yet"}
            </div>

            {/* ✅ Unread badge */}
            {item.unread > 0 && (
              <span className="text-[10px] sm:text-xs bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                {item.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
