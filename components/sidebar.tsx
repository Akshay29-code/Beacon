"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Home, Inbox, BookOpen, Target, Settings, Archive, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useGamification } from "@/components/gamification-provider"
import { dataStore } from "@/lib/data-store"

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [organizationName, setOrganizationName] = useState("BEACON")
  const [unreadCount, setUnreadCount] = useState(0)
  const { stats } = useGamification()

  useEffect(() => {
    const data = dataStore.getData()
    if (data.currentOrganization) {
      setOrganizationName(data.currentOrganization.name)
    }

    setUnreadCount(data.recentlyVisited.length)
  }, [])

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="font-semibold text-sidebar-foreground truncate">{organizationName}</span>
          <Button variant="ghost" size="icon" className="h-5 w-5 ml-auto">
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3 px-2 py-1 bg-sidebar-accent/30 rounded-md">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{stats.level}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-sidebar-foreground font-medium">
              Level {stats.level} • {stats.streak} day streak
            </div>
            <div className="w-full bg-sidebar-accent rounded-full h-1">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {stats.xp}/{stats.xpToNextLevel}
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-sidebar-accent/50 border-sidebar-border text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="space-y-1 mb-4">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent">
                <Home className="h-4 w-4 mr-3" />
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent relative"
            >
              <Inbox className="h-4 w-4 mr-3" />
              Inbox
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-auto h-5 w-5 text-xs p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>

          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Private</div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent">
                <BookOpen className="h-4 w-4 mr-3" />
                Getting Started
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Teamspaces</div>
            <div className="space-y-1">
              <Link href="/notes">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent"
                >
                  <div className="w-4 h-4 mr-3 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <Target className="h-2.5 w-2.5 text-white" />
                  </div>
                  Hackathon
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 border-t border-sidebar-border">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent">
            <Settings className="h-4 w-4 mr-3" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start h-8 text-sm font-normal hover:bg-sidebar-accent">
            <Archive className="h-4 w-4 mr-3" />
            Trash
          </Button>
        </div>
      </div>
    </div>
  )
}
