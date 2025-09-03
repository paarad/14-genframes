import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Link from 'next/link'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GenFrames - From Script to Storyboard in Minutes",
  description: "AI-powered storyboard generation from scripts",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
                      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dummy_key_for_demo"

  const content = (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <nav className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              GenFrames
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                🎬 Create
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                MVP Demo
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )

  return hasClerkKeys ? (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  ) : content
}
