# DreamSense AI - Quick Start Guide

## Prerequisites

1. **Node.js** (v18 or higher) - Already installed on your system
2. **DeepSeek API Key** - You'll need to provide your own

## Setup Steps

### 1. Install Dependencies

Open a terminal in the `dreamsense-ai` folder and run:

```bash
npm install
```

### 2. Configure Environment

Open the `.env` file and add your DeepSeek API key:

```
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit: http://localhost:3000

## Project Structure

```
dreamsense-ai/
├── src/
│   ├── app/          # Next.js pages
│   │   ├── page.tsx          # Home page with interactive character
│   │   ├── interpret/        # Dream interpretation page
│   │   ├── pricing/          # Pricing page
│   │   ├── login/            # Login page
│   │   ├── register/        # Register page
│   │   ├── my-dreams/       # User's dream history
│   │   └── api/              # API routes
│   │       ├── auth/         # Auth endpoints
│   │       └── dreams/       # Dream endpoints
│   └── lib/           # Utilities (db, auth)
├── prisma/
│   └── schema.prisma # Database schema
└── .env              # Environment variables
```

## Features Included

✅ User registration and login
✅ Free trial (1 dream interpretation)
✅ AI-powered dream interpretation (DeepSeek)
✅ Dream history storage
✅ Responsive design
✅ Interactive homepage with animated character
✅ Pricing page (UI ready for Stripe integration)

## Next Steps

- Add Stripe payment integration
- Deploy to Vercel
- Get your domain
- Register your business for payment processing