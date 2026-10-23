import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage } from '../api/errors'
import AuthCard from '../components/AuthCard'
import TextField from '../components/TextField'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(email, fullName, password)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          id="fullName"
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          maxLength={100}
          autoComplete="name"
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          id="password"
          label="Password (at least 8 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
        />
        {error && (
          <p role="alert" className="rounded-xl bg-rose-100 px-4 py-2 text-sm text-rose-800">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-sky-700 px-6 py-3 font-medium text-white shadow-lg hover:bg-sky-800 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-sky-700 hover:underline">
          Login
        </Link>
      </p>
    </AuthCard>
  )
}