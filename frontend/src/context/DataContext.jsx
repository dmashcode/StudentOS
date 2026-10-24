import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { listNotes } from '../api/notes'
import {
  createSubject,
  deleteSubject,
  listSubjects,
  renameSubject as renameSubjectApi,
} from '../api/subjects'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [subjects, setSubjects] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const [subjectList, noteList] = await Promise.all([listSubjects(), listNotes()])
      setSubjects(subjectList)
      setNotes(noteList)
      setError('')
    } catch {
      setError('Could not load your data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function addSubject(name) {
    await createSubject(name)
    await reload()
  }

  async function renameSubject(id, name) {
    await renameSubjectApi(id, name)
    await reload()
  }

  async function removeSubject(id) {
    await deleteSubject(id)
    await reload()
  }

  return (
    <DataContext.Provider
      value={{ subjects, notes, loading, error, reload, addSubject, renameSubject, removeSubject }}
    >
      {children}
    </DataContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  return useContext(DataContext)
}