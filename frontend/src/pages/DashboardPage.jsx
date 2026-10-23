import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 text-center">
        <h1 className="font-script text-5xl font-semibold text-sky-700">
          Hey {profile.full_name},
        </h1>
        <p className="mt-2 text-ink-soft">{profile.email}</p>
        <p className="mt-4 text-ink-soft">Dashboard jaldi aa raha hai.</p>
        <button
          onClick={handleLogout}
          className="mt-6 rounded-2xl border border-sky-700 px-6 py-3 font-medium text-sky-700 hover:bg-sky-50"
        >
          Logout
        </button>
      </div>
    </div>
  )
}