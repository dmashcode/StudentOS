import client from './client'

export async function listNotes(subjectId) {
  const params = subjectId ? { subject_id: subjectId } : {}
  const res = await client.get('/notes', { params })
  return res.data
}

export async function getNote(id) {
  const res = await client.get(`/notes/${id}`)
  return res.data
}

export async function createNote({ title, content = '', subjectId = null }) {
  const res = await client.post('/notes', {
    title,
    content,
    subject_id: subjectId,
  })
  return res.data
}

export async function updateNote(id, changes) {
  const res = await client.patch(`/notes/${id}`, changes)
  return res.data
}

export async function deleteNote(id) {
  await client.delete(`/notes/${id}`)
}