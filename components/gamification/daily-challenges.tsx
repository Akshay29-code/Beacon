"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Target, Clock, Zap } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  progress: number
  target: number
  xpReward: number
  completed: boolean
  timeLeft?: string
}

interface DailyChallengesProps {
  challenges: Challenge[]
  onClaimReward: (challengeId: string) => void
}

export function DailyChallenges({ challenges, onClaimReward }: DailyChallengesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Daily Challenges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-colors ${
                challenge.completed ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {challenge.completed ? (
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-medium ${challenge.completed ? "text-primary" : "text-foreground"}`}>
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                    <Zap className="h-3 w-3 mr-1" />
                    {challenge.xpReward} XP
                  </Badge>
                  {challenge.timeLeft && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {challenge.timeLeft}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
              </div>

              {challenge.completed && (
                <Button size="sm" className="mt-3 w-full" onClick={() => onClaimReward(challenge.id)}>
                  Claim Reward
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
