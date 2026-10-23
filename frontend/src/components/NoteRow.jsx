import { Link } from 'react-router-dom'
import { subjectColor } from '../utils/subjectColor'
import { timeAgo } from '../utils/time'

export default function NoteRow({ note, subject }) {
  return (
    <Link
      to={`/workspace/notes/${note.id}`}
      className="glass flex items-center gap-4 px-6 py-4 transition hover:-translate-y-0.5"
    >
      <span className="min-w-0 flex-1 truncate font-medium">{note.title}</span>
      {subject && (
        <span className={`rounded-full px-3 py-0.5 text-xs ${subjectColor(subject.id).chip}`}>
          {subject.name}
        </span>
      )}
      <span className="w-28 text-right text-sm text-ink-soft">{timeAgo(note.updated_at)}</span>
    </Link>
  )
}