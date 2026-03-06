# Xhaandora — Pomodoro Productivity App (Scaffold)

This repository is a scaffold for Xhaandora — a full-featured Pomodoro productivity app.

Features implemented in scaffold:
- Core timer engine (start/pause/reset, auto-switch)
- Visual timer display (HH:MM:SS) and circular progress placeholder
- Keyboard shortcuts (Space, R, 1/2, S, D, T, Esc)
- Audio notifications (WebAudio fallback) and focus music player scaffold
- Local persistence via `localStorage` for settings, tasks and session state
- Tasks panel (add/complete) persisted in localStorage
- Settings slide-over with session durations and theme toggle
- Wake Lock integration scaffold
- Supabase client scaffolding with `.env.example`
- Tailwind + Framer Motion + Lottie included as UI/animation foundations

Next steps:
1. Run `npm install` to fetch dependencies.
2. Add Supabase keys to `.env.local` based on `.env.example` to enable cloud sync.
3. Add custom alarm sound files into `public/` or use settings to upload.

Run locally:
```bash
npm install
npm run dev
```

This scaffold focuses on core features and clear extension points for pro features (analytics, integrations, AI, cloud sync).
