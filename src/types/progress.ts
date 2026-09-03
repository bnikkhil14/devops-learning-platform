export type ContentType = 'LEARNING_PATH' | 'LAB' | 'PROJECT' | 'INCIDENT'

export interface UserProgress {
  id: string
  userId: string
  contentType: ContentType
  contentId: number
  completed: boolean
  completedAt: string | null
  updatedAt: string
}