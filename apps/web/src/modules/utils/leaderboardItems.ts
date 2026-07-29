import type { GameRecord, LeaderboardItem } from '@/modules/types/run'

export const toLeaderboardItem = (record: GameRecord): LeaderboardItem => ({
  uid: record.uid,
  level: record.level,
  score: record.score,
  playerName: record.user.name,
  completedAt: record.endedAt,
})

export const sortLeaderboardItems = (items: LeaderboardItem[]): LeaderboardItem[] => {
  return [...items].sort((a, b) => {
    const scoreDifference = b.score - a.score
    if (scoreDifference !== 0) return scoreDifference

    return a.completedAt.getTime() - b.completedAt.getTime()
  })
}
