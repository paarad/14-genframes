import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { z } from 'zod'

const FrameRequestSchema = z.object({
  shotDescription: z.string().min(5, 'Shot description must be at least 5 characters'),
  camera: z.string().min(1, 'Camera angle is required'),
  style: z.enum(['realistic', 'pencil', 'noir', 'anime', 'meme']).default('realistic'),
  title: z.string().optional(),
  seed: z.string().optional(),
  previousContext: z.string().optional()
})

// Style prompts to enhance DALL-E generation
const stylePrompts = {
  realistic: 'photorealistic, cinematic lighting, high detail, film still',
  pencil: 'pencil sketch, hand-drawn, black and white, storyboard style, clean lines',
  noir: 'film noir style, black and white, dramatic shadows, high contrast, 1940s cinematography',
  anime: 'anime style, cel-shaded, Japanese animation, vibrant colors, dynamic composition',
  meme: 'cartoon style, exaggerated expressions, internet meme aesthetic, satirical'
}

// Safety filters - block inappropriate content
const safetyKeywords = [
  'explicit', 'nude', 'sexual', 'violence', 'gore', 'drug', 'weapon', 'celebrity', 'politician'
]

function sanitizePrompt(prompt: string): string {
  let cleanPrompt = prompt.toLowerCase()
  
  // Replace potentially problematic terms
  safetyKeywords.forEach(keyword => {
    if (cleanPrompt.includes(keyword)) {
      cleanPrompt = cleanPrompt.replace(new RegExp(keyword, 'gi'), '[CONTENT]')
    }
  })
  
  // Replace real brand names and celebrities with generic terms
  cleanPrompt = cleanPrompt
    .replace(/\b(coca-cola|pepsi|mcdonalds|apple|google|facebook)\b/gi, 'BrandX')
    .replace(/\b(brad pitt|angelina jolie|leonardo dicaprio|will smith)\b/gi, 'Famous Actor')
  
  return cleanPrompt
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shotDescription, camera, style, title, seed, previousContext } = FrameRequestSchema.parse(body)

    // Create enhanced prompt for DALL-E with continuity context
    const stylePrompt = stylePrompts[style]
    const cameraPrompt = `${camera} angle`
    
    let enhancedPrompt = `${shotDescription}, ${cameraPrompt}, ${stylePrompt}`
    
    // Add title context if provided
    if (title) {
      enhancedPrompt = `Scene: ${title}. ${enhancedPrompt}`
    }
    
    // Add continuity context to maintain character states and emotions
    if (previousContext) {
      enhancedPrompt = `${enhancedPrompt}. IMPORTANT: Maintain visual continuity - ${previousContext}`
    }
    
    // Sanitize the prompt
    enhancedPrompt = sanitizePrompt(enhancedPrompt)
    
    // Add storyboard-specific instructions
    enhancedPrompt += ', storyboard frame, professional composition, clear visual storytelling'
    
    // Special handling for meme style
    if (style === 'meme') {
      enhancedPrompt += ', add satirical watermark overlay saying "PARODY"'
    }

    console.log('Generating frame with prompt:', enhancedPrompt)

    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const imageUrl = imageResponse.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image generated from DALL-E')
    }

    // Generate a seed for reproducibility (Pro feature)
    const generatedSeed = seed || Math.random().toString(36).substring(2, 15)

    const response = {
      imageUrl,
      prompt: enhancedPrompt,
      seed: generatedSeed
    }

    return NextResponse.json({
      success: true,
      frame: response,
      metadata: {
        style,
        camera,
        originalDescription: shotDescription
      }
    })

  } catch (error) {
    console.error('Frame generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    // Handle OpenAI API errors
    if (error instanceof Error) {
      // Check for content policy violations
      if (error.message.includes('content_policy')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Content not allowed. Please modify your scene description to comply with content policy.',
            code: 'CONTENT_POLICY_VIOLATION'
          },
          { status: 400 }
        )
      }

      // Check for quota/billing issues
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          {
            success: false,
            error: 'API quota exceeded. Please try again later or upgrade your plan.',
            code: 'QUOTA_EXCEEDED'
          },
          { status: 429 }
        )
      }

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