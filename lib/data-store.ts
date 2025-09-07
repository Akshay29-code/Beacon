interface Organization {
  id: string
  name: string
  createdAt: string
}

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  wordCount: number
  organizationId: string
}

interface Workspace {
  id: string
  name: string
  organizationId: string
  createdAt: string
}

interface UserData {
  currentOrganization: Organization | null
  workspaces: Workspace[]
  notes: Note[]
  recentlyVisited: Array<{
    id: string
    title: string
    type: "note" | "workspace"
    visitedAt: string
    href: string
  }>
}

class DataStore {
  private storageKey = "notion-clone-data"

  private getDefaultData(): UserData {
    return {
      currentOrganization: null,
      workspaces: [],
      notes: [],
      recentlyVisited: [],
    }
  }

  getData(): UserData {
    if (typeof window === "undefined") return this.getDefaultData()

    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : this.getDefaultData()
    } catch {
      return this.getDefaultData()
    }
  }

  saveData(data: UserData): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save data:", error)
    }
  }

  createOrganization(name: string): Organization {
    const org: Organization = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    }

    const data = this.getData()
    data.currentOrganization = org

    // Create default workspace
    const defaultWorkspace: Workspace = {
      id: Date.now().toString() + "_workspace",
      name: "General",
      organizationId: org.id,
      createdAt: new Date().toISOString(),
    }
    data.workspaces = [defaultWorkspace]

    this.saveData(data)
    return org
  }

  createNote(title: string, content = "", category = "Personal"): Note {
    const data = this.getData()
    if (!data.currentOrganization) throw new Error("No organization found")

    const note: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      wordCount: content.split(/\s+/).filter((word) => word.length > 0).length,
      organizationId: data.currentOrganization.id,
    }

    data.notes.unshift(note)
    this.addToRecentlyVisited({
      id: note.id,
      title: note.title,
      type: "note",
      visitedAt: new Date().toISOString(),
      href: `/editor?id=${note.id}`,
    })

    this.saveData(data)
    return note
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const data = this.getData()
    const noteIndex = data.notes.findIndex((note) => note.id === id)

    if (noteIndex === -1) return null

    data.notes[noteIndex] = {
      ...data.notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.saveData(data)
    return data.notes[noteIndex]
  }

  deleteNote(id: string): boolean {
    const data = this.getData()
    const initialLength = data.notes.length
    data.notes = data.notes.filter((note) => note.id !== id)
    data.recentlyVisited = data.recentlyVisited.filter((item) => item.id !== id)

    this.saveData(data)
    return data.notes.length < initialLength
  }

  addToRecentlyVisited(item: UserData["recentlyVisited"][0]): void {
    const data = this.getData()

    // Remove existing entry if it exists
    data.recentlyVisited = data.recentlyVisited.filter((existing) => existing.id !== item.id)

    // Add to beginning
    data.recentlyVisited.unshift(item)

    // Keep only last 10 items
    data.recentlyVisited = data.recentlyVisited.slice(0, 10)

    this.saveData(data)
  }

  getRecentNotes(limit = 5): Note[] {
    const data = this.getData()
    return data.notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, limit)
  }
}

export const dataStore = new DataStore()
export type { Organization, Note, Workspace, UserData }
