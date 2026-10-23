import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { profile, loading } = useAuth()
  if (loading) {
    return <p className="p-6 text-center text-ink-soft">Loading...</p>
  }
  if (!profile) {
    return <Navigate to="/login" replace />
  }
  return children
}