import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { educationLabel } from '../constants/education'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { subjectColor } from '../utils/subjectColor'

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

function SubjectList() {
  const { subjects, notes, loading, error } = useData()

  if (loading) {
    return <p className="px-4 text-sm text-ink-soft">Loading...</p>
  }
  if (error) {
    return <p className="px-4 text-sm text-rose-700">{error}</p>
  }
  if (subjects.length === 0) {
    return <p className="px-4 text-sm text-ink-soft">No subjects yet. Add your first one!</p>
  }

  return (
    <>
      {subjects.map((subject) => {
        const count = notes.filter((note) => note.subject_id === subject.id).length
        return (
          <Link
            key={subject.id}
            to={`/workspace?subject=${subject.id}`}
            className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-ink hover:bg-white/50"
          >
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${subjectColor(subject.id).dot}`} />
            <span className="min-w-0 flex-1 truncate">{subject.name}</span>
            <span className="text-xs text-ink-soft">{count}</span>
          </Link>
        )
      })}
    </>
  )
}

function NewSubject() {
  const { addSubject } = useData()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function close() {
    setOpen(false)
    setName('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      await addSubject(trimmed)
      close()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl px-4 py-2 text-left text-sm font-medium text-sky-700 hover:bg-white/50"
      >
        + New subject
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 px-1 py-2">
      <input
        autoFocus
        aria-label="Subject name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={100}
        placeholder="e.g. Physics"
        className="w-full rounded-xl border border-sky-200 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-300"
      />
      {error && (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-sky-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {saving ? 'Adding...' : 'Add'}
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded-xl px-3 py-1.5 text-sm text-ink-soft hover:bg-white/50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
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

        <p className="mt-5 px-4 text-sm text-ink-soft">Subjects</p>
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          <SubjectList />
        </div>
        <NewSubject />

        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/70 p-3">
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