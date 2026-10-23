import { useEffect, useState } from 'react'
import client from '../api/client'

const LABELS = {
  checking: 'Checking backend...',
  ok: 'Backend connected',
  down: 'Backend not reachable',
}

const STYLES = {
  checking: 'bg-sky-100 text-sky-800',
  ok: 'bg-emerald-100 text-emerald-800',
  down: 'bg-rose-100 text-rose-800',
}

export default function HealthBadge() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    client
      .get('/health')
      .then((res) => setStatus(res.data.database === 'connected' ? 'ok' : 'down'))
      .catch(() => setStatus('down'))
  }, [])

  return (
    <p className={`mx-auto mt-4 w-fit rounded-full px-4 py-1 text-sm ${STYLES[status]}`}>
      {LABELS[status]}
    </p>
  )
}