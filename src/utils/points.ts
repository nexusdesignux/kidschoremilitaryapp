import { RANKS, DIFFICULTY } from './constants'

export function calculateRank(points: number) {
  return RANKS.find(rank => points >= rank.minPoints && points <= rank.maxPoints) || RANKS[0]
}

export function getNextRank(currentPoints: number) {
  const currentRank = calculateRank(currentPoints)
  const currentRankIndex = RANKS.findIndex(r => r.id === currentRank.id)

  if (currentRankIndex < RANKS.length - 1) {
    return RANKS[currentRankIndex + 1]
  }

  return null // Already at max rank
}

export function getPointsToNextRank(currentPoints: number) {
  const nextRank = getNextRank(currentPoints)

  if (!nextRank) {
    return 0 // Already at max rank
  }

  return nextRank.minPoints - currentPoints
}

export function getProgressToNextRank(currentPoints: number) {
  const currentRank = calculateRank(currentPoints)
  const nextRank = getNextRank(currentPoints)

  if (!nextRank) {
    return 100 // Already at max rank
  }

  const rangeStart = currentRank.minPoints
  const rangeEnd = nextRank.minPoints
  const progress = currentPoints - rangeStart
  const total = rangeEnd - rangeStart

  return Math.round((progress / total) * 100)
}

export function getMissionPoints(difficulty: keyof typeof DIFFICULTY) {
  return DIFFICULTY[difficulty]?.points || DIFFICULTY.EASY.points
}

export function calculateStreak(completedDates: Date[]): number {
  if (completedDates.length === 0) return 0

  // Sort dates in descending order
  const sortedDates = completedDates
    .map(d => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a)

  let streak = 1
  const today = new Date().setHours(0, 0, 0, 0)

  // Check if the most recent completion was today or yesterday
  const daysSinceLastCompletion = Math.floor((today - sortedDates[0]) / (1000 * 60 * 60 * 24))

  if (daysSinceLastCompletion > 1) {
    return 0 // Streak broken
  }

  // Count consecutive days
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const dayDiff = Math.floor((sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24))

    if (dayDiff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak
}
