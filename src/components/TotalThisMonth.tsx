import { useMemo } from 'react'
import { useExpenses } from '@/store/useExpenses'

export default function TotalThisMonth() {
  const { expenses } = useExpenses()
  const total = useMemo(() => expenses.reduce((s,e)=> s + e.amount, 0), [expenses])
  return (
    <div className="card p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-neutral-500">Total this month</div>
        <div className="text-3xl font-semibold mt-1">₹ {total.toLocaleString()}</div>
      </div>
      <div className="text-sm text-neutral-500">{expenses.length} transactions</div>
    </div>
  )
}
