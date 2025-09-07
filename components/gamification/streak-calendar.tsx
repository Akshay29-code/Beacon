"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Flame } from "lucide-react"

interface StreakCalendarProps {
  streakDays: boolean[]
  currentStreak: number
  longestStreak: number
}

export function StreakCalendar({ streakDays, currentStreak, longestStreak }: StreakCalendarProps) {
  const days = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Streak Calendar
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Flame className="h-3 w-3 mr-1" />
            {currentStreak} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center">
            {days.map((day, index) => (
              <div key={index} className="text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
            {streakDays.map((hasActivity, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                  hasActivity ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-muted-foreground">Longest streak:</span>
            <span className="font-medium text-foreground">{longestStreak} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
