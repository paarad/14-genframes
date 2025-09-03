'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Shot {
  title: string
  action: string
  camera: string
  duration: string
}

interface Frame {
  imageUrl: string
  prompt: string
}

export default function CreateStoryboardPage() {
  const [currentStep, setCurrentStep] = useState(1) // 1: Script Input, 2: Shots, 3: Frames
  const [script, setScript] = useState('')
  const [style, setStyle] = useState('realistic')
  const [shots, setShots] = useState<Shot[]>([])
  const [frames, setFrames] = useState<{[key: number]: Frame}>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const sampleScript = `EXT. DOWNTOWN STREET - DAY

The busy street is filled with honking cars and pedestrians rushing to work. Steam rises from manholes, and the sounds of the city create a chaotic symphony.

Suddenly, a sleek black sports car ROARS through the traffic, weaving between vehicles with precision. The car's engine echoes off the tall buildings.

The driver, ALEX (30s), grips the steering wheel tightly, eyes focused on the rearview mirror. In the reflection, we see pursuing vehicles gaining ground.

Alex slams on the accelerator. The car leaps forward, tires screeching as it takes a sharp right turn into a narrow alley.`

  const styles = [
    { id: 'realistic', name: 'Realistic', desc: 'Photorealistic, cinematic' },
    { id: 'pencil', name: 'Pencil Sketch', desc: 'Hand-drawn, storyboard style' },
    { id: 'noir', name: 'Film Noir', desc: 'Black & white, dramatic shadows' },
    { id: 'anime', name: 'Anime', desc: 'Japanese animation style' },
    { id: 'meme', name: 'Meme', desc: 'Cartoon, satirical style' }
  ]

  const handleParseScript = async () => {
    if (!script.trim()) return
    
    setIsProcessing(true)
    setError('')
    
    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, style }),
      })

      const data = await response.json()
      
      if (data.success) {
        setShots(data.shots)
        setCurrentStep(2)
      } else {
        setError(data.error || 'Failed to parse script')
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateFrame = async (shot: Shot, shotIndex: number) => {
    setIsProcessing(true)
    setError('')
    
    // Build context from previous shots to maintain visual and emotional continuity
    let previousContext = ''
    if (shotIndex > 0) {
      const contextShots = shots.slice(Math.max(0, shotIndex - 2), shotIndex) // Look at last 1-2 shots
      const contextParts: string[] = []
      
      contextShots.forEach((s: Shot) => {
        const action = s.action.toLowerCase()
        
        // Emotional states
        if (action.includes('crying') || action.includes('tears') || action.includes('sad') || action.includes('despondent')) {
          contextParts.push('panda is crying with tears on cheeks')
        }
        if (action.includes('concerned') || action.includes('worried') || action.includes('cautiously')) {
          contextParts.push('cat shows concern and worry')
        }
        
        // Character positions and interactions
        if (action.includes('sitting') || action.includes('sits')) {
          contextParts.push('characters are sitting close together')
        }
        if (action.includes('approaches') || action.includes('walks towards')) {
          contextParts.push('cat is near the panda')
        }
      })
      
      // Only include the most relevant recent context
      if (contextParts.length > 0) {
        previousContext = contextParts.slice(-2).join(', ') // Last 2 most important states
      }
    }
    
    try {
      const response = await fetch('/api/frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shotDescription: shot.action,
          camera: shot.camera,
          style,
          title: shot.title,
          previousContext
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setFrames(prev => ({
          ...prev,
          [shotIndex]: data.frame
        }))
      } else {
        setError(`Frame ${shotIndex + 1}: ${data.error}`)
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGenerateAllFrames = async () => {
    setCurrentStep(3)
    
    for (let i = 0; i < shots.length; i++) {
      await handleGenerateFrame(shots[i], i)
      // Small delay between requests to avoid rate limits
      if (i < shots.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  const exportStoryboard = async () => {
    const frameEntries = Object.entries(frames)
    
    if (frameEntries.length === 0) {
      alert('No frames to export yet!')
      return
    }

    try {
      // Create a downloadable HTML storyboard
      const storyboardHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Storyboard - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: white; }
            .storyboard { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .frame { border: 2px solid #333; padding: 10px; }
            .frame img { width: 100%; height: auto; display: block; }
            .frame-info { margin-top: 10px; font-size: 14px; }
            .frame-number { font-weight: bold; margin-bottom: 5px; }
            .frame-title { font-weight: bold; color: #333; }
            .frame-details { color: #666; font-size: 12px; margin-top: 5px; }
            .header { text-align: center; margin-bottom: 30px; }
            .style-badge { display: inline-block; background: #007bff; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AI-Generated Storyboard</h1>
            <p>Created with GenFrames • Style: <span class="style-badge">${style}</span></p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
          <div class="storyboard">
            ${frameEntries.map(([shotIndex, frame]: [string, Frame]) => {
              const shotNum = parseInt(shotIndex) + 1
              const shot = shots[parseInt(shotIndex)]
              return `
                <div class="frame">
                  <div class="frame-number">Frame ${shotNum}</div>
                  <img src="${frame.imageUrl}" alt="Frame ${shotNum}" />
                  <div class="frame-info">
                    <div class="frame-title">${shot?.title || `Shot ${shotNum}`}</div>
                    <div class="frame-details">${shot?.camera} • ${shot?.duration}</div>
                    <div class="frame-details">${shot?.action}</div>
                  </div>
                </div>
              `
            }).join('')}
          </div>
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            <p>Generated by GenFrames - AI-Powered Storyboard Creation</p>
          </div>
        </body>
        </html>
      `

      // Create a blob and download it
      const blob = new Blob([storyboardHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `storyboard-${style}-${Date.now()}.html`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Also open individual frames in new tabs as backup
      frameEntries.forEach(([, frame]: [string, Frame], index) => {
        if (frame?.imageUrl) {
          setTimeout(() => {
            window.open(frame.imageUrl, '_blank')
          }, index * 300)
        }
      })
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Opening frames in new tabs instead.')
      
      // Fallback: open frames in tabs
      frameEntries.forEach(([, frame]: [string, Frame], index) => {
        if (frame?.imageUrl) {
          setTimeout(() => {
            window.open(frame.imageUrl, '_blank')
          }, index * 500)
        }
      })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-2">
            🎬 Create Your Storyboard
          </h1>
          <p className="text-gray-600">
            From script to visual storyboard in minutes - powered by AI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[
              { num: 1, label: 'Script & Style', active: currentStep >= 1 },
              { num: 2, label: 'Review Shots', active: currentStep >= 2 },
              { num: 3, label: 'Generate Frames', active: currentStep >= 3 }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {step.num}
                </div>
                <span className="ml-2 text-sm text-gray-600">{step.label}</span>
                {index < 2 && <div className="w-8 h-px bg-gray-300 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Step 1: Script Input */}
        {currentStep === 1 && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📝 Your Scene Script
              </h2>
              
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={16}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Paste your scene script here or try the sample..."
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setScript(sampleScript)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Use Sample Script
                </button>
                <button
                  onClick={() => setScript('')}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                🎨 Visual Style
              </h2>
              
              <div className="space-y-3">
                {styles.map((styleOption) => (
                  <label key={styleOption.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="style"
                      value={styleOption.id}
                      checked={style === styleOption.id}
                      onChange={(e) => setStyle(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{styleOption.name}</div>
                      <div className="text-sm text-gray-600">{styleOption.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={handleParseScript}
                disabled={isProcessing || !script.trim()}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? '🔄 Parsing Script...' : '🎬 Parse into Shots'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Shots */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                📋 Generated Shots ({shots.length})
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  ← Edit Script
                </button>
                <button
                  onClick={handleGenerateAllFrames}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🎨 Generate All Frames
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {shots.map((shot: Shot, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-gray-900">
                      {index + 1}. {shot.title}
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {shot.camera}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{shot.duration}</div>
                  <div className="text-sm text-gray-700">{shot.action}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Generated Frames */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                🖼️ Your Storyboard ({Object.keys(frames).length}/{shots.length} frames)
              </h2>
              {Object.keys(frames).length === shots.length && (
                <button
                  onClick={exportStoryboard}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  📄 Export Storyboard
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shots.map((shot: Shot, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 aspect-video flex items-center justify-center">
                    {frames[index] ? (
                      <img
                        src={frames[index].imageUrl}
                        alt={`Frame ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : isProcessing ? (
                      <div className="text-center text-gray-500">
                        <div className="text-2xl mb-2">⏳</div>
                        <div className="text-sm">Generating...</div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="text-2xl mb-2">🎬</div>
                        <div className="text-sm">Waiting...</div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {index + 1}. {shot.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {shot.camera} • {shot.duration}
                    </div>
                    {frames[index] && (
                      <button
                        onClick={() => handleGenerateFrame(shot, index)}
                        className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        🔄 Re-generate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isProcessing && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-800 text-sm">
                  ⏳ Generating frames... This may take 1-2 minutes depending on the number of shots.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by OpenAI GPT-4 & DALL-E • No account required • Try it instantly</p>
        </div>
      </div>
    </main>
  )
} 