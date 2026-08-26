export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface Lab {
  id: number
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  order: number
  learningPathId: number | null
}

export interface Project {
  id: number
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedHours: number
  techStack: string[]
  order: number
  learningPathId: number | null
}

export interface LearningPath {
  id: number
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedHours: number
  order: number
  labs: Lab[]
  projects: Project[]
}