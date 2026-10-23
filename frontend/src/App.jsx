import { Link, Navigate, Route, Routes } from 'react-router-dom'
import HealthBadge from './components/HealthBadge'

function Placeholder({ title }) {
  return (
    <div className="glass mx-auto mt-10 max-w-md p-8 text-center">
      <h1 className="font-script text-5xl font-semibold text-sky-700">{title}</h1>
      <p className="mt-2 text-ink-soft">Ye page abhi khaali hai.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen p-6">
      <nav className="glass mx-auto flex max-w-2xl flex-wrap justify-center gap-6 px-6 py-3 text-sm text-sky-700">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/workspace">Workspace</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <HealthBadge />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Placeholder title="Login" />} />
        <Route path="/register" element={<Placeholder title="Register" />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/workspace" element={<Placeholder title="Workspace" />} />
        <Route path="/profile" element={<Placeholder title="Profile" />} />
        <Route path="*" element={<Placeholder title="Not found" />} />
      </Routes>
    </div>
  )
}