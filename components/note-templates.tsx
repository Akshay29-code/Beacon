"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Target, BookOpen, Lightbulb, Users } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: string
  content: string
}

interface NoteTemplatesProps {
  onSelectTemplate: (template: Template) => void
}

export function NoteTemplates({ onSelectTemplate }: NoteTemplatesProps) {
  const templates: Template[] = [
    {
      id: "daily-journal",
      name: "Daily Journal",
      description: "Reflect on your day with guided prompts",
      icon: Calendar,
      category: "Personal",
      content: `# Daily Journal - ${new Date().toLocaleDateString()}

## How was your day?


## What did you accomplish?


## What are you grateful for?


## Tomorrow's priorities:
- 
- 
- 

## Reflection:

`,
    },
    {
      id: "meeting-notes",
      name: "Meeting Notes",
      description: "Structured template for meeting documentation",
      icon: Users,
      category: "Work",
      content: `# Meeting Notes

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** 
**Duration:** 

## Agenda
- 

## Discussion Points


## Action Items
- [ ] 
- [ ] 
- [ ] 

## Next Steps


## Follow-up Required

`,
    },
    {
      id: "project-planning",
      name: "Project Planning",
      description: "Plan and organize your projects effectively",
      icon: Target,
      category: "Work",
      content: `# Project Planning

## Project Overview
**Name:** 
**Goal:** 
**Deadline:** 

## Objectives
- 
- 
- 

## Key Milestones
1. 
2. 
3. 

## Resources Needed


## Potential Challenges


## Success Metrics

`,
    },
    {
      id: "book-notes",
      name: "Book Notes",
      description: "Capture insights and key takeaways from books",
      icon: BookOpen,
      category: "Learning",
      content: `# Book Notes

**Title:** 
**Author:** 
**Date Started:** 
**Date Finished:** 

## Key Takeaways
- 
- 
- 

## Favorite Quotes


## Personal Reflections


## Action Items
- [ ] 
- [ ] 

## Rating: ⭐⭐⭐⭐⭐

`,
    },
    {
      id: "idea-capture",
      name: "Idea Capture",
      description: "Quick template for capturing and developing ideas",
      icon: Lightbulb,
      category: "Creative",
      content: `# Idea: 

## The Concept


## Why This Matters


## Potential Applications
- 
- 
- 

## Next Steps
- [ ] 
- [ ] 

## Resources/Research Needed


## Related Ideas

`,
    },
    {
      id: "blank",
      name: "Blank Note",
      description: "Start with a clean slate",
      icon: FileText,
      category: "General",
      content: `# 

`,
    },
  ]

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Choose a Template</h2>
        <p className="text-muted-foreground">Start with a structured template or create a blank note</p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates
              .filter((template) => template.category === category)
              .map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <Button
                      className="w-full bg-transparent"
                      variant="outline"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
