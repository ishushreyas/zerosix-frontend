import { create } from 'zustand'
import { fetchExpenses, fetchProfile, type ExpenseQuery } from '@/services/api'
import type { Expense, Profile } from '@/types'

type State = {
  expenses: Expense[]
  isLoading: boolean
  error?: string
  query: ExpenseQuery
  selected?: Expense
  profile?: Profile
}

type Actions = {
  load: () => Promise<void>
  setQuery: (q: Partial<ExpenseQuery>) => void
  open: (e: Expense) => void
  close: () => void
  loadProfile: () => Promise<void>
}

const thisMonth = new Date()
const ym = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit' }).format(thisMonth).replace('/', '-')

export const useExpenses = create<State & Actions>((set, get) => ({
  expenses: [],
  isLoading: false,
  query: { month: ym },
  open: (e) => set({ selected: e }),
  close: () => set({ selected: undefined }),
  setQuery: (q) => set({ query: { ...get().query, ...q } }),
  load: async () => {
    set({ isLoading: true, error: undefined })
    try {
      const data = await fetchExpenses(get().query)
      set({ expenses: data })
    } catch (e:any) {
      set({ error: e?.message ?? 'Failed to load expenses' })
    } finally {
      set({ isLoading: false })
    }
  },
  loadProfile: async () => {
    const p = await fetchProfile()
    set({ profile: p })
  }
}))
