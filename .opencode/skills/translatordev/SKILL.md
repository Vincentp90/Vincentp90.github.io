---
name: translatordev
description: Develop the LLM Translator React+Vite app. Use when working on translator.md, src/main.jsx, or the npm run build workflow for the translator feature.
---

# Translator Development Skill

## Purpose
Develop and maintain the LLM Translator feature — a React + Vite app that compiles to static JS and loads into a Jekyll page via GitHub Pages.

## Architecture

```
src/main.jsx          ← React entry point (Vite input)
└─ Vite build ──►
   assets/translator/js/main-[hash].js   ← static bundle
   assets/translator/css/                ← any styles
translator.md       ← Jekyll page that loads the static JS via script tag
```

## Key Files

| File | Role |
|------|------|
| `src/main.jsx` | React entry — mounts to `#root` div |
| `vite.config.js` | Outputs to `assets/translator/`, removes underscores from filenames |
| `package.json` | Dependencies: react, react-dom, vite, @vitejs/plugin-react |
| `translator.md` | Jekyll page with `layout: page`, loads the built JS |
| `_layouts/default.html` | Nav bar with link to `/translator/` |
| `_config.yml` | Excludes `src/`, `package.json`, `vite.config.js` from Jekyll build |

## Build Workflow

1. **Develop** in `src/main.jsx` using React
2. **Build**: `npm run build` → produces hashed static JS in `assets/translator/js/`
3. **Update** `translator.md` with the new hashed filename
4. **Test**: `bundle exec jekyll serve` → navigate to `/translator/`

## API Reference — Google Gemini

Source: https://ai.google.dev/gemini-api/docs/quickstart.md.txt

**JavaScript SDK** (`@google/genai`):
- Init: `new GoogleGenAI({})` — reads `GEMINI_API_KEY` from env
- Call: `ai.models.generateContent({ model, contents })`
- Stream: `ai.models.generateContentStream({ model, contents })`

**REST API**:
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`
- Auth: `x-goog-api-key` header
- Payload: `{ contents: [{ role: "user", parts: [{ text: "..." }] }] }`

## React Component Guidelines

- Keep components in `src/` — they compile to static JS
- Use functional components with hooks
- Mount via `createRoot(document.getElementById('root')).render()`
- The `translator.md` page provides the `#root` container

## Common Tasks

### Adding a new React component
1. Create component in `src/components/`
2. Import and use in `src/main.jsx`
3. Run `npm run build`
4. Update `translator.md` with new hashed filename

### Adding styles
1. Import CSS in `src/main.jsx` or create `.scss` files
2. Vite outputs to `assets/translator/css/`
3. Update `translator.md` link tag if needed

### Testing locally
```bash
npm run build
bundle exec jekyll serve
# Visit http://localhost:4000/translator/
```
