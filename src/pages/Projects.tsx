import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { Project } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'

export default function Projects() {
  usePageTitle('Projects')

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(() => setError('Could not load projects. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
      <p className="mt-2 text-slate-600">Bigger builds that combine multiple skills end to end.</p>

      {loading && <p className="mt-8 text-slate-500">Loading projects…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{project.title}</h2>
                <DifficultyBadge difficulty={project.difficulty} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {project.estimatedHours}h
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}