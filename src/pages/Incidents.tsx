import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { IncidentSummary } from '@/types/incidents'
import { DifficultyBadge } from '@/components/DifficultyBadge'

export default function Incidents() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle('Incident Simulator')

  useEffect(() => {
    api
      .getIncidents()
      .then(setIncidents)
      .catch(() => setError('Could not load incidents.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-slate-900">Incident Simulator</h1>
      <p className="mt-2 text-slate-600">
        Diagnose real-world DevOps failures. Pick an action, get immediate feedback.
      </p>

      {loading && <p className="mt-8 text-slate-500">Loading incidents…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && incidents.length === 0 && (
        <p className="mt-8 text-slate-500">No incidents available yet.</p>
      )}

      {!loading && !error && incidents.length > 0 && (
        <div className="mt-8 space-y-4">
          {incidents.map((incident) => (
            <Link
              key={incident.id}
              to={`/incidents/${incident.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{incident.title}</h2>
                <DifficultyBadge difficulty={incident.difficulty} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{incident.category}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}