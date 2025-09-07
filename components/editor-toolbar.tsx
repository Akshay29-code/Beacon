"use client"

import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, List, ListOrdered, Quote, Code, Link, ImageIcon, Type, Hash } from "lucide-react"

interface ToolbarProps {
  onFormat: (format: string) => void
}

export function EditorToolbar({ onFormat }: ToolbarProps) {
  const formatButtons = [
    { icon: Bold, action: "bold", label: "Bold", shortcut: "⌘B" },
    { icon: Italic, action: "italic", label: "Italic", shortcut: "⌘I" },
    { icon: Underline, action: "underline", label: "Underline", shortcut: "⌘U" },
    { icon: Code, action: "code", label: "Inline Code", shortcut: "⌘E" },
    { icon: Link, action: "link", label: "Link", shortcut: "⌘K" },
  ]

  const blockButtons = [
    { icon: ImageIcon, action: "image", label: "Image" },
    { icon: Type, action: "paragraph", label: "Text" },
    { icon: Hash, action: "heading", label: "Heading" },
    { icon: List, action: "bulletList", label: "Bullet List" },
    { icon: ListOrdered, action: "orderedList", label: "Numbered List" },
    { icon: Quote, action: "blockquote", label: "Quote" },
    { icon: Code, action: "codeBlock", label: "Code Block" },
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-1 pr-2 border-r border-border">
        {formatButtons.map((button) => (
          <Button
            key={button.action}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onFormat(button.action)}
            title={`${button.label} (${button.shortcut})`}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1 pl-2">
        {blockButtons.slice(0, 4).map((button) => (
          <Button
            key={button.action}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onFormat(button.action)}
            title={button.label}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  )
}
