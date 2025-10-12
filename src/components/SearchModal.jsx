import { X } from 'lucide-react';

export default function SearchModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="font-semibold text-lg">Search</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          {/* Future: Add results here */}
          <div className="mt-4 text-gray-500 text-center">No results yet</div>
        </div>
      </div>
    </div>
  );
}
