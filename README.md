# 🐔 The Chicken Lady — "What Chicken Breed Matches Your Vibe?" Quiz

An AI-powered personality quiz hosted on Cloudflare Pages.
Visitors answer 8 questions, get matched to one of 8 chicken breeds, receive an
AI-generated portrait of their breed via Google Imagen, and can download a free coloring page!

---

## 📁 File Structure

```
chicken-lady-quiz/
├── index.html   ← The quiz page (what visitors see)
├── worker.js    ← Cloudflare Worker proxy (keeps ALL API keys secret)
└── README.md    ← This file
```

**Your API keys are NEVER stored in these files.**
They live only inside Cloudflare as encrypted Secrets.

---

## 🧰 Tech Stack

| Service | What It Does | Dashboard |
|---|---|---|
| **GitHub** | Stores your files, tracks all changes | github.com |
| **Cloudflare Pages** | Hosts `index.html` as a live website | dash.cloudflare.com |
| **Cloudflare Workers** | Runs `worker.js` — secretly calls both APIs | dash.cloudflare.com |
| **Groq AI** | Determines the personality/breed match | console.groq.com |
| **Google Imagen** | Generates a unique cute chicken portrait | aistudio.google.com |

---

## 🔑 Secrets Stored in Cloudflare

Go to: **Cloudflare → Workers & Pages → chicken-lady-proxy → Settings → Variables and Secrets**

| Secret Name | What It Is |
|---|---|
| `GROQ_API_KEY` | Your Groq API key (starts with `gsk_`) |
| `GOOGLE_API_KEY` | Your Google AI Studio key (starts with `AIza`) |

---

## 🐔 The 8 Chicken Breeds

| Breed | Vibe |
|---|---|
| Silkie | Fluffy, dramatic, lover of cozy blankets |
| Polish Chicken | Eccentric rockstar in an oversized feather hat |
| Rhode Island Red | Independent, no-nonsense boss hen |
| Brahma | Gentle giant — calm, wise, and unbothered |
| Easter Egger | Creative free spirit full of surprises |
| Sebright | Tiny but mighty — fiercely confident fashionista |
| Buff Orpington | Warm, nurturing — everyone's favorite friend |
| Ayam Cemani | Mysterious, all-black, intensely cool |

---

## 🚀 Deployment (First-Time Setup)

### Step 1 — Upload files to GitHub
1. Go to **github.com** → your `chicken-lady-quiz` repo
2. Upload `index.html`, `worker.js`, and `README.md`
3. Click **Commit changes**

### Step 2 — Update the Cloudflare Worker
1. Go to **dash.cloudflare.com** → **Workers & Pages** → `chicken-lady-proxy`
2. Click **Edit Code** → select all → delete → paste new `worker.js` → click **Deploy**

### Step 3 — Confirm both Secrets are saved
1. Go to Worker → **Settings** → **Variables and Secrets**
2. Confirm both `GROQ_API_KEY` and `GOOGLE_API_KEY` are listed as Secret type
3. If either is missing, click **Add** → Secret → paste key → Save and Deploy

### Step 4 — Cloudflare Pages auto-deploys from GitHub
- Every commit to GitHub triggers an automatic redeploy (~30 seconds)
- Your live URL: `https://chicken-lady-quiz.pages.dev`

---

## ✏️ How to Make Edits

### Changing quiz questions
Find `var questions = [` in `index.html`. Each question looks like:
```javascript
{ text: "Your question here?", answers: [
  { emoji: "&#x2728;", text: "Answer one" },
  { emoji: "&#x1F525;", text: "Answer two" },
  { emoji: "&#x1F4AA;", text: "Answer three" },
  { emoji: "&#x1F9D8;", text: "Answer four" }
]},
```
Keep exactly 4 answers per question. Save → commit to GitHub → auto-deploys.

### Adding or changing chicken breeds
Find `var BREEDS = {` in `index.html`. Each breed looks like:
```javascript
"Breed Name": {
  emoji: "&#x1F413;",
  tagline: "Short punchy description",
  imagePrompt: "Detailed prompt for Google Imagen to generate the portrait"
},
```
Also add a matching entry in `var COLORING_PROMPTS = {` for the coloring page feature.

