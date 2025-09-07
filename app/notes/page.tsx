"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  MoreHorizontal,
  Star,
  Trash2,
  Archive,
  Calendar,
  Tag,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { NotesGridSkeleton } from "@/components/loading-states"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { useGamification } from "@/components/gamification-provider"
import { notesService, type Note } from "@/lib/notes-service"
import { account } from "../appwrite"
import { useRouter } from "next/navigation"

export default function NotesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("updated")
  const [isLoading, setIsLoading] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [user, setUser] = useState<any>(null)
  const { onNoteCreated } = useGamification()

  useEffect(() => {
    const loadUserAndNotes = async () => {
      try {
        // Check if user is authenticated
        const currentUser = await account.get()
        setUser(currentUser)
        
        // Load user's notes
        await loadUserNotes(currentUser.$id)
      } catch (error) {
        console.error('Authentication check failed:', error)
        router.push('/auth/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndNotes()
  }, [router])

  const loadUserNotes = async (userId: string) => {
    try {
      const userNotes = await notesService.getUserNotes(userId)
      setNotes(userNotes)
    } catch (error) {
      console.error('Error loading notes:', error)
      setNotes([])
    }
  }

  const handleCreateNote = async () => {
    if (!user) return
    
    try {
      const newNote = await notesService.createNote({
        title: "Untitled Note",
        content: "",
        category: "Personal"
      }, user.$id)
      
      // Refresh notes list
      await loadUserNotes(user.$id)
      
      // Navigate to editor
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

  const handleToggleFavorite = async (noteId: string, isFavorite: boolean) => {
    if (!user) return
    
    try {
      await notesService.updateNote(noteId, { isFavorite: !isFavorite })
      // Refresh notes list
      await loadUserNotes(user.$id)
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  // Remove the dummy data array

  const categories = ["All", "Work", "Personal", "Learning"]
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title)
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "updated":
      default:
        return a.updatedAt.localeCompare(b.updatedAt)
    }
  })

  const toggleFavorite = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      handleToggleFavorite(noteId, note.isFavorite)
    }
  }

  const deleteNote = (noteId: string) => {
    handleDeleteNote(noteId)
  }

  return (
    <div className="min-h-screen bg-background">
      <FloatingActionButton href="/editor" onClick={handleCreateNote} />

      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">My Notes</h1>
              <Badge variant="secondary" className="animate-in fade-in duration-500">
                {filteredNotes.length} notes
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/editor">
                <Button className="hover:scale-105 transition-transform" onClick={handleCreateNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-300 focus:scale-105"
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:scale-105 transition-transform bg-transparent">
                  <Filter className="h-4 w-4" />
                  {selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 hover:scale-105 transition-transform bg-transparent">
                  <Calendar className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("updated")}>Last Updated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created")}>Date Created</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>Title A-Z</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none hover:scale-105 transition-transform"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none hover:scale-105 transition-transform"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6 animate-in slide-in-from-top-4 duration-500 delay-100">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2">Tags:</span>
              {allTags.slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300"
                  onClick={() => setSearchQuery(tag)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isLoading && <NotesGridSkeleton />}

        {!isLoading && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                {sortedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="animate-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <NoteCard note={note} onToggleFavorite={toggleFavorite} onDelete={deleteNote} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-500">
                {sortedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    className="animate-in slide-in-from-left-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <NoteListItem note={note} onToggleFavorite={toggleFavorite} onDelete={deleteNote} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!isLoading && filteredNotes.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Create your first note to get started"}
            </p>
            <Link href="/editor">
              <Button className="hover:scale-105 transition-transform" onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

function NoteCard({
  note,
  onToggleFavorite,
  onDelete,
}: {
  note: Note
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Link href={`/editor?id=${note.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-2 hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {note.title}
            </h3>
            <div className="flex items-center gap-1">
              {note.isFavorite && <Star className="h-4 w-4 text-accent fill-current animate-pulse" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      onToggleFavorite(note.id)
                    }}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      onDelete(note.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{note.content}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="group-hover:scale-105 transition-transform">
                {note.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{note.wordCount} words</span>
            </div>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs group-hover:scale-105 transition-transform">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs group-hover:scale-105 transition-transform">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground">Updated {note.updatedAt}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function NoteListItem({
  note,
  onToggleFavorite,
  onDelete,
}: {
  note: Note
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <Link href={`/editor?id=${note.id}`}>
      <Card className="hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {note.title}
                </h3>
                {note.isFavorite && <Star className="h-4 w-4 text-accent fill-current flex-shrink-0 animate-pulse" />}
                <Badge variant="secondary" className="flex-shrink-0 group-hover:scale-105 transition-transform">
                  {note.category}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-1 mb-2">{note.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Updated {note.updatedAt}</span>
                <span>{note.wordCount} words</span>
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs group-hover:scale-105 transition-transform">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    onToggleFavorite(note.id)
                  }}
                >
                  <Star className="h-4 w-4 mr-2" />
                  {note.isFavorite ? "Remove from favorites" : "Add to favorites"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete(note.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
