# AI Job Agent

> Real-time AI-powered job discovery & auto-application system

**Live App:** [View on GitHub Pages](https://YOUR_USERNAME.github.io/ai-job-agent/)

## Features
- 🤖 AI agent scans LinkedIn, Indeed, Glassdoor, Greenhouse, Lever & Workday
- 🧠 NLP resume parser extracts skills for cosine similarity matching
- ⚡ Auto-applies to jobs posted within 48 hours with ≥70% match score
- 🔗 Every job has **real, verifiable URLs** — click to confirm on the actual platform
- 🔔 Real-time notifications with fallback "Apply Manually" links
- 📊 Live dashboard with stats, platform breakdown, and activity feed
- 🎨 Glassmorphism dark UI with animated micro-interactions

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy (GitHub Pages)
Push to `main` branch — GitHub Actions handles the build and deploy automatically.

## Tech Stack
- **Frontend:** Next.js 16 (static export) + Vanilla CSS Modules
- **State:** React Context + useReducer
- **Design:** Glassmorphism — backdrop-filter blur, layered shadows, translucent panels
- **Deployment:** GitHub Pages via GitHub Actions
