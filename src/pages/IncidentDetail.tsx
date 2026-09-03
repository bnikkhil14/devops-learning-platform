import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'
import { api } from '@/lib/api'
import type { IncidentDetail as IncidentDetailType, IncidentAttemptResult } from '@/types/incidents'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { useAuth } from '@/context/AuthContext'

export default function IncidentDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [incident, setIncident] = useState<IncidentDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<IncidentAttemptResult | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const locked = result !== null

  usePageTitle(incident ? incident.title : 'Incident')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    api
      .getIncident(slug)
      .then(setIncident)
      .catch(() => setError('Could not load this incident. It may not exist.'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async () => {
    if (!incident || selectedChoiceId === null) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const outcome = await api.submitIncidentAttempt(incident.slug, selectedChoiceId)
      setResult(outcome)
    } catch {
      setSubmitError('Could not submit your answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/incidents" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" />
        Back to Incidents
      </Link>

      {loading && <p className="mt-8 text-slate-500">Loading incident…</p>}
      {error && <p className="mt-8 text-rose-600">{error}</p>}

      {!loading && !error && incident && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
            <DifficultyBadge difficulty={incident.difficulty} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{incident.category}</p>

          <p className="mt-6 text-slate-700 leading-relaxed">{incident.scenarioText}</p>

          <div className="mt-6 space-y-3">
            {incident.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id
              return (
                <button
                  key={choice.id}
                  type="button"
                  disabled={locked}
                  onClick={() => setSelectedChoiceId(choice.id)}
                  className={`w-full text-left rounded-lg border p-4 transition-colors ${
                    isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200'
                  } ${locked ? 'opacity-70 cursor-not-allowed' : 'hover:border-slate-400'}`}
                >
                  {choice.choiceText}
                </button>
              )
            })}
          </div>

          {submitError && <p className="mt-4 text-rose-600">{submitError}</p>}

          {!locked && user && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedChoiceId === null || submitting}
              className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          )}

          {!user && !locked && (
            <p className="mt-6 text-sm text-slate-500">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{' '}
              to submit an answer and track your progress.
            </p>
          )}

          {result && (
            <div
              className={`mt-6 rounded-lg border p-4 ${
                result.isCorrect ? 'border-green-500 bg-green-50' : 'border-rose-500 bg-rose-50'
              }`}
            >
              <p className="font-semibold text-slate-900">{result.isCorrect ? 'Correct' : 'Not quite'}</p>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">{result.feedbackText}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}