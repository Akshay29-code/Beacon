"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { gamification, type UserStats, type Activity } from "@/lib/gamification"

interface GamificationContextType {
  stats: UserStats
  activities: Activity[]
  onNoteCreated: (wordCount?: number) => void
  onNoteEdited: (wordCount?: number) => void
  refreshStats: () => void
  showAchievement: (achievement: any) => void
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(gamification.getStats())
  const [activities, setActivities] = useState<Activity[]>(gamification.getRecentActivities())
  const [achievementToast, setAchievementToast] = useState<any>(null)

  useEffect(() => {
    gamification.onDailyLogin()
    refreshStats()
  }, [])

  const refreshStats = () => {
    setStats(gamification.getStats())
    setActivities(gamification.getRecentActivities())
  }

  const onNoteCreated = (wordCount?: number) => {
    const oldLevel = stats.level
    gamification.onNoteCreated(wordCount)
    const newStats = gamification.getStats()

    if (newStats.level > oldLevel) {
      showAchievement({
        title: `Level Up!`,
        description: `You reached level ${newStats.level}!`,
        icon: "🎉",
        xp: 0,
      })
    }

    refreshStats()
  }

  const onNoteEdited = (wordCount?: number) => {
    gamification.onNoteEdited(wordCount)
    refreshStats()
  }

  const showAchievement = (achievement: any) => {
    setAchievementToast(achievement)
    setTimeout(() => setAchievementToast(null), 4000)
  }

  return (
    <GamificationContext.Provider
      value={{
        stats,
        activities,
        onNoteCreated,
        onNoteEdited,
        refreshStats,
        showAchievement,
      }}
    >
      {children}

      {achievementToast && (
        <div className="fixed top-4 right-4 z-50 bg-card border border-border rounded-lg p-4 shadow-lg animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{achievementToast.icon}</span>
            <div>
              <h4 className="font-semibold text-foreground">{achievementToast.title}</h4>
              <p className="text-sm text-muted-foreground">{achievementToast.description}</p>
              {achievementToast.xp > 0 && <p className="text-xs text-primary">+{achievementToast.xp} XP</p>}
            </div>
          </div>
        </div>
      )}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
