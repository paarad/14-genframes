import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function getOrCreateUser() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('User not authenticated')
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        plan: 'FREE'
      }
    })
  }

  return user
}

export async function getUserWithUsage() {
  const user = await getOrCreateUser()
  
  return {
    ...user,
    limits: {
      projects: user.plan === 'FREE' ? 1 : Infinity,
      shots: user.plan === 'FREE' ? 10 : 300,
      frames: user.plan === 'FREE' ? 20 : 300,
      hiRes: user.plan === 'PRO'
    }
  }
} 