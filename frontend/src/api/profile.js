import client from './client'

export async function fetchProfile() {
  const res = await client.get('/profile')
  return res.data
}

export async function updateProfile(data) {
  const res = await client.put('/profile', data)
  return res.data
}