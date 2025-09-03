import { NextResponse } from 'next/server'

// Simple middleware for demo mode - no auth required
export function middleware() {
  // Allow all requests to pass through in demo mode
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
} 