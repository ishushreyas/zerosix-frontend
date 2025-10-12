import { Users, X } from 'lucide-react';

export default function RoomCard({ room, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(room)}
      className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex items-center justify-between cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-blue-500" />
        <div>
          <div className="font-semibold">{room.name}</div>
          <div className="text-sm text-gray-500">{room.expenses.length} expenses</div>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(room.id); }}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      >
        <X className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}