import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { Lab } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'

export default function Labs() {
  usePageTitle('Hands-On Labs')

  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getLabs()
      .then(setLabs)
      .catch(() => setError('Could not load labs. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Hands-On Labs</h1>
      <p className="mt-2 text-slate-600">Short, focused exercises to build real DevOps skills.</p>

      {loading && <p className="mt-8 text-slate-500">Loading labs…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 space-y-4">
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{lab.title}</h2>
                <DifficultyBadge difficulty={lab.difficulty} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{lab.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {lab.estimatedMinutes} min
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}