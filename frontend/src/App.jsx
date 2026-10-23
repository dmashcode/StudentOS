import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage'

function Placeholder({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 text-center">
        <h1 className="font-script text-5xl font-semibold text-sky-700">{title}</h1>
        <p className="mt-2 text-ink-soft">Ye page abhi khaali hai.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
      <Route path="/workspace" element={<Placeholder title="Workspace" />} />
      <Route path="/profile" element={<Placeholder title="Profile" />} />
      <Route path="*" element={<Placeholder title="Not found" />} />
    </Routes>
  )
}