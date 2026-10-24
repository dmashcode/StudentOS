import { Link, Navigate, Route, Routes } from 'react-router-dom'
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

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-md p-8 text-center">
        <h1 className="font-script text-5xl font-semibold text-sky-700">Page not found</h1>
        <p className="mt-2 text-ink-soft">The page you are looking for does not exist.</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block rounded-2xl bg-sky-700 px-7 py-3 font-medium text-white shadow-lg hover:bg-sky-800"
        >
          Go to Dashboard
        </Link>
      </div>
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}