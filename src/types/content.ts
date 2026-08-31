export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface LearningPathSummary {
  id: number
  slug: string
  title: string
}

export interface Lab {
  id: number
  slug: string
  title: string
  description: string
  difficulty: Difficulty
  estimatedMinutes: number
  order: number
  learningPathId: number | null
  learningPath: LearningPathSummary | null
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
  learningPath: LearningPathSummary | null
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