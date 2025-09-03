import { getUserWithUsage } from '@/lib/user'
import Link from 'next/link'

export default async function AccountPage() {
  const userWithUsage = await getUserWithUsage()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        <div className="grid gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="text-gray-900">
                  {userWithUsage.firstName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="text-gray-900">
                  {userWithUsage.lastName || 'Not set'}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-gray-900">
                  {userWithUsage.email}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription & Billing */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription & Billing</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Current Plan</div>
                  <div className="text-sm text-gray-600">
                    {userWithUsage.plan === 'FREE' ? 'Free tier - Limited usage' : 'Pro - €9/month'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    userWithUsage.plan === 'FREE' 
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {userWithUsage.plan}
                  </span>
                  {userWithUsage.plan === 'FREE' ? (
                    <Link 
                      href="/pricing"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Upgrade to Pro
                    </Link>
                  ) : (
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                      Manage Billing
                    </button>
                  )}
                </div>
              </div>

              {userWithUsage.plan !== 'FREE' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Next billing period starts: {new Date(userWithUsage.periodStartAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage This Month</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Shots</span>
                  <span className="text-sm text-gray-600">
                    {userWithUsage.shotsUsedMonth} / {userWithUsage.limits.shots === Infinity ? '∞' : userWithUsage.limits.shots}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((userWithUsage.shotsUsedMonth / userWithUsage.limits.shots) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Frames</span>
                  <span className="text-sm text-gray-600">
                    {userWithUsage.framesUsedMonth} / {userWithUsage.limits.frames === Infinity ? '∞' : userWithUsage.limits.frames}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((userWithUsage.framesUsedMonth / userWithUsage.limits.frames) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Usage resets on: {new Date(userWithUsage.periodStartAt).toLocaleDateString()}
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Plan Features</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  {userWithUsage.limits.projects === Infinity ? 'Unlimited' : userWithUsage.limits.projects} projects
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  {userWithUsage.limits.shots === Infinity ? 'Unlimited' : userWithUsage.limits.shots} shots per month
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  {userWithUsage.limits.frames === Infinity ? 'Unlimited' : userWithUsage.limits.frames} frames per month
                </span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">
                  {userWithUsage.limits.hiRes ? 'Hi-res' : 'Low-res'} export
                </span>
              </div>
              {userWithUsage.plan !== 'FREE' && (
                <>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Seed lock for reproducible frames</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Watermark toggle</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 