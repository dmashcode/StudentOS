import client from './client'

export async function registerUser({ email, fullName, password }) {
  const res = await client.post('/auth/register', {
    email,
    full_name: fullName,
    password,
  })
  return res.data
}

export async function loginUser({ email, password }) {
  const res = await client.post('/auth/login', { email, password })
  return res.data.access_token
}