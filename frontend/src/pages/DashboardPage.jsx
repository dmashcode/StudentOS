import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { profile } = useAuth()

  return (
    <div>
      <h1 className="font-script text-6xl font-semibold text-ink">
        Hey {profile.full_name},
      </h1>
      <p className="mt-1 text-ink-soft">Dashboard jaldi aa raha hai.</p>
    </div>
  )
}