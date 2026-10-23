import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { createNote, deleteNote, getNote, updateNote } from '../api/notes'
import { useData } from '../context/DataContext'

function NoteEditor({ id }) {
  const isNew = id === 'new'
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { subjects, reload } = useData()

  const [subjectFromQuery] = useState(() => {
    const value = searchParams.get('subject')
    return value && /^\d+$/.test(value) ? value : ''
  })
  const [loadState, setLoadState] = useState(isNew ? 'ready' : 'loading')
  const [note, setNote] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState(isNew ? subjectFromQuery : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(location.state?.justSaved === true)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    let ignore = false
    getNote(id)
      .then((data) => {
        if (ignore) return
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
        setSubjectId(data.subject_id === null ? '' : String(data.subject_id))
        setLoadState('ready')
      })
      .catch((err) => {
        if (ignore) return
        const status = err.response?.status
        setLoadState(status === 404 || status === 422 ? 'missing' : 'error')
      })
    return () => {
      ignore = true
    }
  }, [id, isNew])

  const originalSubject = isNew
    ? subjectFromQuery
    : note && note.subject_id !== null
      ? String(note.subject_id)
      : ''
  const dirty = isNew
    ? title !== '' || content !== '' || subjectId !== subjectFromQuery
    : note !== null &&
      (title !== note.title || content !== note.content || subjectId !== originalSubject)

  const backSubject = subjects.find((item) => String(item.id) === originalSubject)
  const backTo = originalSubject ? `/workspace?subject=${originalSubject}` : '/workspace'

  function edit(setter) {
    return (event) => {
      setter(event.target.value)
      setSaved(false)
    }
  }

  async function handleSave(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    const subject = subjectId ? Number(subjectId) : null
    try {
      if (isNew) {
        const created = await createNote({ title, content, subjectId: subject })
        await reload()
        navigate(`/workspace/notes/${created.id}`, { replace: true, state: { justSaved: true } })
      } else {
        const updated = await updateNote(id, { title, content, subject_id: subject })
        setNote(updated)
        await reload()
        setSaved(true)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setError('')
    setDeleting(true)
    try {
      await deleteNote(id)
      await reload()
      navigate('/workspace')
    } catch (err) {
      setError(getErrorMessage(err))
      setConfirming(false)
      setDeleting(false)
    }
  }

  if (loadState === 'loading') {
    return <p className="text-ink-soft">Loading note...</p>
  }
  if (loadState === 'missing' || loadState === 'error') {
    return (
      <div className="glass p-6 text-ink-soft">
        {loadState === 'missing' ? 'This note does not exist.' : 'Could not load this note.'}{' '}
        <Link to="/workspace" className="font-medium text-sky-700 hover:underline">
          Back to Workspace
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="glass flex flex-col gap-4 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={backTo} className="text-sm font-medium text-sky-700 hover:underline">
          &larr; Back to {backSubject ? backSubject.name : 'all notes'}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {saved && (
            <span role="status" className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
              Saved
            </span>
          )}
          {dirty && !saved && (
            <span className="flex items-center gap-2 text-sm text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-gold" />
              Unsaved changes
            </span>
          )}
          {!isNew && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-2xl border border-ink/30 px-5 py-2.5 text-ink hover:bg-white/60"
            >
              Delete
            </button>
          )}
          {confirming && (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-soft">Delete this note?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-xl px-3 py-2 text-ink-soft hover:bg-white/60"
              >
                Cancel
              </button>
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-sky-700 px-7 py-2.5 font-medium text-white shadow-lg hover:bg-sky-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-rose-100 px-4 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      <input
        aria-label="Note title"
        value={title}
        onChange={edit(setTitle)}
        required
        maxLength={200}
        placeholder="Title"
        className="w-full bg-transparent text-3xl font-medium text-ink outline-none placeholder:text-ink-soft/60"
      />

      <div className="flex items-center gap-3">
        <label htmlFor="subject" className="text-sm text-ink-soft">
          Subject
        </label>
        <select
          id="subject"
          value={subjectId}
          onChange={edit(setSubjectId)}
          className="rounded-xl border border-sky-200 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-300"
        >
          <option value="">Unfiled</option>
          {subjects.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        aria-label="Note content"
        value={content}
        onChange={edit(setContent)}
        maxLength={100000}
        placeholder="Start writing..."
        className="min-h-96 w-full resize-y rounded-2xl border border-sky-200 bg-white/60 p-6 leading-8 text-ink outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-300"
      />
    </form>
  )
}

export default function NoteEditorPage() {
  const { id } = useParams()
  return <NoteEditor key={id} id={id} />
}