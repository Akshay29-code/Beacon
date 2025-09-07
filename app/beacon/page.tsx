"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Users, FileText, Clock, BookOpen, LogOut, Trash2, Edit } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { useGamification } from "@/components/gamification-provider"
import { OnboardingModal } from "@/components/onboarding-modal"
import { dataStore } from "@/lib/data-store"
import { account } from "../appwrite"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { notesService, type Note } from "@/lib/notes-service"

export default function HomePage() {
  const router = useRouter()
  const [greeting, setGreeting] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const { stats } = useGamification()

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)

        const hour = new Date().getHours()
        const firstName = currentUser.name.split(' ')[0]
        if (hour < 12) {
          setGreeting(`Good morning, ${firstName}`)
        } else if (hour < 18) {
          setGreeting(`Good afternoon, ${firstName}`)
        } else {
          setGreeting(`Good evening, ${firstName}`)
        }

        await loadUserNotes(currentUser.$id)

        const data = dataStore.getData()
        if (!data.currentOrganization) {
          setShowOnboarding(true)
        }
      } catch (error) {
        console.error("Authentication check failed:", error)
        router.push('/auth/login')
        return
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const loadUserNotes = async (userId: string) => {
    setNotesLoading(true)
    try {
      const userNotes = await notesService.getUserNotes(userId)
      setNotes(userNotes)
    } catch (error) {
      console.error('Error loading notes:', error)
      setNotes([])
    } finally {
      setNotesLoading(false)
    }
  }

  const handleOnboardingComplete = (organizationName: string) => {
    dataStore.createOrganization(organizationName)
    setShowOnboarding(false)
  }

  const handleCreateNote = async () => {
    if (!user) return
    
    try {
      const newNote = await notesService.createNote({
        title: "Untitled Note",
        content: "",
        category: "Personal"
      }, user.$id)
      
      await loadUserNotes(user.$id)
      
      router.push(`/editor?id=${newNote.id}`)
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return
    
    try {
      await notesService.deleteNote(noteId)
      // Refresh notes list
      await loadUserNotes(user.$id)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const handleEditNote = (noteId: string) => {
    router.push(`/editor?id=${noteId}`)
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
      router.push('/auth/login')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingModal isOpen={showOnboarding} onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

=      <div className="flex-1 overflow-y-auto">
        <main className="max-w-4xl mx-auto p-8">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-3xl font-semibold text-foreground">{greeting}</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground border-border/50 hover:border-border"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="mb-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{notes.length}</p>
                      <p className="text-sm text-muted-foreground">Notes created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <span className="text-green-500 font-bold">✍️</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {notes.reduce((total, note) => total + note.wordCount, 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Words written</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-border transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <span className="text-orange-500 font-bold">🔥</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.streak}</p>
                      <p className="text-sm text-muted-foreground">Day streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Your Notes</span>
              </div>
              <Button
                onClick={handleCreateNote}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </div>

            {notesLoading ? (
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-32 animate-pulse">
                    <CardContent className="p-4 h-full flex flex-col justify-center">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : notes.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {notes.slice(0, 4).map((note) => (
                  <Card key={note.id} className="h-32 hover:bg-muted/50 transition-colors cursor-pointer border-border/50 group">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">{note.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditNote(note.id)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNote(note.id)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {notes.length < 4 && (
                  <Card 
                    className="h-32 hover:bg-muted/50 transition-colors cursor-pointer border-border/50 border-dashed"
                    onClick={handleCreateNote}
                  >
                    <CardContent className="p-4 h-full flex flex-col justify-center items-center text-center">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium text-sm text-foreground">New Note</h3>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="max-w-md">
                <Card className="h-32 hover:bg-muted/50 transition-colors cursor-pointer border-border/50 border-dashed" onClick={handleCreateNote}>
                  <CardContent className="p-4 h-full flex flex-col justify-center items-center text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-sm text-foreground">Create your first note</h3>
                    <p className="text-xs text-muted-foreground mt-1">Click to get started</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Learn</span>
            </div>

            <div className="max-w-sm">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-border/50 overflow-hidden">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm text-foreground mb-2">Getting Started Guide</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>5m read</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
