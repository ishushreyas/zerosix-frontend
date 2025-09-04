import type { Expense } from '@/types'
import { useExpenses } from '@/store/useExpenses'
import { Banknote, Calendar, CircleUserRound, CreditCard } from 'lucide-react'

export default function ExpenseItem({ expense }: { expense: Expense }) {
  const { open } = useExpenses()
  return (
    <button onClick={()=>open(expense)} className="w-full text-left card p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="font-medium">{expense.title}</div>
        <div className="text-lg font-semibold">₹ {expense.amount.toLocaleString()}</div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
        <span className="badge"><Calendar size={14}/> {new Date(expense.date).toLocaleDateString()}</span>
        <span className="badge"><CircleUserRound size={14}/> {expense.payer}</span>
        <span className="badge">{expense.category}</span>
        <span className="badge"><CreditCard size={14}/> {expense.paymentType}</span>
        {expense.notes ? <span className="badge"><Banknote size={14}/> {expense.notes}</span> : null}
      </div>
    </button>
  )
}
