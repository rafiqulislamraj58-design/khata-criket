# KHAATA CRICKET (খাতা ক্রিকেট) 🏏
*খাতার পাতায় জমবে ক্রিকেট!* — a notebook-style spinner cricket game built with **Next.js (App Router) + React + GSAP + Lucide**.

## Requirements
- [Node.js](https://nodejs.org) **18.17 or newer** (check with `node -v`)
- npm (comes with Node)
- Internet on first load (Google Fonts for the handwriting style; the game still works without it)

## Run it
```bash
# 1. unzip the project and enter the folder
cd khaata-cricket

# 2. install dependencies (first time only)
npm install

# 3. start the dev server
npm run dev
```
Open **http://localhost:3000** in your browser. To test on your phone, open `http://<your-computer-IP>:3000` on the same Wi-Fi.

### Production build
```bash
npm run build
npm start
```
Deploy free on [Vercel](https://vercel.com): push to GitHub and import the repo (no settings needed).

## How to play
1. Press **নতুন খেলা / New Game**, choose mode (vs Computer or vs Player), names and overs.
2. Press **স্পিন করো / Spin Now**. The wheel gives 0–6 runs or OUT.
3. OUT ends that innings (1 wicket each). One over = 6 balls.
4. The second batter must beat the first score (target = score + 1). Reaching it wins instantly; equal scores = draw.

## Features
Bangla (default) + English UI (saved in localStorage; spinner labels always English) · Player vs Computer · Player vs Player · live scoreboard · last-6-balls history · reactions · GSAP spin/score/confetti animations · Web Audio sound effects (OFF by default) · shareable result (Web Share API / clipboard) · responsive.

## Project structure
```
src/app/         layout.js, page.js (screen flow, language & sound state), globals.css (all styles)
src/components/  HomeScreen, GameSetup, GameScreen, SpinnerWheel, ScoreBoard, BallHistory, GameResult, Controls
src/lib/         gameEngine.js (rules), translations.js, soundManager.js
```
The result is chosen with `crypto.getRandomValues` **before** the animation, and the wheel's final angle is computed from it, so the pointer always matches the real result. All 8 outcomes have equal probability (1/8).

## Tweaks
- Wheel colors / labels: `src/lib/gameEngine.js`
- Text & languages: `src/lib/translations.js`
- Spin duration: `duration` in `src/components/SpinnerWheel.jsx`
