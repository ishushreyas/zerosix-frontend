import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import ExpenseCard from '../components/ExpenseCard';

export default function Feed() {
  const [rooms, setRooms] = useState(() => JSON.parse(localStorage.getItem('rooms') || '[]'));
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => { localStorage.setItem('rooms', JSON.stringify(rooms)); }, [rooms]);

  const addRoom = () => {
    if (newRoomName.trim()) {
      setRooms([...rooms, { id: Date.now(), name: newRoomName, expenses: [], messages: [] }]);
      setNewRoomName('');
      setShowNewRoom(false);
    }
  };
  const deleteRoom = (id) => setRooms(rooms.filter(r => r.id !== id));

  const allExpenses = rooms.flatMap(r => r.expenses.map(e => ({ ...e, roomName: r.name }))).sort((a, b) => b.date - a.date);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button onClick={() => setShowNewRoom(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
          <Plus className="h-4 w-4" /> New Room
        </button>
      </div>

      {showNewRoom && (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow space-y-2">
          <input
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addRoom()}
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
            placeholder="Room name"
          />
          <div className="flex gap-2">
            <button onClick={addRoom} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl">Add</button>
            <button onClick={() => setShowNewRoom(false)} className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} onSelect={() => {}} onDelete={deleteRoom} />
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        {allExpenses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No expenses yet</div>
        ) : (
          allExpenses.slice(0, 10).map((exp, i) => <ExpenseCard key={i} exp={exp} />)
        )}
      </div>
    </div>
  );
}