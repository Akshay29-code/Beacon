"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, X, Zap } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  xpReward: number
  icon?: string
}

interface AchievementToastProps {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  if (!achievement) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-80 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Achievement Unlocked!</h4>
                <p className="text-sm text-primary font-medium">{achievement.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onDismiss, 300)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-accent">
              <Zap className="h-4 w-4" />
              <span className="font-medium">+{achievement.xpReward} XP</span>
            </div>
            <div className="text-xs text-muted-foreground">Tap to dismiss</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
