import ChatListItem from "./ChatListItem.js";

export default function ChatList({ items, activeId, onOpen }) {
  return (
    <div className="overflow-y-auto divide-y divide-neutral-800">
      {items.map(item => (
        <ChatListItem
          key={item.id}
          item={item}
          active={activeId === item.id}
          onClick={() => onOpen(item)}
        />
      ))}
      {items.length === 0 && (
        <div className="p-6 text-neutral-500 text-sm">No recent chats. Search by phone to start one.</div>
      )}
    </div>
  );
}
