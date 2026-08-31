import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, FlaskConical, Rocket } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { Lab, Project } from '@/types/content'
import type { UserProgress } from '@/types/progress'

export default function Dashboard() {
  usePageTitle('Dashboard')

  const [labs, setLabs] = useState<Lab[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([api.getLabs(), api.getProjects(), api.getProgress()])
      .then(([labsData, projectsData, progressData]) => {
        setLabs(labsData)
        setProjects(projectsData)
        setProgress(progressData)
      })
      .catch(() => setError('Could not load your progress. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const completedLabIds = new Set(
    progress.filter((p) => p.contentType === 'LAB' && p.completed).map((p) => p.contentId)
  )
  const completedProjectIds = new Set(
    progress.filter((p) => p.contentType === 'PROJECT' && p.completed).map((p) => p.contentId)
  )

  const completedLabs = labs.filter((lab) => completedLabIds.has(lab.id))
  const completedProjects = projects.filter((project) => completedProjectIds.has(project.id))

  const hasAnyProgress = completedLabs.length > 0 || completedProjects.length > 0

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Progress Dashboard</h1>
      <p className="mt-2 text-slate-600">Track your learning journey.</p>

      {loading && <p className="mt-8 text-slate-500">Loading your progress…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && (
        <>
          {/* Summary stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <FlaskConical className="h-4 w-4" />
                <span className="text-sm">Labs</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {completedLabs.length} <span className="text-base font-normal text-slate-500">/ {labs.length} completed</span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Rocket className="h-4 w-4" />
                <span className="text-sm">Projects</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {completedProjects.length} <span className="text-base font-normal text-slate-500">/ {projects.length} completed</span>
              </p>
            </div>
          </div>

          {/* Empty state */}
          {!hasAnyProgress && (
            <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-slate-600">You haven't completed any labs or projects yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Head over to{' '}
                <Link to="/labs" className="text-blue-600 hover:underline">
                  Labs
                </Link>{' '}
                or{' '}
                <Link to="/projects" className="text-blue-600 hover:underline">
                  Projects
                </Link>{' '}
                to get started.
              </p>
            </div>
          )}

          {/* Completed labs */}
          {completedLabs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">Completed Labs</h2>
              <div className="mt-3 space-y-2">
                {completedLabs.map((lab) => (
                  <Link
                    key={lab.id}
                    to={`/labs/${lab.slug}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    {lab.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Completed projects */}
          {completedProjects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Completed Projects</h2>
              <div className="mt-3 space-y-2">
                {completedProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.slug}`}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    {project.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}