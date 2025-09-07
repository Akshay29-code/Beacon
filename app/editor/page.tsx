"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Link,
  Save,
  ArrowLeft,
  MoreHorizontal,
  Plus,
  Hash,
  Type,
  Undo,
  Redo,
  Wand2,
  Download,
  Upload,
  Minus,
  Plus as PlusIcon,
  Paintbrush,
  Palette,
  CheckSquare,
  Indent,
  Outdent,
  Smile,
  Table,
  Video,
  Music,
  FileText,
  MessageSquare,
  Edit,
  ChevronDown,
  Sparkles,
  Loader2,
} from "lucide-react"
import { useGamification } from "@/components/gamification-provider"
import { useRouter, useSearchParams } from "next/navigation"
import { account } from "../appwrite"
import { notesService, type Note } from "@/lib/notes-service"

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const noteId = searchParams.get('id')
  const editorRef = useRef<HTMLDivElement>(null)
  
  const [title, setTitle] = useState("Untitled Note")
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(true)
  const [lastSaved, setLastSaved] = useState("Just now")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [fontSize, setFontSize] = useState(16)
  const [textColor, setTextColor] = useState("#000000")
  const [highlightColor, setHighlightColor] = useState("#ffff00")
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [summary, setSummary] = useState("")
  const { onNoteCreated, onNoteEdited } = useGamification()

  useEffect(() => {
    const loadNote = async () => {
      if (noteId) {
        try {
          const note = await notesService.getNote(noteId)
          if (note) {
            setCurrentNote(note)
            setTitle(note.title)
            setContent(note.content)
            if (editorRef.current) {
              editorRef.current.innerHTML = note.content
            }
          } else {
            router.push('/beacon')
          }
        } catch (error) {
          console.error('Error loading note:', error)
          router.push('/beacon')
        }
      }
      setIsLoading(false)
    }

    loadNote()
  }, [noteId, router])

  const handleSave = async () => {
    if (isSaving) return
    
    setIsSaving(true)
    try {
      const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
      
      if (currentNote) {
        await notesService.updateNote(currentNote.id, {
          title,
          content,
        })
        onNoteEdited(wordCount)
      }
      
      setLastSaved("Just now")
    } catch (error) {
      console.error('Error saving note:', error)
      setLastSaved("Error saving")
    } finally {
      setIsSaving(false)
    }
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
    setContent(newContent)
    }
  }

  const handleAISummarize = async () => {
    if (!content || content.trim().length < 50) {
      alert("Please add more content to summarize (at least 50 characters)")
      return
    }

    setIsSummarizing(true)
    try {
      // Extract plain text from HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const plainText = tempDiv.textContent || tempDiv.innerText || ''
      
      // Call AI summarization API with Gemini
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: plainText,
          maxLength: 200, // Adjust summary length as needed
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setSummary(data.summary)
        setShowSummaryModal(true)
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        // Fallback: Simple extractive summarization
        const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10)
        const summaryText = sentences.slice(0, 3).join('. ') + '.'
        setSummary(summaryText)
        setShowSummaryModal(true)
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      // Fallback: Simple extractive summarization
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const plainText = tempDiv.textContent || tempDiv.innerText || ''
      const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 10)
      const summaryText = sentences.slice(0, 3).join('. ') + '.'
      setSummary(summaryText)
      setShowSummaryModal(true)
    } finally {
      setIsSummarizing(false)
    }
  }

  const insertSummary = () => {
    if (summary && editorRef.current) {
      const summaryElement = document.createElement('div')
      summaryElement.className = 'ai-summary'
      summaryElement.innerHTML = `
        <h3>📝 AI Summary</h3>
        <p>${summary}</p>
      `
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(summaryElement)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
    } else {
        editorRef.current.appendChild(summaryElement)
      }
      
      handleContentChange()
      setShowSummaryModal(false)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }

  const insertText = (text: string) => {
    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(document.createTextNode(text))
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      handleContentChange()
    }
  }

  const insertElement = (tag: string, content: string = '') => {
    if (editorRef.current) {
      const element = document.createElement(tag)
      element.innerHTML = content
      element.contentEditable = 'true'
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        range.insertNode(element)
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      handleContentChange()
    }
  }

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    active = false, 
    disabled = false,
    children,
    isLoading = false
  }: {
    onClick: () => void
    icon?: any
    title: string
    active?: boolean
    disabled?: boolean
    children?: React.ReactNode
    isLoading?: boolean
  }) => (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      className={`h-8 w-8 p-0 hover:bg-muted/50 ${isLoading ? 'ai-loading' : ''}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
    >
      {Icon ? <Icon className="h-4 w-4" /> : children}
    </Button>
  )

  const ToolbarDropdown = ({ 
    children, 
    trigger, 
    title 
  }: {
    children: React.ReactNode
    trigger: React.ReactNode
    title: string
  }) => (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 hover:bg-muted/50"
        title={title}
      >
        {trigger}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>
      <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {children}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading note...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:scale-110 transition-transform"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-semibold border-none bg-transparent p-0 h-auto text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  placeholder="Untitled"
                />
                <Badge variant="secondary" className="text-xs animate-pulse">
                  Draft
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Saved {lastSaved}</span>
              <span className="text-xs text-muted-foreground">
                {content.split(/\s+/).filter((word) => word.length > 0).length} words
              </span>
              <Button 
                onClick={handleSave} 
                size="sm" 
                className="hover:scale-105 transition-transform"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Rich Text Toolbar */}
      <div className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-[73px] z-40 editor-toolbar">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Undo/Redo and Magic */}
            <ToolbarButton onClick={() => execCommand('undo')} icon={Undo} title="Undo" />
            <ToolbarButton onClick={() => execCommand('redo')} icon={Redo} title="Redo" />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <ToolbarButton 
              onClick={handleAISummarize} 
              icon={isSummarizing ? Loader2 : Sparkles} 
              title="AI Summarize" 
              disabled={isSummarizing}
              isLoading={isSummarizing}
            />
            <ToolbarButton onClick={() => {}} icon={Wand2} title="AI Assistant" />

            {/* Insert/Upload */}
            <ToolbarDropdown
              trigger={<Download className="h-4 w-4" />}
              title="Insert"
            >
              <div className="p-2 space-y-1 min-w-48">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                  </Button>
              </div>
            </ToolbarDropdown>

            <ToolbarDropdown
              trigger={<Upload className="h-4 w-4" />}
              title="Upload"
            >
              <div className="p-2 space-y-1 min-w-48">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
            </div>
            </ToolbarDropdown>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Text Style */}
            <ToolbarDropdown
              trigger={<span className="text-sm">Text</span>}
              title="Text Style"
            >
              <div className="p-2 space-y-1 min-w-48">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertElement('h1', 'Heading 1')}>
                  <Hash className="h-4 w-4 mr-2" />
                  Heading 1
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertElement('h2', 'Heading 2')}>
                  <Hash className="h-4 w-4 mr-2" />
                  Heading 2
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertElement('h3', 'Heading 3')}>
                  <Hash className="h-4 w-4 mr-2" />
                  Heading 3
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => insertElement('p', 'Paragraph')}>
                  <Type className="h-4 w-4 mr-2" />
                  Paragraph
                  </Button>
              </div>
            </ToolbarDropdown>

            {/* Font Size */}
            <div className="flex items-center gap-1">
              <ToolbarButton onClick={() => setFontSize(Math.max(8, fontSize - 1))} icon={Minus} title="Decrease Font Size" />
              <span className="text-sm px-2 py-1 bg-muted rounded text-center min-w-8">{fontSize}</span>
              <ToolbarButton onClick={() => setFontSize(Math.min(72, fontSize + 1))} icon={PlusIcon} title="Increase Font Size" />
            </div>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Text Formatting */}
            <ToolbarButton onClick={() => execCommand('bold')} icon={Bold} title="Bold" />
            <ToolbarButton onClick={() => execCommand('italic')} icon={Italic} title="Italic" />
            <ToolbarButton onClick={() => execCommand('underline')} icon={Underline} title="Underline" />
            <ToolbarButton onClick={() => execCommand('strikeThrough')} icon={Strikethrough} title="Strikethrough" />
            <ToolbarButton onClick={() => execCommand('insertCode')} icon={Code} title="Code" />
            
            {/* Text Color */}
            <ToolbarDropdown
              trigger={<Palette className="h-4 w-4" />}
              title="Text Color"
            >
              <div className="p-2 space-y-2 min-w-48">
                <div className="grid grid-cols-6 gap-1">
                  {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#800000', '#008000', '#000080', '#808080', '#ffffff'].map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => execCommand('foreColor', color)}
                    />
                    ))}
                  </div>
              </div>
            </ToolbarDropdown>

            {/* Highlight Color */}
            <ToolbarDropdown
              trigger={<Paintbrush className="h-4 w-4" />}
              title="Highlight Color"
            >
              <div className="p-2 space-y-2 min-w-48">
                <div className="grid grid-cols-6 gap-1">
                  {['#ffff00', '#ffcccc', '#ccffcc', '#ccccff', '#ffccff', '#ccffff', '#ffffff', '#ff9999', '#99ff99', '#9999ff', '#ff99ff', '#99ffff'].map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => execCommand('backColor', color)}
                    />
                  ))}
                </div>
            </div>
            </ToolbarDropdown>

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Alignment */}
            <ToolbarDropdown
              trigger={<AlignLeft className="h-4 w-4" />}
              title="Text Alignment"
            >
              <div className="p-2 space-y-1 min-w-48">
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => execCommand('justifyLeft')}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  Align Left
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => execCommand('justifyCenter')}>
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Align Center
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => execCommand('justifyRight')}>
                  <AlignRight className="h-4 w-4 mr-2" />
                  Align Right
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => execCommand('justifyFull')}>
                  <AlignJustify className="h-4 w-4 mr-2" />
                  Justify
              </Button>
              </div>
            </ToolbarDropdown>

            {/* Lists */}
            <ToolbarButton onClick={() => execCommand('insertUnorderedList')} icon={List} title="Bullet List" />
            <ToolbarButton onClick={() => execCommand('insertOrderedList')} icon={ListOrdered} title="Numbered List" />
            <ToolbarButton onClick={() => insertElement('div', '☐ Task Item')} icon={CheckSquare} title="Checklist" />
            <ToolbarButton onClick={() => execCommand('indent')} icon={Indent} title="Indent" />
            <ToolbarButton onClick={() => execCommand('outdent')} icon={Outdent} title="Outdent" />

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Insert Elements */}
            <ToolbarButton onClick={() => execCommand('createLink')} icon={Link} title="Insert Link" />
            <ToolbarButton onClick={() => insertElement('table')} icon={Table} title="Insert Table" />
            <ToolbarButton onClick={() => insertElement('blockquote', 'Quote text')} icon={Quote} title="Insert Quote" />
            <ToolbarButton onClick={() => insertElement('img')} icon={ImageIcon} title="Insert Image" />
            <ToolbarButton onClick={() => insertElement('video')} icon={Video} title="Insert Video" />
            <ToolbarButton onClick={() => insertElement('audio')} icon={Music} title="Insert Audio" />

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* More Options */}
            <ToolbarButton onClick={() => {}} icon={MoreHorizontal} title="More Options" />

            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Comments and Editing Mode */}
            <ToolbarButton onClick={() => {}} icon={MessageSquare} title="Add Comment" />
            <ToolbarButton onClick={() => {}} icon={Edit} title="Edit Mode" />
            <ToolbarDropdown
              trigger={<span className="text-sm">Editing</span>}
              title="Editing Mode"
            >
              <div className="p-2 space-y-1 min-w-48">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Editing
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Suggesting
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Viewing
                </Button>
              </div>
            </ToolbarDropdown>
              </div>
            </div>
          </div>

      {/* Editor Content */}
      <div className="container mx-auto px-6 py-8">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[600px] p-8 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 editor-content"
          style={{ fontSize: `${fontSize}px` }}
          onInput={handleContentChange}
          onBlur={handleContentChange}
          suppressContentEditableWarning={true}
          data-placeholder="Start writing your note..."
        />
      </div>

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-card border border-border shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">AI Summary</h2>
                  <p className="text-sm text-muted-foreground">Powered by Google Gemini AI</p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
                <p className="text-foreground leading-relaxed">{summary}</p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSummaryModal(false)}
                  className="hover:scale-105 transition-transform"
                >
                  Close
                </Button>
                <Button 
                  onClick={insertSummary}
                  className="bg-gradient-to-r from-[#8580f9] to-[#6351df] hover:from-[#6351df] hover:to-[#8580f9] hover:scale-105 transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Insert Summary
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}