import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getOrCreateUser() {
  // Demo mode - return a mock user for development
  const demoUser = {
    id: 'demo-user-id',
    clerkId: 'demo-clerk-id',
    email: 'demo@genframes.io',
    firstName: 'Demo',
    lastName: 'User',
    plan: 'FREE' as const,
    framesUsedMonth: 5,
    shotsUsedMonth: 3,
    periodStartAt: new Date(),
    subscriptionId: null,
    customerId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return demoUser
}

export async function getUserWithUsage() {
  const user = await getOrCreateUser()
  
  return {
    ...user,
    limits: {
      projects: user.plan === 'FREE' ? 1 : Infinity,
      shots: user.plan === 'FREE' ? 10 : 300,
      frames: user.plan === 'FREE' ? 20 : 300,
      hiRes: user.plan !== 'FREE'
    }
  }
} 