export default function ExpenseCard({ exp, highlight }) {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow ${highlight ? 'border border-blue-500' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{exp.description}</div>
        <div className="text-lg font-bold text-green-500">${exp.amount}</div>
      </div>
      <div className="text-sm text-gray-500">
        {exp.roomName} • Paid by {exp.paidBy} • {new Date(exp.date).toLocaleDateString()}
      </div>
    </div>
  );
}