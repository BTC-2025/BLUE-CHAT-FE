import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";
import SearchBar from "./SearchBar.js";
import ChatList from "./ChatList.js";
import { useAuth } from "../context/AuthContext.js";
import { socket } from "../socket";
import GroupCreateModal from "./GroupCreateModal";
import ProfileModal from "./ProfileModal";
import logo from "../assets/Blue-Chat.jpeg";

export default function Sidebar({ onOpenChat, activeChatId, onViewStatus }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const load = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/chats`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  useEffect(() => {
    const fetchChatsOnce = async () => {
      if (!user?.token) return;
      try {
        const { data } = await axios.get(`${API_BASE}/chats`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // Merge: keep higher local unread count
        setChats((prev) => {
          const prevMap = new Map(prev.map(c => [c.id, c]));
          const merged = data.map(c => {
            const local = prevMap.get(c.id);
            return {
              ...c,
              unread: Math.max(c.unread || 0, local?.unread || 0)
            };
          });

          // ✅ AUTO-OPEN CHAT FROM URL
          if (window.__initialChatId) {
            const match = merged.find(c => String(c.id) === String(window.__initialChatId));
            if (match) {
              onOpenChat(match);
              window.__initialChatId = null; // Clear it so it doesn't re-open on every mount
            }
          }

          return merged;
        });
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChatsOnce();
  }, [user, onOpenChat]);

  // ✅ AUTO-REFRESH REMOVED for performance. Sockets handle updates.

  // ✅ Listen for new messages to update sidebar in real-time
  useEffect(() => {
    const onNewMessage = (msg) => {
      setChats((prev) => {
        const updated = prev.map((c) => {
          if (c.id === msg.chat) {
            return {
              ...c,
              lastMessage: msg.body || (msg.attachments?.length ? "[attachment]" : ""),
              lastAt: msg.createdAt,
              lastEncryptedBody: msg.encryptedBody || null, // ✅ Real-time update
              lastEncryptedKeys: msg.encryptedKeys || [],   // ✅ Real-time update
              unread: (String(msg.sender) !== String(user?.id) && String(msg.sender?._id) !== String(user?.id))
                ? (c.unread || 0) + 1
                : c.unread
            };
          }
          return c;
        });
        return sortChats(updated, user?.id);
      });
    };

    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [user?.id]);

  // ✅ Unread badge reset
  useEffect(() => {
    const onUnreadReset = ({ chatId, unreadResetFor }) => {
      if (!user) return;
      if (unreadResetFor !== user.id) return;

      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, unread: 0 } : c))
      );
    };

    socket.on("chats:update", onUnreadReset);
    return () => socket.off("chats:update", onUnreadReset);
  }, [user]);

  // ✅ Listen for pin/unpin events
  useEffect(() => {
    const onChatPinned = ({ chatId }) => {
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === chatId ? { ...c, isPinned: true } : c
        );
        return sortChats(updated, user?.id);
      });
    };

    const onChatUnpinned = ({ chatId }) => {
      setChats((prev) => {
        const updated = prev.map((c) =>
          c.id === chatId ? { ...c, isPinned: false } : c
        );
        return sortChats(updated, user?.id);
      });
    };

    socket.on("chat:pinned", onChatPinned);
    socket.on("chat:unpinned", onChatUnpinned);
    return () => {
      socket.off("chat:pinned", onChatPinned);
      socket.off("chat:unpinned", onChatUnpinned);
    };
  }, [user?.id]);

  // ✅ Sort function: pinned first, then by lastAt
  const sortChats = (chatList, userId) => {
    return [...chatList].sort((a, b) => {
      const aIsPinned = a.isPinned || a.pinnedBy?.includes(userId);
      const bIsPinned = b.isPinned || b.pinnedBy?.includes(userId);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return new Date(b.lastAt) - new Date(a.lastAt);
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#040712] text-white animate-premium-in">

      {/* ✅ Brand Header - Ultra Premium Glassmorphism */}
      <div className="px-5 py-5 glass-panel sticky top-0 z-30 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          {/* Profile Button with Glow */}
          <button
            onClick={() => setOpenProfile(true)}
            className="relative group transition-transform active:scale-95"
          >
            <div className="w-12 h-12 rounded-2xl shadow-2xl ring-2 ring-white/10 overflow-hidden bg-white/5 group-hover:ring-white/30 transition-all duration-300">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src={logo} alt="BlueChat" className="w-full h-full object-cover" />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-accent rounded-full border-[3px] border-[#040712] shadow-sm" />
          </button>

          <div className="flex flex-col">
            <h1 className="font-black text-xl tracking-tight text-white/95">BlueChat</h1>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40">{user?.full_name || user?.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* New Premium Status Button */}
          <button
            onClick={onViewStatus}
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20 group"
            title="View Status"
          >
            <svg className="w-5 h-5 group-hover:rotate-[15deg] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* New Premium Group Button */}
          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all duration-300 border border-white/5 hover:border-white/20 group"
            title="New Group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />

      {/* ✅ Search Area - Modern & Integrated */}
      <div className="px-5 py-4 z-20">
        <SearchBar
          onOpen={async (chat) => {
            onOpenChat(chat);
            setChats((prev) =>
              prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
            );
            await load();
          }}
        />
      </div>

      {/* ✅ Chat List Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ChatList
          items={sortChats(chats, user?.id)}
          activeId={activeChatId}
          userId={user?.id}
          onOpen={(chat) => {
            onOpenChat(chat);
            setChats((prev) =>
              prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
            );
          }}
        />
      </div>

      {/* ✅ Group Create Modal */}
      <GroupCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={async () => {
          setOpenCreate(false);
          await load();
        }}
      />
    </div>
  );
}
