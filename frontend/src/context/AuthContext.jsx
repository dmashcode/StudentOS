import { createContext, useContext, useEffect, useState } from 'react'
import { loginUser, registerUser } from '../api/auth'
import { fetchProfile, updateProfile } from '../api/profile'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    fetchProfile()
      .then(setProfile)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const token = await loginUser({ email, password })
    localStorage.setItem('token', token)
    setProfile(await fetchProfile())
  }

  async function register(email, fullName, password) {
    await registerUser({ email, fullName, password })
    await login(email, password)
  }

  async function saveProfile(data) {
    setProfile(await updateProfile(data))
  }

  function logout() {
    localStorage.removeItem('token')
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ profile, loading, login, register, saveProfile, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}