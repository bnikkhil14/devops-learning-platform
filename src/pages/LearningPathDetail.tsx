import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { LearningPath } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'

export default function LearningPathDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [path, setPath] = useState<LearningPath | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle(path ? path.title : 'Learning Path')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .getLearningPath(slug)
      .then(setPath)
      .catch(() => setError('Could not load this learning path. It may not exist.'))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/learning-paths" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Learning Paths
      </Link>

      {loading && <p className="mt-8 text-slate-500">Loading learning path…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && path && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{path.title}</h1>
            <DifficultyBadge difficulty={path.difficulty} />
          </div>

          <p className="mt-4 text-slate-600">{path.description}</p>

          <div className="mt-6 flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            {path.estimatedHours}h total
          </div>

          {path.labs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-slate-900">Labs in this path</h2>
              <div className="mt-3 space-y-2">
                {path.labs.map((lab) => (
                  <Link
                    key={lab.id}
                    to={`/labs/${lab.slug}`}
                    className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {lab.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {path.projects.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">Projects in this path</h2>
              <div className="mt-3 space-y-2">
                {path.projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="block rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}