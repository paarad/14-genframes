# GenFrames 🎬

**From Script to Storyboard in Minutes** - AI-powered storyboard generation from scripts.

Transform your scenes into visual storyboards with AI. Parse scripts, generate frames, and export professional boards instantly.

## ✨ Features

- **🎬 Smart Parsing**: AI understands your script and breaks it into shots with camera angles and actions
- **🎨 Multiple Styles**: Generate frames in realistic, pencil, noir, anime, or meme styles  
- **📄 Pro Export**: Export as PDF boards or horizontal strips (Pro: watermark-free)
- **🔄 Re-roll Frames**: Don't like a frame? Generate alternatives instantly
- **💎 Seed Lock**: Pro users can reproduce exact frames with seed values

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/paarad/14-genframes.git
cd 14-genframes
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and add your API keys:

```bash
# Database
DATABASE_URL="file:./dev.db"

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your_openai_api_key

# Clerk Authentication (Optional - demo mode works without)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key

# Lemon Squeezy (Optional - for payments)
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
```

### 3. Database Setup
```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start creating!

## 🧪 Testing the API

1. **Demo Mode**: Visit the app without any setup - works with mock data
2. **Dashboard**: Go to `/app` to view your projects and account
3. **Script Parsing**: Paste a scene script and watch GPT-4 break it into shots
4. **Frame Generation**: Click any shot to generate a storyboard frame with DALL-E

## 📚 API Endpoints

### Script Parsing
```bash
POST /api/parse
Content-Type: application/json

{
  "script": "Your scene description...",
  "style": "realistic"
}
```

### Frame Generation  
```bash
POST /api/frame
Content-Type: application/json

{
  "shotDescription": "Wide shot of downtown street with traffic",
  "camera": "Wide shot", 
  "style": "realistic",
  "title": "Opening Scene"
}
```

## 💰 Pricing Tiers

- **Free**: 1 project, 10 shots, 20 frames, low-res export
- **Pro (€9/mo)**: Unlimited projects, 300 frames/month, hi-res export, seed lock, no watermarks

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (prod)  
- **AI**: OpenAI GPT-4o + DALL-E 3
- **Auth**: Clerk
- **Payments**: Lemon Squeezy
- **Deployment**: Vercel

## 🔐 Content Safety

- Automatic content filtering for NSFW/inappropriate content
- Brand name and celebrity substitution
- Satirical watermark for meme-style generations
- OpenAI content policy compliance

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Ready to bring your stories to life?** Start creating at [GenFrames.io](https://genframes.io) 🎬
