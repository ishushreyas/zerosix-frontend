export type PaymentType = 'cash' | 'card' | 'upi' | 'bank' | 'wallet'
export type Category =
  | 'food' | 'transport' | 'shopping' | 'entertainment' | 'education' | 'bills' | 'health' | 'other'

export interface Expense {
  id: string
  title: string
  amount: number
  date: string // ISO
  payer: string
  category: Category
  paymentType: PaymentType
  notes?: string
}

export interface Profile {
  id: string
  name: string
  email: string
  avatarUrl?: string
}
