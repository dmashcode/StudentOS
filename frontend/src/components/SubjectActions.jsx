import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import { useData } from '../context/DataContext'

export default function SubjectActions({ subject, noteCount }) {
  const { renameSubject, removeSubject } = useData()
  const navigate = useNavigate()
  const [mode, setMode] = useState('idle')
  const [name, setName] = useState(subject.name)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function reset() {
    setMode('idle')
    setName(subject.name)
    setError('')
  }

  async function handleRename(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Name cannot be empty')
      return
    }
    setBusy(true)
    setError('')
    try {
      await renameSubject(subject.id, trimmed)
      setMode('idle')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete() {
    setBusy(true)
    setError('')
    try {
      await removeSubject(subject.id)
      navigate('/workspace')
    } catch (err) {
      setError(getErrorMessage(err))
      setBusy(false)
    }
  }

  if (mode === 'renaming') {
    return (
      <form onSubmit={handleRename} className="flex flex-wrap items-center gap-2">
        <input
          autoFocus
          aria-label="Subject name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className="rounded-xl border border-sky-200 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-300"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {busy ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl px-3 py-2 text-sm text-ink-soft hover:bg-white/60"
        >
          Cancel
        </button>
        {error && (
          <p role="alert" className="w-full text-sm text-rose-700">
            {error}
          </p>
        )}
      </form>
    )
  }

  if (mode === 'confirming') {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-ink">
          Delete {subject.name}?
          {noteCount > 0 &&
            ` Its ${noteCount} note${noteCount === 1 ? '' : 's'} will become Unfiled.`}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="rounded-xl bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {busy ? 'Deleting...' : 'Yes, delete'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl px-3 py-2 text-ink-soft hover:bg-white/60"
        >
          Cancel
        </button>
        {error && (
          <p role="alert" className="w-full text-rose-700">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-2 text-sm">
      <button
        type="button"
        onClick={() => setMode('renaming')}
        className="rounded-xl px-3 py-1.5 text-ink-soft hover:bg-white/60"
      >
        Rename
      </button>
      <button
        type="button"
        onClick={() => setMode('confirming')}
        className="rounded-xl px-3 py-1.5 text-ink-soft hover:bg-white/60"
      >
        Delete subject
      </button>
    </div>
  )
}