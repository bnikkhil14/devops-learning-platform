const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`)
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status)
  }
  return res.json() as Promise<T>
}

export const api = {
  getLearningPaths: () => apiFetch<import('@/types/content').LearningPath[]>('/api/learning-paths'),
  getLearningPath: (slug: string) =>
    apiFetch<import('@/types/content').LearningPath>(`/api/learning-paths/${slug}`),
  getLabs: () => apiFetch<import('@/types/content').Lab[]>('/api/labs'),
  getLab: (slug: string) => apiFetch<import('@/types/content').Lab>(`/api/labs/${slug}`),
  getProjects: () => apiFetch<import('@/types/content').Project[]>('/api/projects'),
  getProject: (slug: string) => apiFetch<import('@/types/content').Project>(`/api/projects/${slug}`),
}