import Link from 'next/link'

export default function NewProjectPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link href="/app" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600">
            Start by giving your storyboard project a name and description
          </p>
        </div>

        <div className="bg-white rounded-lg border p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Action Scene - Car Chase"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Brief description of your project..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                Visual Style
              </label>
              <select
                id="style"
                name="style"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="realistic">Realistic</option>
                <option value="pencil">Pencil Sketch</option>
                <option value="noir">Film Noir</option>
                <option value="anime">Anime Style</option>
                <option value="meme">Meme Style</option>
              </select>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Start Options</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900 mb-2">📝 Paste Script</div>
                  <div className="text-sm text-gray-600">
                    Paste your scene script and let AI parse it into shots
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900 mb-2">🚀 Start Blank</div>
                  <div className="text-sm text-gray-600">
                    Create shots manually and build your storyboard from scratch
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Link
                href="/app"
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-blue-600 mr-3 mt-0.5">💡</div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Demo Mode Active</div>
              <div className="text-blue-700 text-sm">
                This is a preview version. Projects won&apos;t be saved permanently. 
                Sign up for a free account to save your work!
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 