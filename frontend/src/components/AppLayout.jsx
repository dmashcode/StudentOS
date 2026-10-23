import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { educationLabel } from '../constants/education'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', dot: 'bg-sky-700' },
  { to: '/workspace', label: 'Workspace', dot: 'bg-gold' },
  { to: '/profile', label: 'Profile', dot: 'bg-sky-300' },
]

function navClass({ isActive }) {
  return `flex items-center gap-3 rounded-2xl px-4 py-3 text-ink ${
    isActive ? 'bg-white font-medium shadow' : 'hover:bg-white/50'
  }`
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function AppLayout() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6 md:h-screen md:flex-row">
      <aside className="glass flex w-full flex-col gap-1.5 p-6 md:w-60 md:shrink-0">
        <div className="mb-4 flex items-center gap-2 font-script text-4xl font-semibold text-sky-700">
          <svg width="22" height="22" viewBox="0 0 24 24" className="fill-gold" aria-hidden="true">
            <path d="M12 2l2.9 6.6 7.1.7-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.3l7.1-.7z" />
          </svg>
          StudentOS
        </div>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-medium text-ink">
            {getInitials(profile.full_name)}
          </div>
          <div className="min-w-0 text-sm leading-tight">
            <p className="truncate">{profile.full_name}</p>
            <p className="truncate text-xs text-ink-soft">
              {educationLabel(profile.education_level) ?? profile.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-2xl px-4 py-2 text-left text-sm text-ink-soft hover:bg-white/50"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 md:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}