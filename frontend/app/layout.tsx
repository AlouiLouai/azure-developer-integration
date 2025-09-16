import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Noto_Sans } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
})

export const metadata: Metadata = {
  title: "Connect - Team Messaging App",
  description:
    "Connect is a modern messaging app that brings your team together. Simple, beautiful, and available on all your devices.",
  generator: "Next.js 15",
  keywords: ["messaging", "team", "chat", "collaboration", "communication"],
  authors: [{ name: "Louai Aloui" }],
  creator: "Louai Aloui",
  openGraph: {
    title: "Connect - Team Messaging App",
    description: "Connect with your team, instantly. Modern messaging for modern teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Connect - Team Messaging App",
    description: "Connect with your team, instantly. Modern messaging for modern teams.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
