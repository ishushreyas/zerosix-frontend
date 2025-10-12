export default function MessageBubble({ msg, username }) {
  const isMe = msg.sender === username;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs px-4 py-2 rounded-2xl ${isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
        {!isMe && <div className="text-xs font-semibold mb-1">{msg.sender}</div>}
        <div>{msg.text}</div>
        <div className="text-xs opacity-70 mt-1">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
  );
}