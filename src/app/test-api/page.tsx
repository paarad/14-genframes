'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestAPIPage() {
  const [script, setScript] = useState(`EXT. DOWNTOWN STREET - DAY

The busy street is filled with honking cars and pedestrians rushing to work. Steam rises from manholes, and the sounds of the city create a chaotic symphony.

Suddenly, a sleek black sports car ROARS through the traffic, weaving between vehicles with precision. The car's engine echoes off the tall buildings.

The driver, ALEX (30s), grips the steering wheel tightly, eyes focused on the rearview mirror. In the reflection, we see pursuing vehicles gaining ground.

Alex slams on the accelerator. The car leaps forward, tires screeching as it takes a sharp right turn into a narrow alley.`)

  const [shots, setShots] = useState([])
  const [isParsingScript, setIsParsingScript] = useState(false)
  const [parseError, setParseError] = useState('')
  
  const [selectedShot, setSelectedShot] = useState(null)
  const [isGeneratingFrame, setIsGeneratingFrame] = useState(false)
  const [generatedFrame, setGeneratedFrame] = useState(null)
  const [frameError, setFrameError] = useState('')

  const handleParseScript = async () => {
    setIsParsingScript(true)
    setParseError('')
    setShots([])
    
    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script,
          style: 'realistic'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShots(data.shots)
      } else {
        setParseError(data.error || 'Failed to parse script')
      }
    } catch (error) {
      setParseError('Network error: ' + error.message)
    } finally {
      setIsParsingScript(false)
    }
  }

  const handleGenerateFrame = async (shot) => {
    setIsGeneratingFrame(true)
    setFrameError('')
    setGeneratedFrame(null)
    setSelectedShot(shot)
    
    try {
      const response = await fetch('/api/frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shotDescription: shot.action,
          camera: shot.camera,
          style: 'realistic',
          title: shot.title
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedFrame(data.frame)
      } else {
        setFrameError(data.error || 'Failed to generate frame')
      }
    } catch (error) {
      setFrameError('Network error: ' + error.message)
    } finally {
      setIsGeneratingFrame(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/app" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            🧪 API Test Lab
          </h1>
          <p className="text-gray-600">
            Test OpenAI integration: Script parsing (GPT-4) and frame generation (DALL-E)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Script Input Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Script Parser (GPT-4)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scene Script
                  </label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Paste your scene script here..."
                  />
                </div>

                <button
                  onClick={handleParseScript}
                  disabled={isParsingScript || !script.trim()}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isParsingScript ? '🔄 Parsing with GPT-4...' : '🎬 Parse Script into Shots'}
                </button>

                {parseError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 text-sm">{parseError}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Parsed Shots */}
            {shots.length > 0 && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📝 Parsed Shots ({shots.length})
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {shots.map((shot, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900">{shot.title}</div>
                        <button
                          onClick={() => handleGenerateFrame(shot)}
                          disabled={isGeneratingFrame}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                          {isGeneratingFrame && selectedShot === shot ? '🎨' : '🖼️'} Frame
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {shot.camera} • {shot.duration}
                      </div>
                      <div className="text-sm text-gray-700">
                        {shot.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Frame Generation Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Frame Generator (DALL-E)
              </h2>

              {!selectedShot && (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-2">🎨</div>
                  <div>Parse a script and click a "Frame" button to generate an image</div>
                </div>
              )}

              {isGeneratingFrame && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">⏳</div>
                  <div className="text-gray-700 font-medium">Generating frame with DALL-E...</div>
                  <div className="text-sm text-gray-600 mt-2">This may take 10-30 seconds</div>
                </div>
              )}

              {frameError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-800 font-medium mb-1">Frame Generation Failed</div>
                  <div className="text-red-700 text-sm">{frameError}</div>
                </div>
              )}

              {generatedFrame && (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={generatedFrame.imageUrl}
                      alt="Generated storyboard frame"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Shot: {selectedShot?.title}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      DALL-E Prompt: {generatedFrame.prompt}
                    </div>
                    {generatedFrame.seed && (
                      <div className="text-xs text-gray-500">
                        Seed: {generatedFrame.seed}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-600 mr-3 mt-0.5">⚠️</div>
            <div>
              <div className="font-medium text-yellow-900 mb-1">OpenAI API Required</div>
              <div className="text-yellow-800 text-sm">
                Make sure your OPENAI_API_KEY environment variable is set. 
                Each API call costs ~$0.01-0.04. Script parsing uses GPT-4, frame generation uses DALL-E 3.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 