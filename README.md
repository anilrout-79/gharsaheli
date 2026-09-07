# 🌸 GharSaheli AI

**Aap ghar sambhaliye. GharSaheli planning sambhalegi.**

A warm, all-in-one companion app for Indian homemakers (and NRIs) — home management, budget, kids tracking, wellness, learning, earning, and a voice "Saheli" who talks in your regional language.

Everything runs in a single `index.html`. All personal data stays **on the user's device** (localStorage) — nothing is sent to any server except optional AI features (see below).

---

## 🚀 Deploy options

### Option A — GitHub Pages (simplest, free)
1. Create a repo and upload: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
2. Repo **Settings → Pages → Branch: `main` / root → Save**.
3. Your app is live at `https://<username>.github.io/<repo>/` over HTTPS.

On GitHub Pages the app is fully functional **except live AI** (see "AI features" below) — those fall back gracefully.

### Option B — Vercel (adds working AI, still free)
1. Import the repo into Vercel.
2. Keep `api/claude.js` in the repo (it's the AI proxy).
3. Vercel → **Project → Settings → Environment Variables** → add
   `ANTHROPIC_API_KEY = sk-ant-...`
4. Deploy. The app calls `/api/claude`; your key stays server-side.

### Option C — Netlify (adds working AI, still free)
1. Import the repo. `netlify.toml` and `netlify/functions/claude.js` are included.
2. Netlify → **Site settings → Environment variables** → add
   `ANTHROPIC_API_KEY = sk-ant-...`
3. Deploy. `/api/claude` is redirected to the function automatically.

---

## 🤖 AI features (optional)

Two features use AI: the **Saheli chat** (talk about anything) and the **live gold-rate** refresh in the Kamai tab.

- The app calls a proxy at `window.GS_AI_ENDPOINT` (default `/api/claude`).
- **The API key is NEVER in `index.html`.** It lives only as a server environment variable in Vercel/Netlify (Options B/C).
- If no proxy is available (e.g. plain GitHub Pages), both features **fall back gracefully** — Saheli gives warm built-in replies, and gold shows the last-known baseline rate. Nothing breaks.

To point at a different proxy URL, edit this line near the top of `index.html`:
```js
window.GS_AI_ENDPOINT = '/api/claude';
```

---

## 📱 Install as an app (PWA)
Once hosted over HTTPS, users can tap **Settings → App & Display → 📲 Phone mein install karein** (or the browser's "Add to Home Screen") to install it like a native app. `sw.js` caches the shell so it opens offline after the first visit.

> **Update tip:** when you deploy a new `index.html`, bump `CACHE_VERSION` in `sw.js` so users get the latest version.

---

## 🔒 Privacy
- All diary entries, budgets, reminders, and memories are stored **only on the user's device**.
- **Backup/Restore** is in Settings → App & Display (download a `.json`, restore on a new phone).
- The AI proxy only forwards the current chat/gold-rate request; it stores nothing.

---

## 🗂️ Files
| File | Purpose |
|------|---------|
| `index.html` | The entire app |
| `manifest.json` | PWA metadata (install) |
| `sw.js` | Offline caching service worker |
| `icon-192.png`, `icon-512.png` | App icons |
| `api/claude.js` | AI proxy for Vercel |
| `netlify/functions/claude.js` + `netlify.toml` | AI proxy for Netlify |

---

Made with ❤️ for every woman who holds a home together. 🌸
