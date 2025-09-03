import Link from 'next/link'

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  // Mock project data for demo
  const project = {
    id: params.projectId,
    title: 'Sample Action Scene',
    description: 'A thrilling car chase through downtown',
    style: 'realistic'
  }

  const shots = [
    {
      id: 'shot-1',
      title: 'Opening Wide Shot',
      action: 'Establishing shot of downtown street with heavy traffic',
      camera: 'Wide shot',
      duration: '3 seconds',
      order: 1,
      frames: [
        {
          id: 'frame-1',
          imageUrl: '/placeholder-frame.jpg',
          prompt: 'Wide shot of downtown street with heavy traffic, realistic style'
        }
      ]
    },
    {
      id: 'shot-2', 
      title: 'Hero Car Reveal',
      action: 'Camera pans to reveal protagonist in sleek sports car',
      camera: 'Medium shot',
      duration: '2 seconds',
      order: 2,
      frames: []
    },
    {
      id: 'shot-3',
      title: 'Chase Begins',
      action: 'Car accelerates, tires screech, chase begins',
      camera: 'Close-up',
      duration: '1 second',
      order: 3,
      frames: []
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/app" className="text-blue-600 hover:text-blue-700 text-sm">
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Style: <span className="font-medium capitalize">{project.style}</span>
              </div>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Shot List - Left Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border h-full">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-semibold text-gray-900">Shots</h2>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    Add Shot
                  </button>
                </div>
                <p className="text-xs text-gray-600">{shots.length} shots total</p>
              </div>
              
              <div className="p-4 space-y-3 overflow-y-auto max-h-96">
                {shots.map((shot) => (
                  <div key={shot.id} className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">{shot.title}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {shot.frames.length} frames
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{shot.camera} • {shot.duration}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{shot.action}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Frames Canvas - Center Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border h-full">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">Storyboard Frames</h2>
                <p className="text-xs text-gray-600">Click on shots to view and generate frames</p>
              </div>
              
              <div className="p-6">
                {shots.find(s => s.frames.length > 0) ? (
                  <div className="grid grid-cols-2 gap-4">
                    {shots.filter(s => s.frames.length > 0).map((shot) => (
                      shot.frames.map((frame) => (
                        <div key={frame.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-100 aspect-video flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <div className="text-4xl mb-2">🎬</div>
                              <div className="text-sm">Frame Preview</div>
                              <div className="text-xs">({shot.title})</div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="text-xs text-gray-600 line-clamp-2">
                              {frame.prompt}
                            </div>
                          </div>
                        </div>
                      ))
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No frames generated yet</h3>
                    <p className="text-gray-600 mb-6">Select a shot from the left panel and click &quot;Generate Frame&quot; to create your first storyboard frame.</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Generate First Frame
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inspector - Right Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border h-full">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">Inspector</h2>
                <p className="text-xs text-gray-600">Edit shot details and generate frames</p>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shot Title
                  </label>
                  <input
                    type="text"
                    value="Opening Wide Shot"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camera Angle
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Wide shot</option>
                    <option>Medium shot</option>
                    <option>Close-up</option>
                    <option>Extreme close-up</option>
                    <option>Bird&apos;s eye view</option>
                    <option>Low angle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Description
                  </label>
                  <textarea
                    rows={3}
                    value="Establishing shot of downtown street with heavy traffic"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value="3 seconds"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mb-2">
                    Generate Frame
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
                    Re-roll Frame
                  </button>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="text-yellow-800 text-xs font-medium mb-1">Demo Mode</div>
                    <div className="text-yellow-700 text-xs">
                      Frame generation is simulated. Connect OpenAI API to generate real frames.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 