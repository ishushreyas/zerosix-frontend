import { useEffect } from 'react'
import { useExpenses } from '@/store/useExpenses'
import { X } from 'lucide-react'

export default function ExpenseDetail() {
  const { selected, close } = useExpenses()

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [close])

  if (!selected) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex">
      <div className="m-auto w-full h-full md:h-[90vh] md:w-[800px] card p-6 overflow-auto relative">
        <button onClick={close} className="btn absolute right-4 top-4"> <X/> Close </button>
        <div className="space-y-3 mt-6">
          <h2 className="text-2xl font-semibold">{selected.title}</h2>
          <div className="text-3xl font-bold">₹ {selected.amount.toLocaleString()}</div>
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            <li><b>Date:</b> {new Date(selected.date).toLocaleString()}</li>
            <li><b>Payer:</b> {selected.payer}</li>
            <li><b>Category:</b> {selected.category}</li>
            <li><b>Payment Type:</b> {selected.paymentType}</li>
          </ul>
          {selected.notes && (
            <div className="mt-3">
              <div className="text-sm text-neutral-500">Notes</div>
              <div className="whitespace-pre-wrap">{selected.notes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
