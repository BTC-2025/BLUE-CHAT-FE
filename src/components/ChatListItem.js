import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function ChatListItem({ item, active, onClick }) {
  // Determine display name and avatar based on chat type
  const displayName = item.isGroup
    ? item.title
    : (item.other?.full_name || item.other?.phone);

  const avatarInitial = item.isGroup
    ? (item.title?.[0] || "G")
    : (item.other?.full_name?.[0] || item.other?.phone?.slice(-2));

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 hover:bg-neutral-800 ${active ? "bg-neutral-800" : ""
        }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full grid place-items-center uppercase text-sm font-semibold ${item.isGroup ? "bg-purple-700" : "bg-teal-700"
          }`}>
          {avatarInitial}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="font-medium truncate">
              {displayName}
            </div>

            {/* Time */}
            <div className="text-xs text-neutral-400">
              {item.lastAt ? dayjs(item.lastAt).fromNow() : ""}
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Last message preview */}
            <div className="text-sm text-neutral-400 truncate max-w-[80%]">
              {item.lastMessage || "No messages yet"}
            </div>

            {/* ✅ Unread badge */}
            {item.unread > 0 && (
              <span className="ml-2 text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full">
                {item.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
