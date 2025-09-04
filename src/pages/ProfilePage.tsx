import { useEffect } from 'react'
import { useExpenses } from '@/store/useExpenses'

export default function ProfilePage() {
  const { profile, loadProfile } = useExpenses()
  useEffect(() => { loadProfile() }, [])
  if (!profile) return <div className="card p-4">Loading profile...</div>

  return (
    <div className="max-w-2xl mx-auto card p-6">
      <div className="flex items-center gap-4">
        <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full border" />
        <div>
          <div className="text-xl font-semibold">{profile.name}</div>
          <div className="text-neutral-600">{profile.email}</div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Preferences</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-neutral-600">Default Month</span>
            <input className="input mt-1" defaultValue={new Date().toISOString().slice(0,7)} />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-600">Currency</span>
            <input className="input mt-1" defaultValue="INR (₹)" />
          </label>
        </div>
      </div>
    </div>
  )
}
