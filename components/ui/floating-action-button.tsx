"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface FloatingActionButtonProps {
  href?: string
  onClick?: () => void
  className?: string
}

export function FloatingActionButton({ href, onClick, className }: FloatingActionButtonProps) {
  const buttonContent = (
    <Button
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "animate-in slide-in-from-bottom-4 fade-in duration-500",
        className,
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </Button>
  )

  if (href) {
    return <Link href={href}>{buttonContent}</Link>
  }

  return buttonContent
}
