import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { Project } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { MarkCompleteButton } from '@/components/MarkCompleteButton'
import { useAuth } from '@/context/AuthContext'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [completed, setCompleted] = useState(false)
  const [togglePending, setTogglePending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle(project ? project.title : 'Project')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .getProject(slug)
      .then(setProject)
      .catch(() => setError('Could not load this project. It may not exist.'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!user || !project) return
    api
      .getProgress()
      .then((records) => {
        const match = records.find((r) => r.contentType === 'PROJECT' && r.contentId === project.id)
        setCompleted(match?.completed ?? false)
      })
      .catch(() => {
        // silently ignore — progress just won't show as completed if this fails
      })
  }, [user, project])

  const handleToggle = async () => {
    if (!project) return
    setTogglePending(true)
    const previous = completed
    setCompleted(!previous)

    try {
      const result = await api.toggleProgress('PROJECT', project.id)
      setCompleted(result.completed)
    } catch {
      setCompleted(previous)
    } finally {
      setTogglePending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {loading && <p className="mt-8 text-slate-500">Loading project…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && project && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
            <DifficultyBadge difficulty={project.difficulty} />
          </div>

          <p className="mt-4 text-slate-600">{project.description}</p>

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

          <div className="mt-6 flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            {project.estimatedHours}h
          </div>

          {project.learningPath && (
            <p className="mt-6 text-sm text-slate-500">
              Part of{' '}
              <Link to={`/learning-paths/${project.learningPath.slug}`} className="text-blue-600 hover:underline">
                {project.learningPath.title}
              </Link>
            </p>
          )}

          {user ? (
            <MarkCompleteButton completed={completed} pending={togglePending} onClick={handleToggle} />
          ) : (
            <p className="mt-6 text-sm text-slate-500">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{' '}
              to track your progress on this project.
            </p>
          )}
        </div>
      )}
    </div>
  )
}