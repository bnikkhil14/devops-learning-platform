import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signup(email, password, name || undefined)
      navigate('/dashboard')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/50 p-8">
        <h1 className="mb-6 text-2xl font-semibold text-slate-100">Create an account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm text-slate-300">
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 focus:border-slate-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
          </div>

          {error && (
            <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-400">{error}</p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-200 underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}