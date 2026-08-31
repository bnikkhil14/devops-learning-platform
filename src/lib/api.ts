// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface ApiFetchOptions extends RequestInit {
  skipAuth?: boolean
}

async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { skipAuth, ...fetchOptions } = options
  const token = localStorage.getItem('token')

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(fetchOptions.headers as Record<string, string> || {}),
}
  if (token && !skipAuth) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })

if (res.status === 401) {
  // Only treat this as "session expired" for authenticated requests.
  // Login/signup failures (skipAuth: true) are just wrong credentials —
  // let the calling page handle and display that error normally.
  if (!skipAuth) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/devops-learning-platform/login'
    }
  }

  const errorBody = await res.json().catch(() => ({}))
  throw new ApiError(errorBody.error || 'Session expired. Please log in again.', 401)
}

  return res.json() as Promise<T>
}

export const api = {
  // --- existing content routes (unchanged behavior, now auth-aware if a token exists) ---
    
  // --- LearningPath routes ---
  getLearningPaths: () => apiFetch<import('@/types/content').LearningPath[]>('/api/learning-paths'),
  getLearningPath: (slug: string) => apiFetch<import('@/types/content').LearningPath>(`/api/learning-paths/${slug}`),
 
  // --- Labs routes ---
  getLabs: () => apiFetch<import('@/types/content').Lab[]>('/api/labs'),
  getLab: (slug: string) => apiFetch<import('@/types/content').Lab>(`/api/labs/${slug}`),
 
  // --- Project routes ---
  getProjects: () => apiFetch<import('@/types/content').Project[]>('/api/projects'),
  getProject: (slug: string) => apiFetch<import('@/types/content').Project>(`/api/projects/${slug}`),

  // --- progress routes ---
  getProgress: () => apiFetch<import('@/types/progress').UserProgress[]>('/api/progress'),
  toggleProgress: (contentType: import('@/types/progress').ContentType, contentId: number) =>
    apiFetch<import('@/types/progress').UserProgress>('/api/progress/toggle', {
      method: 'POST',
      body: JSON.stringify({ contentType, contentId }),
    }),

  // --- new auth routes ---
  signup: (email: string, password: string, name?: string) =>
    apiFetch<import('@/types/auth').AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
      skipAuth: true,
    }),
  login: (email: string, password: string) =>
    apiFetch<import('@/types/auth').AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    }),
  getMe: () => apiFetch<{ user: import('@/types/auth').User }>('/api/auth/me'),
}

export { ApiError }