import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';

export default function Chat() {
  const [rooms, setRooms] = useState(() => JSON.parse(localStorage.getItem('rooms') || '[]'));
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showUsername, setShowUsername] = useState(!localStorage.getItem('username'));

  useEffect(() => { localStorage.setItem('rooms', JSON.stringify(rooms)); }, [rooms]);

  const saveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('username', username);
      setShowUsername(false);
    }
  };

  const sendMessage = () => {
    if (selectedRoom && message.trim() && username) {
      const updatedRooms = rooms.map(room => {
        if (room.id === selectedRoom.id) {
          return { ...room, messages: [...room.messages, { text: message, sender: username, time: Date.now() }] };
        }
        return room;
      });
      setRooms(updatedRooms);
      setSelectedRoom(updatedRooms.find(r=>r.id===selectedRoom.id));
      setMessage('');
    }
  };

  if (showUsername) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyPress={e => e.key==='Enter' && saveUsername()}
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 mb-3"
          />
          <button onClick={saveUsername} className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl">Continue</button>
        </div>
      </div>
    );
  }

  if (!selectedRoom) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Chats</h1>
          <button onClick={() => setShowUsername(true)} className="text-sm text-blue-500 hover:underline">
            Change name ({username})
          </button>
        </div>

        <div className="space-y-3">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-left hover:shadow-md transition"
            >
              <div className="font-semibold">{room.name}</div>
              <div className="text-sm text-gray-500">
                {room.messages.length === 0 ? 'No messages yet' : `${room.messages.length} messages`}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold">{selectedRoom.name}</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedRoom.messages.map((msg,i)=> <MessageBubble key={i} msg={msg} username={username} />)}
        </div>
        <div className="p-3 border-t dark:border-gray-700 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={e=>setMessage(e.target.value)}
            onKeyPress={e=>e.key==='Enter' && sendMessage()}
            className="flex-1 px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">Send</button>
        </div>
      </div>
    </div>
  );
}