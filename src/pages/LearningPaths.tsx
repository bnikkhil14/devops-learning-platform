import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Layers } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { LearningPath } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'

export default function LearningPaths() {
  usePageTitle('Learning Paths')

  const [paths, setPaths] = useState<LearningPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getLearningPaths()
      .then(setPaths)
      .catch(() => setError('Could not load learning paths. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Learning Paths</h1>
      <p className="mt-2 text-slate-600">
        Structured roadmaps that group labs and projects into a guided journey.
      </p>

      {loading && <p className="mt-8 text-slate-500">Loading learning paths…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.id}
              to={`/learning-paths/${path.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{path.title}</h2>
                <DifficultyBadge difficulty={path.difficulty} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{path.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {path.estimatedHours}h
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {path.labs.length} labs · {path.projects.length} projects
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}