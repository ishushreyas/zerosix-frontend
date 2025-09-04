import { useEffect } from 'react'
import FilterBar from '@/components/FilterBar'
import ExpenseItem from '@/components/ExpenseItem'
import ExpenseDetail from '@/components/ExpenseDetail'
import TotalThisMonth from '@/components/TotalThisMonth'
import { useExpenses } from '@/store/useExpenses'

export default function ExpensesPage() {
  const { expenses, isLoading, error, load } = useExpenses()

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-4">
      <FilterBar />
      <TotalThisMonth />
      {isLoading && <div className="card p-4">Loading...</div>}
      {error && <div className="card p-4 text-red-600">{error}</div>}
      <div className="grid gap-3">
        {expenses.map(e => <ExpenseItem key={e.id} expense={e} />)}
        {!isLoading && expenses.length === 0 && <div className="card p-6 text-center text-neutral-500">No expenses found for the selected filters.</div>}
      </div>
      <ExpenseDetail />
    </div>
  )
}
