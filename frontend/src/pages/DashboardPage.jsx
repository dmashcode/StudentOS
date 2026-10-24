import { Link } from 'react-router-dom'
import NoteRow from '../components/NoteRow'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

function StatCard({ value, label, gold }) {
  return (
    <div
      className="glass p-6"
      style={gold ? { background: 'rgba(250, 204, 21, 0.4)' } : undefined}
    >
      <p className="text-4xl font-medium">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { profile } = useAuth()
  const { subjects, notes, loading, error } = useData()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const unfiled = notes.filter((note) => note.subject_id === null).length
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]))
  const recent = notes.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-script text-5xl font-semibold text-ink md:text-6xl">
            Hey {profile.full_name},
          </h1>
          <p className="mt-1 text-ink-soft">{today}</p>
        </div>
        <Link
          to="/workspace/notes/new"
          className="rounded-2xl bg-sky-700 px-7 py-3 font-medium text-white shadow-lg hover:bg-sky-800"
        >
          New note
        </Link>
      </div>

      {error && <p className="rounded-xl bg-rose-100 px-4 py-2 text-rose-800">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard value={loading ? '-' : notes.length} label="Notes" />
        <StatCard value={loading ? '-' : subjects.length} label="Subjects" />
        <StatCard value={loading ? '-' : unfiled} label="Unfiled notes" gold />
      </div>

      <h2 className="text-xl font-medium">Recent notes</h2>

      {!loading && recent.length === 0 && (
        <div className="glass p-6 text-ink-soft">
          No notes yet. Your first note will show up here.
        </div>
      )}

      <div className="space-y-3">
        {recent.map((note) => (
          <NoteRow key={note.id} note={note} subject={subjectById.get(note.subject_id)} />
        ))}
      </div>
    </div>
  )
}