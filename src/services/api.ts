import axios from 'axios'
import type { Expense, Profile, Category, PaymentType } from '@/types'
import dayjs from 'dayjs'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 8000,
})

export interface ExpenseQuery {
  month?: string // 'YYYY-MM'
  payer?: string
  category?: Category | ''
  paymentType?: PaymentType | ''
  search?: string
}

export async function fetchExpenses(q: ExpenseQuery): Promise<Expense[]> {
  try {
    const params: Record<string, string> = {}
    if (q.month) {
      const start = dayjs(q.month + '-01').startOf('month').toISOString()
      const end = dayjs(q.month + '-01').endOf('month').toISOString()
      params.start = start
      params.end = end
    }
    if (q.payer) params.payer = q.payer
    if (q.category) params.category = q.category
    if (q.paymentType) params.paymentType = q.paymentType
    if (q.search) params.search = q.search

    const { data } = await api.get('/expenses', { params })
    return data
  } catch (err) {
    console.warn('API failed, falling back to mock data:', err)
    return mockExpenses(q)
  }
}

export async function fetchProfile(): Promise<Profile> {
  try {
    const { data } = await api.get('/profile')
    return data
  } catch {
    return mockProfile()
  }
}

function mockProfile(): Profile {
  return {
    id: 'u-1',
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4'
  }
}

const seed: Expense[] = Array.from({ length: 48 }).map((_, i) => {
  const categories: Expense['category'][] = ['food','transport','shopping','entertainment','education','bills','health','other']
  const pays: Expense['paymentType'][] = ['cash','card','upi','bank','wallet']
  const payers = ['Aarav', 'Isha', 'Rahul']
  const now = dayjs().subtract(Math.floor(Math.random()*75), 'day')
  return {
    id: 'e-' + i,
    title: ['Lunch','Uber','Books','Movie','Groceries','Medicine','Electricity','Course'][i%8] + ' #' + (i+1),
    amount: Math.round(200 + Math.random()*4900),
    date: now.toISOString(),
    payer: payers[i%payers.length],
    category: categories[i%categories.length],
    paymentType: pays[i%pays.length],
    notes: 'Sample note for item ' + (i+1)
  }
})

function mockExpenses(q: ExpenseQuery): Expense[] {
  let data = seed.slice()
  if (q.month) {
    const m = dayjs(q.month + '-01')
    data = data.filter(e => dayjs(e.date).isSame(m, 'month'))
  }
  if (q.payer) data = data.filter(e => e.payer === q.payer)
  if (q.category) data = data.filter(e => e.category === q.category)
  if (q.paymentType) data = data.filter(e => e.paymentType === q.paymentType)
  if (q.search) data = data.filter(e => e.title.toLowerCase().includes(q.search!.toLowerCase()))
  return data.sort((a,b)=> dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
}
