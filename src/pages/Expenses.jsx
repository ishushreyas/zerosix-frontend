import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import ExpenseCard from '../components/ExpenseCard';

export default function Expenses() {
  const [rooms, setRooms] = useState(() => JSON.parse(localStorage.getItem('rooms') || '[]'));
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: '' });

  useEffect(() => { localStorage.setItem('rooms', JSON.stringify(rooms)); }, [rooms]);

  const addExpense = () => {
    if (selectedRoom && newExpense.description && newExpense.amount && newExpense.paidBy) {
      const updatedRooms = rooms.map(room => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            expenses: [...room.expenses, { ...newExpense, amount: parseFloat(newExpense.amount), date: Date.now() }]
          };
        }
        return room;
      });
      setRooms(updatedRooms);
      setSelectedRoom(updatedRooms.find(r => r.id === selectedRoom.id));
      setNewExpense({ description: '', amount: '', paidBy: '' });
      setShowAdd(false);
    }
  };

  const allExpenses = rooms.flatMap(r => r.expenses.map(e => ({ ...e, roomName: r.name, roomId: r.id }))).sort((a,b) => b.date - a.date);
  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (!selectedRoom) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">All Expenses</h1>

        <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg mb-6 text-white">
          <div className="text-sm opacity-90 mb-1">Total Expenses</div>
          <div className="text-4xl font-bold">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-2">{allExpenses.length} transactions</div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3">Select Room to Add Expense</h2>
          <div className="grid gap-2">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow text-left hover:shadow-md transition"
              >
                <div className="font-semibold">{room.name}</div>
                <div className="text-sm text-gray-500">
                  ${room.expenses.reduce((sum,e)=>sum+e.amount,0).toFixed(2)} • {room.expenses.length} expenses
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">All Transactions</h2>
          {allExpenses.map((exp,i) => <ExpenseCard key={i} exp={exp} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setSelectedRoom(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold">{selectedRoom.name}</h1>
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
      >
        <Plus className="h-5 w-5" /> Add Expense
      </button>

      {showAdd && (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow space-y-3">
          <input
            placeholder="Description"
            value={newExpense.description}
            onChange={e => setNewExpense({...newExpense, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            placeholder="Paid by"
            value={newExpense.paidBy}
            onChange={e => setNewExpense({...newExpense, paidBy: e.target.value})}
            className="w-full px-3 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <div className="flex gap-2">
            <button onClick={addExpense} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl">Add</button>
            <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {selectedRoom.expenses.sort((a,b)=>b.date-a.date).map((exp,i)=><ExpenseCard key={i} exp={exp} />)}
      </div>
    </div>
  );
}