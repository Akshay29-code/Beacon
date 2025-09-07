"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star, Zap } from "lucide-react"

interface LevelSystemProps {
  currentXP: number
  currentLevel: number
  xpToNextLevel: number
  totalXPForNextLevel: number
}

export function LevelSystem({ currentXP, currentLevel, xpToNextLevel, totalXPForNextLevel }: LevelSystemProps) {
  const progressPercentage = ((totalXPForNextLevel - xpToNextLevel) / totalXPForNextLevel) * 100

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Level {currentLevel}</h3>
              <p className="text-sm text-muted-foreground">Note Crafter</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            {currentXP} XP
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
            <span className="font-medium text-foreground">{xpToNextLevel} XP to go</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </CardContent>
    </Card>
  )
}
