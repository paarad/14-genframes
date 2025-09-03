import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Shot parsing types
export interface Shot {
  title: string
  action: string
  camera: string
  duration: string
}

// Frame generation types
export interface FrameRequest {
  shotDescription: string
  camera: string
  style: 'realistic' | 'pencil' | 'noir' | 'anime' | 'meme'
  seed?: string
}

export interface FrameResponse {
  imageUrl: string
  prompt: string
  seed?: string
} 