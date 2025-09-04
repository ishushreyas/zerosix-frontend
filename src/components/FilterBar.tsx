import { useEffect, useMemo } from 'react'
import { useExpenses } from '@/store/useExpenses'
import type { Category, PaymentType } from '@/types'

const categories: Category[] = ['food','transport','shopping','entertainment','education','bills','health','other']
const payments: PaymentType[] = ['cash','card','upi','bank','wallet']
const payers = ['Aarav', 'Isha', 'Rahul']

export default function FilterBar() {
  const { query, setQuery, load } = useExpenses()

  // Ensure we refresh when query changes
  useEffect(() => { load() }, [query.month, query.payer, query.category, query.paymentType, query.search])

  const months = useMemo(() => {
    const arr: string[] = []
    const now = new Date()
    for (let i=0;i<12;i++) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1)
      const ym = new Intl.DateTimeFormat('en-CA', { year:'numeric', month:'2-digit' }).format(d).replace('/', '-')
      arr.push(ym)
    }
    return arr
  }, [])

  return (
    <div className="card p-4 grid gap-3 md:grid-cols-5">
      <div className="md:col-span-1">
        <label className="text-sm text-neutral-600">Month</label>
        <select className="select mt-1" value={query.month || ''} onChange={(e)=> setQuery({ month: e.target.value })}>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-neutral-600">Payer</label>
        <select className="select mt-1" value={query.payer || ''} onChange={(e)=> setQuery({ payer: e.target.value || undefined })}>
          <option value="">All</option>
          {payers.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-neutral-600">Category</label>
        <select className="select mt-1" value={query.category || ''} onChange={(e)=> setQuery({ category: (e.target.value || undefined) as any })}>
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-neutral-600">Payment Type</label>
        <select className="select mt-1" value={query.paymentType || ''} onChange={(e)=> setQuery({ paymentType: (e.target.value || undefined) as any })}>
          <option value="">All</option>
          {payments.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm text-neutral-600">Search</label>
        <input className="input mt-1" placeholder="title, notes..." value={query.search || ''} onChange={(e)=> setQuery({ search: e.target.value })} />
      </div>
    </div>
  )
}
