import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, ArrowLeft } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { Lab } from '@/types/content'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { MarkCompleteButton } from '@/components/MarkCompleteButton'
import { useAuth } from '@/context/AuthContext'

export default function LabDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [lab, setLab] = useState<Lab | null>(null)
  const [completed, setCompleted] = useState(false)
  const [togglePending, setTogglePending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle(lab ? lab.title : 'Lab')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .getLab(slug)
      .then(setLab)
      .catch(() => setError('Could not load this lab. It may not exist.'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!user || !lab) return
    api
      .getProgress()
      .then((records) => {
        const match = records.find((r) => r.contentType === 'LAB' && r.contentId === lab.id)
        setCompleted(match?.completed ?? false)
      })
      .catch(() => {
        // silently ignore — progress just won't show as completed if this fails
      })
  }, [user, lab])

  const handleToggle = async () => {
    if (!lab) return
    setTogglePending(true)
    const previous = completed
    setCompleted(!previous) // optimistic update

    try {
      const result = await api.toggleProgress('LAB', lab.id)
      setCompleted(result.completed)
    } catch {
      setCompleted(previous) // revert on failure
    } finally {
      setTogglePending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/labs" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Labs
      </Link>

      {loading && <p className="mt-8 text-slate-500">Loading lab…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && lab && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{lab.title}</h1>
            <DifficultyBadge difficulty={lab.difficulty} />
          </div>

          <p className="mt-4 text-slate-600">{lab.description}</p>

          <div className="mt-6 flex items-center gap-1 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            {lab.estimatedMinutes} min
          </div>

          {lab.learningPath && (
            <p className="mt-6 text-sm text-slate-500">
              Part of{' '}
              <Link to={`/learning-paths/${lab.learningPath.slug}`} className="text-blue-600 hover:underline">
                {lab.learningPath.title}
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
              to track your progress on this lab.
            </p>
          )}
        </div>
      )}
    </div>
  )
}