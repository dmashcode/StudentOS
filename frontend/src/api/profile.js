import client from './client'

export async function fetchProfile() {
  const res = await client.get('/profile')
  return res.data
}