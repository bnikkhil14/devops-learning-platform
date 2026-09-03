// src/types/incidents.ts
import type { Difficulty } from './content'

export interface IncidentSummary {
  id: number
  slug: string
  title: string
  category: string
  difficulty: Difficulty
  createdAt: string
}

export interface IncidentChoice {
  id: number
  choiceText: string
}

export interface IncidentDetail {
  id: number
  slug: string
  title: string
  category: string
  difficulty: Difficulty
  scenarioText: string
  choices: IncidentChoice[]
}

export interface IncidentAttemptResult {
  isCorrect: boolean
  feedbackText: string
  attemptId: string
}