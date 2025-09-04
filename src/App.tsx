import { NavLink, Route, Routes } from 'react-router-dom'
import ExpensesPage from '@/pages/ExpensesPage'
import ProfilePage from '@/pages/ProfilePage'

export default function App() {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="container flex items-center justify-between py-4">
          <div className="text-xl font-bold">💸 Zerosix Expenses</div>
          <nav className="flex items-center gap-3">
            <NavLink className={({isActive})=>`btn ${isActive?'bg-neutral-900 text-white':'bg-white'}`} to="/">Expenses</NavLink>
            <NavLink className={({isActive})=>`btn ${isActive?'bg-neutral-900 text-white':'bg-white'}`} to="/profile">Profile</NavLink>
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<ExpensesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <footer className="container py-10 text-center text-sm text-neutral-500">
        Built with React + Vite + Tailwind + Zustand
      </footer>
    </div>
  )
}
