# SNS Technology — Website

Static site + AI intake agent + brand assets. Ready for Vercel.

## Folder structure (upload as-is to the repo root)
- index.html              → the website (header/footer logo is embedded inline — no file needed)
- api/chat.js             → serverless function for the AI agent (holds API key server-side)
- favicon.svg             → modern browser favicon  (MUST stay at root)
- favicon.ico             → legacy favicon          (MUST stay at root)
- favicon-32.png          → 32px favicon            (MUST stay at root)
- favicon-180.png         → Apple touch icon        (MUST stay at root)
- images/                 → project photos go here (work-1.jpg … work-6.jpg)
- assets/brand/           → reusable logo files (NOT required by the site; for email/print/social)

## Why favicons live at the root
Browsers look for favicons at the site root and the <link> tags in index.html point to
"/favicon.svg" etc. Keep these four files at the top level — do not move them into a folder.

## Deploy (Vercel)
1. Upload everything above to your GitHub repo root (overwrite index.html).
2. Vercel auto-deploys on push.
3. Env var in Vercel:  ANTHROPIC_API_KEY = sk-ant-...
4. Hard refresh the site (Cmd/Ctrl+Shift+R). Favicons may need a tab close/reopen.
