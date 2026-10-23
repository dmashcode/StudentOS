import client from './client'

export async function listSubjects() {
  const res = await client.get('/subjects')
  return res.data
}

export async function createSubject(name) {
  const res = await client.post('/subjects', { name })
  return res.data
}

export async function renameSubject(id, name) {
  const res = await client.patch(`/subjects/${id}`, { name })
  return res.data
}

export async function deleteSubject(id) {
  await client.delete(`/subjects/${id}`)
}