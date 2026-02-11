<p align="center">
  <img src="static/party-popper.svg" alt="OfficeWatchParty" width="80" />
</p>

<h1 align="center">OfficeWatchParty</h1>

<p align="center">Watch <i>The Office</i> with your friends — synced, social, and way too quotable.</p>

## What is this?

OfficeWatchParty is a private watch-party app for binging _The Office_ with friends. Create a room, invite your crew, and watch episodes together with synced video playback and live comments. Think of it as your own little Dunder Mifflin break room.

## Features

- **Rooms** — Create or join watch-party rooms with invite links
- **Synced video** — Everyone watches the same episode, controlled by the room owner
- **Comments** — Drop reactions and hot takes in real time
- **Favorites** — Save your all-time best episodes
- **Chromecast & AirPlay** — Cast to the big screen
- **Dark mode** — For those late-night Threat Level Midnight sessions

## Tech Stack

| Layer          | Tech                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------- |
| Framework      | [SvelteKit](https://svelte.dev/) + [Svelte 5](https://svelte.dev/blog/svelte-5-is-alive) |
| Backend & Auth | [Supabase](https://supabase.com/) (Postgres, Auth, RLS)                                  |
| Hosting        | [Cloudflare Workers](https://workers.cloudflare.com/)                                    |
| Video          | [Video.js](https://videojs.com/)                                                         |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/)                                              |
| UI Components  | [Bits UI](https://bits-ui.com/)                                                          |

## Getting Started

```sh
# Clone the repo
git clone <repo-url> && cd officewatchparty

# Install dependencies
npm install

# Set up your environment
cp .env.example .env  # then fill in your Supabase & Cloudflare keys

# Start local Supabase
npm run supabase:start

# Run the dev server
npm run dev
```

## Scripts

| Command                  | What it does                   |
| ------------------------ | ------------------------------ |
| `npm run dev`            | Start the dev server           |
| `npm run build`          | Production build               |
| `npm run preview`        | Preview the production build   |
| `npm run check`          | Svelte & TypeScript checks     |
| `npm run lint`           | Run ESLint                     |
| `npm run format`         | Format with Prettier           |
| `npm run supabase:start` | Start local Supabase           |
| `npm run supabase:stop`  | Stop local Supabase            |
| `npm run cf:dev`         | Run Cloudflare Workers locally |
| `npm run cf:deploy`      | Build & deploy to Cloudflare   |
