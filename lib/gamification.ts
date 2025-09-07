interface UserStats {
  level: number
  xp: number
  xpToNextLevel: number
  totalNotes: number
  totalWords: number
  streak: number
  lastActiveDate: string
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  xpReward: number
}

interface Activity {
  type: "note_created" | "note_edited" | "daily_login" | "streak_milestone" | "word_milestone"
  xpGained: number
  timestamp: string
  metadata?: any
}

class GamificationSystem {
  private static instance: GamificationSystem
  private stats: UserStats
  private activities: Activity[] = []

  constructor() {
    this.stats = this.loadStats()
  }

  static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem()
    }
    return GamificationSystem.instance
  }

  private loadStats(): UserStats {
    if (typeof window === "undefined") {
      return this.getDefaultStats()
    }

    const saved = localStorage.getItem("user_stats")
    if (saved) {
      return JSON.parse(saved)
    }
    return this.getDefaultStats()
  }

  private getDefaultStats(): UserStats {
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalNotes: 0,
      totalWords: 0,
      streak: 0,
      lastActiveDate: new Date().toDateString(),
      achievements: [],
    }
  }

  private saveStats() {
    if (typeof window !== "undefined") {
      localStorage.setItem("user_stats", JSON.stringify(this.stats))
      localStorage.setItem("activities", JSON.stringify(this.activities))
    }
  }

  getStats(): UserStats {
    return { ...this.stats }
  }

  getRecentActivities(): Activity[] {
    return this.activities.slice(-10).reverse()
  }

  addXP(amount: number, activityType: Activity["type"], metadata?: any) {
    this.stats.xp += amount

    // Check for level up
    while (this.stats.xp >= this.stats.xpToNextLevel) {
      this.stats.xp -= this.stats.xpToNextLevel
      this.stats.level++
      this.stats.xpToNextLevel = Math.floor(this.stats.xpToNextLevel * 1.2)

      // Award level up achievement
      this.unlockAchievement({
        id: `level_${this.stats.level}`,
        title: `Level ${this.stats.level}`,
        description: `Reached level ${this.stats.level}!`,
        icon: "🎉",
        unlockedAt: new Date().toISOString(),
        xpReward: 0,
      })
    }

    // Record activity
    this.activities.push({
      type: activityType,
      xpGained: amount,
      timestamp: new Date().toISOString(),
      metadata,
    })

    this.saveStats()
    this.checkAchievements()
  }

  onNoteCreated(wordCount = 0) {
    this.stats.totalNotes++
    this.stats.totalWords += wordCount
    this.addXP(25, "note_created", { wordCount })
    this.updateStreak()
  }

  onNoteEdited(wordCount = 0) {
    this.stats.totalWords += wordCount
    this.addXP(10, "note_edited", { wordCount })
    this.updateStreak()
  }

  onDailyLogin() {
    const today = new Date().toDateString()
    if (this.stats.lastActiveDate !== today) {
      this.addXP(5, "daily_login")
      this.updateStreak()
      this.stats.lastActiveDate = today
    }
  }

  private updateStreak() {
    const today = new Date()
    const lastActive = new Date(this.stats.lastActiveDate)
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) {
      // Same day, maintain streak
      return
    } else if (daysDiff === 1) {
      // Next day, increment streak
      this.stats.streak++
      this.stats.lastActiveDate = today.toDateString()
    } else {
      // Streak broken
      this.stats.streak = 1
      this.stats.lastActiveDate = today.toDateString()
    }

    // Check for streak milestones
    if (this.stats.streak % 7 === 0) {
      this.addXP(50, "streak_milestone", { streak: this.stats.streak })
    }
  }

  private unlockAchievement(achievement: Achievement) {
    const exists = this.stats.achievements.find((a) => a.id === achievement.id)
    if (!exists) {
      this.stats.achievements.push(achievement)
      if (achievement.xpReward > 0) {
        this.stats.xp += achievement.xpReward
      }
    }
  }

  private checkAchievements() {
    const achievements = [
      {
        id: "first_note",
        condition: () => this.stats.totalNotes >= 1,
        title: "First Steps",
        description: "Created your first note",
        icon: "📝",
        xpReward: 10,
      },
      {
        id: "note_master",
        condition: () => this.stats.totalNotes >= 10,
        title: "Note Master",
        description: "Created 10 notes",
        icon: "📚",
        xpReward: 50,
      },
      {
        id: "wordsmith",
        condition: () => this.stats.totalWords >= 1000,
        title: "Wordsmith",
        description: "Wrote 1,000 words",
        icon: "✍️",
        xpReward: 75,
      },
      {
        id: "week_streak",
        condition: () => this.stats.streak >= 7,
        title: "Week Warrior",
        description: "Maintained a 7-day streak",
        icon: "🔥",
        xpReward: 100,
      },
    ]

    achievements.forEach((achievement) => {
      if (achievement.condition()) {
        this.unlockAchievement({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          unlockedAt: new Date().toISOString(),
          xpReward: achievement.xpReward,
        })
      }
    })
  }
}

export const gamification = GamificationSystem.getInstance()
export type { UserStats, Achievement, Activity }
