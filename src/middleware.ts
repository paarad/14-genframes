import { clerkMiddleware } from '@clerk/nextjs/server'

// Temporarily disable auth protection for development
export default clerkMiddleware()

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
} 