import { NextRequest, NextResponse } from 'next/server'
import { openai, Shot } from '@/lib/openai'
import { z } from 'zod'

const ParseRequestSchema = z.object({
  script: z.string().min(10, 'Script must be at least 10 characters'),
  style: z.enum(['realistic', 'pencil', 'noir', 'anime', 'meme']).optional().default('realistic')
})

const ShotSchema = z.object({
  title: z.string(),
  action: z.string(),
  camera: z.string(),
  duration: z.string()
})

const ParseResponseSchema = z.object({
  shots: z.array(ShotSchema)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { script, style } = ParseRequestSchema.parse(body)

    // Create a comprehensive prompt for GPT-4 to parse the script
    const prompt = `You are a professional storyboard artist and script supervisor. Parse the following scene script into individual shots for a storyboard.

For each shot, provide:
- title: A brief, descriptive title (e.g., "Hero Car Reveal", "Wide Establishing Shot")
- action: Detailed description of what happens in the shot
- camera: Camera angle/movement (e.g., "Wide shot", "Close-up", "Medium shot", "Pan left", "Dolly forward")
- duration: Estimated duration (e.g., "3 seconds", "1 second", "Beat")

Guidelines:
- Break complex actions into multiple shots
- Consider cinematic flow and pacing
- Use standard film terminology for camera angles
- Keep shots focused and actionable
- Aim for 3-8 shots total depending on complexity

Return ONLY a valid JSON object with this exact structure:
{
  "shots": [
    {
      "title": "Shot title",
      "action": "Detailed action description", 
      "camera": "Camera angle/movement",
      "duration": "Time duration"
    }
  ]
}

Script to parse:
${script}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional storyboard artist. You MUST respond with valid JSON only. Do not include any text before or after the JSON object. Start your response with { and end with }.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON
      max_tokens: 2000,
      response_format: { type: "json_object" } // Force JSON output
    })

    const responseText = completion.choices[0]?.message?.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse and validate the JSON response
    let parsedResponse
    try {
      // Try to extract JSON from the response (sometimes GPT adds extra text)
      let jsonText = responseText.trim()
      
      // Look for JSON object boundaries
      const jsonStart = jsonText.indexOf('{')
      const jsonEnd = jsonText.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = jsonText.substring(jsonStart, jsonEnd + 1)
      }
      
      parsedResponse = JSON.parse(jsonText)
    } catch (error) {
      console.error('Failed to parse OpenAI response:', responseText)
      
      // Fallback: Create a simple breakdown if JSON parsing fails
      const fallbackShots = [
        {
          title: "Scene Opening",
          action: script.split('\n')[0] || "Opening shot of the scene",
          camera: "Wide shot",
          duration: "3 seconds",
          order: 1
        },
        {
          title: "Main Action",
          action: script.split('\n').slice(1, 3).join(' ') || "Main action of the scene",
          camera: "Medium shot", 
          duration: "5 seconds",
          order: 2
        },
        {
          title: "Scene Conclusion",
          action: script.split('\n').slice(-2).join(' ') || "Conclusion of the scene",
          camera: "Close-up",
          duration: "2 seconds",
          order: 3
        }
      ]
      
      console.log('Using fallback shots due to JSON parsing error')
      parsedResponse = { shots: fallbackShots }
    }

    const validatedResponse = ParseResponseSchema.parse(parsedResponse)

    // Add order numbers to shots
    const shotsWithOrder = validatedResponse.shots.map((shot, index) => ({
      ...shot,
      order: index + 1
    }))

    return NextResponse.json({
      success: true,
      shots: shotsWithOrder,
      totalShots: shotsWithOrder.length
    })

  } catch (error) {
    console.error('Parse API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 