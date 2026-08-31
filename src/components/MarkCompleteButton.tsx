import { CheckCircle2, Circle } from 'lucide-react'

interface MarkCompleteButtonProps {
  completed: boolean
  pending?: boolean
  onClick: () => void
}

export function MarkCompleteButton({ completed, pending, onClick }: MarkCompleteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={`mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        completed
          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'bg-slate-900 text-white hover:bg-slate-800'
      } disabled:opacity-60`}
    >
      {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  )
}