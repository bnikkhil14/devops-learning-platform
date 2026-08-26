import { usePageTitle } from '@/hooks/usePageTitle'

export default function Labs() {
  usePageTitle('Labs')
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Hands-On Labs</h1>
      <p className="mt-2 text-slate-600">Guided exercises coming soon.</p>
    </div>
  )
}