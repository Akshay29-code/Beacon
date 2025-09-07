import type React from "react"
import type { Metadata } from "next"
import { GeistSans, GeistMono } from "geist/font"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GamificationProvider } from "@/components/gamification-provider"

// Load custom fonts
const blankRiver = localFont({
  src: "../public/font/Blank River.ttf",
  variable: "--font-blank-river",
  display: "swap",
})

const barcelonaGraffiti = localFont({
  src: "../public/font/BarcelonaGraffitiBombing.otf",
  variable: "--font-barcelona-graffiti",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Beacon",
  other: {
    // Preload fonts for better performance
    'preload-font-blank-river': '/font/Blank River.ttf',
    'preload-font-barcelona': '/font/BarcelonaGraffitiBombing.otf',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${blankRiver.variable} ${barcelonaGraffiti.variable} dark`} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/font/Blank River.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/BarcelonaGraffitiBombing.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <GamificationProvider>{children}</GamificationProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
