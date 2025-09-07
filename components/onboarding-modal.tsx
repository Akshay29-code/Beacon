"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Sparkles } from "lucide-react"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (organizationName: string) => void
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onComplete(orgName.trim())
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold">Welcome to BEACON</DialogTitle>
          <p className="text-muted-foreground">Let's get you started by creating your organization</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              placeholder="e.g., Team Trigen, Hackathon Project"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="transition-all duration-300 focus:scale-105"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full hover:scale-105 transition-transform"
            disabled={!orgName.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Organization
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground mt-4">You can change this later in settings</div>
      </DialogContent>
    </Dialog>
  )
}
