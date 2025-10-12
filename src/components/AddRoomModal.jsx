import { X } from 'lucide-react';
import { useState } from 'react';
import api from '../api';

export default function AddRoomModal({ onClose }) {
  const [roomName, setRoomName] = useState('');

  const handleAdd = async () => {
    if (!roomName.trim()) return;
    try {
      await api.addTransaction({ description: `Room: ${roomName}` }); // replace with your actual API
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-lg">Add Room</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <input
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            placeholder="Room Name"
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <button onClick={handleAdd} className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
}