### Changing the AI model
In `worker.js`, find:
```javascript
model: "llama-3.3-70b-versatile",
```
Replace with any current Groq model name from console.groq.com/docs/models

### Changing colors
In `index.html` find `:root {` near the top:
```css
--yolk:   #F5A623;   /* orange/gold */
--comb:   #E8433A;   /* red */
--feather:#6DBE6C;   /* green */
--sky:    #FFF8ED;   /* page background */
--earth:  #5C3D1E;   /* dark brown text */
```

---

## 🎨 Coloring Page Prompts (for YOU — not the app)

Use these in **Google AI Studio → ImageFX** to create printable coloring pages:

**Silkie:**
A cute Silkie chicken with ultra-fluffy feathers sitting on a cozy blanket, wearing a tiny knitted scarf, surrounded by hearts and stars, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical and adorable style

**Polish Chicken:**
A cute Polish chicken with a huge dramatic poofy feather crest, wearing tiny sunglasses and a rockstar pose, surrounded by music notes and stars, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Rhode Island Red:**
A cute confident Rhode Island Red chicken standing tall wearing a tiny bow tie, surrounded by little stars and crowns, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Brahma:**
A cute giant fluffy Brahma chicken with feathered feet sitting peacefully, surrounded by flowers and butterflies, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Easter Egger:**
A cute Easter Egger chicken wearing an artist beret surrounded by colorful eggs and paint splashes, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Sebright:**
A cute tiny Sebright chicken with lace-patterned feathers wearing a tiny crown strutting on a runway, surrounded by butterflies, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Buff Orpington:**
A cute fluffy Buff Orpington chicken surrounded by little chicks and baked goods, flowers all around, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

**Ayam Cemani:**
A cute all-black Ayam Cemani chicken wearing a tiny star cape surrounded by moons and glowing stars, simple bold outlines, black and white coloring page for kids, no shading, clean lines, whimsical style

---

## 🔑 Managing Your API Keys

### If you need to replace your Groq key:
1. Go to **console.groq.com** → **API Keys** → create new key
2. Go to **Cloudflare** → `chicken-lady-proxy` → **Settings** → **Variables and Secrets**
3. Click pencil next to `GROQ_API_KEY` → paste new key → Save and Deploy
4. Delete old key from Groq console

### If you need to replace your Google key:
1. Go to **aistudio.google.com** → **Get API Key** → create new key
2. Go to **Cloudflare** → `chicken-lady-proxy` → **Settings** → **Variables and Secrets**
3. Click pencil next to `GOOGLE_API_KEY` → paste new key → Save and Deploy

### If GitHub flags your key:
1. Immediately delete the exposed key from its platform
2. Create a new key
3. Store it ONLY in Cloudflare Secrets — never paste into a file

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Quiz errors before answering | Check WORKER_URL in index.html matches your actual worker |
| "Groq error" message | Check GROQ_API_KEY secret in Cloudflare, create fresh key if needed |
| Image never loads / stays on "Painting..." | Check GOOGLE_API_KEY secret in Cloudflare |
| Wrong breed name returned | Groq picked a name not in the list — the app auto-corrects this |
| Changes not showing | Wait 60 seconds, hard refresh with Ctrl+Shift+R |
| Google Sites embed blank | Make sure URL uses https:// |
| Model decommissioned error | Update model name in worker.js to current Groq model |

---

## 🔗 Quick Links

- **Your quiz (live):** https://chicken-lady-quiz.pages.dev
- **Your site:** https://chickens.rlbdesigns.com
- **GitHub repo:** https://github.com/iamthechickenlady-netizen/chicken-lady-quiz
- **Cloudflare dashboard:** https://dash.cloudflare.com
- **Groq console:** https://console.groq.com
- **Google AI Studio:** https://aistudio.google.com
- **Current Groq model:** llama-3.3-70b-versatile

---

*Built with 🧡 for The Chicken Lady | Powered by Groq AI + Google Imagen + Cloudflare*
