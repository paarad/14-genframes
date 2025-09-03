import Link from 'next/link'
import { getUserWithUsage } from '@/lib/user'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const userWithUsage = await getUserWithUsage()
  
  // Demo mode - return mock projects instead of database query
  const projects = [
    {
      id: 'demo-project-1',
      title: 'Sample Action Scene',
      description: 'A thrilling car chase through downtown',
      style: 'realistic',
      shots: [
        {
          id: 'shot-1',
          frames: [{ id: 'frame-1' }, { id: 'frame-2' }]
        },
        {
          id: 'shot-2', 
          frames: [{ id: 'frame-3' }]
        }
      ],
      updatedAt: new Date()
    }
  ]

  const usagePercentage = {
    frames: (userWithUsage.framesUsedMonth / userWithUsage.limits.frames) * 100,
    shots: (userWithUsage.shotsUsedMonth / userWithUsage.limits.shots) * 100,
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userWithUsage.firstName || 'Creator'}!
          </h1>
          <p className="text-gray-600">
            Create storyboards from your scripts with AI-powered generation
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Plan</h3>
              {userWithUsage.plan === 'FREE' && (
                <Link href="/pricing" className="text-blue-600 text-sm hover:text-blue-700">
                  Upgrade
                </Link>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userWithUsage.plan}
            </div>
            <p className="text-gray-600 text-sm">
              {userWithUsage.plan === 'FREE' ? 'Free tier' : '€9/month'}
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Shots Used</h3>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userWithUsage.shotsUsedMonth} / {userWithUsage.limits.shots === Infinity ? '∞' : userWithUsage.limits.shots}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(usagePercentage.shots, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Frames Used</h3>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userWithUsage.framesUsedMonth} / {userWithUsage.limits.frames === Infinity ? '∞' : userWithUsage.limits.frames}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min(usagePercentage.frames, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
          <Link 
            href="/app/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first storyboard from a script or try our demo
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/app/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Project
              </Link>
              <Link 
                href="/app/demo"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                key={project.id}
                href={`/app/${project.id}`}
                className="bg-white rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{project.shots.length} shots</span>
                    <span>
                      {project.shots.reduce((acc, shot) => acc + shot.frames.length, 0)} frames
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.style}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 