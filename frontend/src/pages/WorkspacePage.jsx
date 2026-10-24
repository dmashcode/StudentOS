import { Link, useSearchParams } from 'react-router-dom'
import NoteRow from '../components/NoteRow'
import SubjectActions from '../components/SubjectActions'
import { useData } from '../context/DataContext'

function tabClass(active) {
  return `rounded-full px-4 py-1.5 text-sm ${
    active ? 'bg-white font-medium shadow' : 'text-ink-soft hover:bg-white/50'
  }`
}

export default function WorkspacePage() {
  const { subjects, notes, loading, error } = useData()
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('subject')

  const subject =
    filter && filter !== 'unfiled'
      ? subjects.find((item) => String(item.id) === filter)
      : null
  const subjectMissing = !loading && Boolean(filter) && filter !== 'unfiled' && !subject
  const subjectById = new Map(subjects.map((item) => [item.id, item]))
  const unfiledCount = notes.filter((note) => note.subject_id === null).length

  let visible = notes
  let heading = 'All notes'
  if (filter === 'unfiled') {
    visible = notes.filter((note) => note.subject_id === null)
    heading = 'Unfiled'
  } else if (subject) {
    visible = notes.filter((note) => note.subject_id === subject.id)
    heading = subject.name
  } else if (subjectMissing) {
    visible = []
    heading = 'Subject not found'
  }

  const newNoteLink = subject
    ? `/workspace/notes/new?subject=${subject.id}`
    : '/workspace/notes/new'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-script text-5xl font-semibold text-ink md:text-6xl">
          {loading ? 'Workspace' : heading}
        </h1>
        <Link
          to={newNoteLink}
          className="rounded-2xl bg-sky-700 px-7 py-3 font-medium text-white shadow-lg hover:bg-sky-800"
        >
          New note
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/workspace" className={tabClass(!filter)}>
          All notes ({notes.length})
        </Link>
        <Link to="/workspace?subject=unfiled" className={tabClass(filter === 'unfiled')}>
          Unfiled ({unfiledCount})
        </Link>
      </div>

      {subject && (
        <SubjectActions key={subject.id} subject={subject} noteCount={visible.length} />
      )}

      {error && <p className="rounded-xl bg-rose-100 px-4 py-2 text-rose-800">{error}</p>}
      {loading && <p className="text-ink-soft">Loading...</p>}

      {subjectMissing && (
        <div className="glass p-6 text-ink-soft">
          This subject does not exist.{' '}
          <Link to="/workspace" className="font-medium text-sky-700 hover:underline">
            Go to all notes
          </Link>
        </div>
      )}

      {!loading && !subjectMissing && visible.length === 0 && (
        <div className="glass p-6 text-ink-soft">
          {notes.length === 0
            ? 'No notes yet. Create your first one with the New note button.'
            : 'No notes here yet.'}
        </div>
      )}

      <div className="space-y-3">
        {visible.map((note) => (
          <NoteRow key={note.id} note={note} subject={subjectById.get(note.subject_id)} />
        ))}
      </div>
    </div>
  )
}