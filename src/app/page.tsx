import Link from 'next/link'
// Removed unused Clerk imports for demo mode

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            From Script to{' '}
            <span className="text-blue-600">Storyboard</span>{' '}
            in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Transform your scenes into visual storyboards with AI. 
            Parse scripts, generate frames, and export professional boards instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/create" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block">
              🎬 Create Storyboard Now
            </Link>
            <Link href="/app" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              📊 View Dashboard
            </Link>
          </div>

          {/* Demo Visual */}
          <div className="bg-white rounded-xl shadow-xl border p-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Frame 1</span>
              </div>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Frame 2</span>
              </div>
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Frame 3</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-4">Sample storyboard generated from script</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Parsing</h3>
              <p className="text-gray-600">AI understands your script and breaks it into shots with camera angles and actions.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Styles</h3>
              <p className="text-gray-600">Generate frames in pencil, noir, anime, realistic, or meme styles.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro Export</h3>
              <p className="text-gray-600">Export as PDF boards or horizontal strips. Watermark-free for Pro users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start free, upgrade when ready</h2>
          <p className="text-gray-600 mb-8">Get 1 project, 10 shots, and 20 frames to start. Need more?</p>
          <Link href="/pricing" className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  )
}
