import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { DataProvider } from './context/DataContext'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import NoteEditorPage from './pages/NoteEditorPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import WorkspacePage from './pages/WorkspacePage'
import GuestRoute from './routes/GuestRoute'
import ProtectedRoute from './routes/ProtectedRoute'

function Placeholder({ title }) {
  return (
    <div className="glass p-8">
      <h1 className="font-script text-5xl font-semibold text-sky-700">{title}</h1>
      <p className="mt-2 text-ink-soft">Ye page abhi khaali hai.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route
        element={
          <ProtectedRoute>
            <DataProvider>
              <AppLayout />
            </DataProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/workspace/notes/:id" element={<NoteEditorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Placeholder title="Not found" />} />
    </Routes>
  )
}