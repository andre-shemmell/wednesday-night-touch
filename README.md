# 🏉 Wednesday Night Touch Footy Hub

> A dedicated home for Dad's weekly Wednesday night touch footy match write-ups. Features scoreboards, casualty ward reports (5-stitch finger cuts 😂), referee controversies, and his classic "Summing Up" closing verdicts.

---

## 🚀 Where to Host It (100% Free Forever)

You have two excellent, zero-maintenance free hosting options:

### Option 1: Vercel (Easiest & Recommended)
1. Push this repository to GitHub (or install the Vercel CLI: `npm i -g vercel`).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** -> import this repository.
3. Vercel automatically detects Vite and deploys in ~15 seconds.
4. **Custom Domain**: Connect a domain like `dadsfooty.com` or use Vercel's free `*.vercel.app` domain with automatic SSL.

### Option 2: GitHub Pages (Direct from GitHub)
1. Push this code to a GitHub repository.
2. In your repo, go to **Settings** -> **Pages** -> under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) will automatically build and publish the site on every push!

---

## 🤖 AI-Powered SMS Ingestion (Gemini Flash)

Every Wednesday night when Dad sends his SMS, you don't need to format anything manually:
1. Open the site and click the **"AI Ingest"** button in the header.
2. Paste Dad's raw SMS into the text box.
3. Click **"Parse with Gemini Flash"** (or use the built-in **Instant Offline Heuristic** button if you don't have an API key set).
4. Gemini extracts:
   - Match Score (Half Time, Full Time, Result)
   - Try Scorers (Dylan, Joel, Jayden, Cam)
   - Defensive Highlights (Nev's "A Great Leave", clutch tags)
   - The Casualty Ward (Mitch's 5 stitches 😂, Reece, Peter)
   - Referee Controversies (disallowed tries, soft send-offs)
   - Dad's "Summing Up" quote of the week
5. Review the live preview and click **"Publish Match to Site"** — it appears immediately in the match center!

> **Gemini API Key**: You can add a free Gemini API key from [aistudio.google.com](https://aistudio.google.com) right in the UI (saved locally in your browser), or add it to a `.env` file as `VITE_GEMINI_API_KEY=your_key_here`.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

- `src/data/matches.json` — The master database of match reports.
- `src/data/players.ts` — Player profiles, nicknames, and role descriptions.
- `src/services/aiParser.ts` — Gemini Flash integration for intelligent SMS parsing.
- `src/services/heuristicParser.ts` — Fast offline regex fallback parser.
- `src/components/` — Scoreboard, Dad's quote cards, highlights, squad roster, and ingest studio.
