# Drone Documents

A small Next.js app that shows a personal set of PDF files (insurance, registration and similar papers for a drone pilot) in a phone-friendly list, behind a passphrase screen. The login page describes it as "authority-ready access to your drone documentation", so the idea is to pull the papers up quickly when someone asks for them.

The repository holds only the viewer. No PDFs are committed. You supply them at build time.

## What it does

- `app/login.tsx` shows a passphrase form. A correct passphrase unlocks the viewer.
- `app/pdf-viewer.tsx` shows one card per PDF with a name and a short description. "View Document" opens the PDF in an iframe modal. "Download PDF" saves it.
- The layout uses responsive Tailwind classes and 44 px touch targets for buttons. There is no service worker, so nothing works offline.
- Logout clears the saved login state.

## How documents get into the app

Both scripts run before `dev` and `build`.

1. `scripts/sync-documents.js` fills `public/documents/`. It does nothing unless one of these is set:
   - `DOCS_SOURCE_DIR`: a local folder, copied recursively.
   - `DOCS_ARCHIVE_URL`: a zip file, downloaded and extracted. It follows up to 5 redirects. Optional auth for the download comes from `DOCS_ARCHIVE_TOKEN` (with `DOCS_ARCHIVE_AUTH_HEADER` and `DOCS_ARCHIVE_AUTH_SCHEME`), from `DOCS_ARCHIVE_BASIC_USER` and `DOCS_ARCHIVE_BASIC_PASS`, or from `DOCS_ARCHIVE_HEADER_KEY` and `DOCS_ARCHIVE_HEADER_VALUE`.

   When it runs, it first deletes the existing `public/documents/`. It then moves every PDF from subfolders into the top level, renaming duplicates with a numeric suffix.
2. `scripts/generate-file-list.js` reads the PDFs in `public/documents/` and writes `app/documents.json`. The card name comes from the file name, and the description comes from keyword matches on the file name (for example "haftpflicht" gives "Liability insurance policy document"). Files that match nothing get a generic description.

`public/documents/` and `app/documents.json` are gitignored.

## How access is protected

The protection is weak and only meant to keep casual visitors out.

- The passphrase is read from `NEXT_PUBLIC_DRONE_PASSPHRASE`. Next.js inlines `NEXT_PUBLIC_` variables into the browser bundle at build time, so anyone who downloads the JavaScript can read it.
- The check runs in the browser (`app/auth-context.tsx`). It compares trimmed, lower-cased strings and stores `pdf-viewer-auth=true` in `localStorage`. Setting that key by hand skips the login screen.
- The server checks nothing. Each PDF is a plain static file at `/documents/<file name>.pdf`, and the list of file names ships in the client bundle through `app/documents.json`. Anyone who knows or guesses a URL can download the file without the passphrase.

Do not rely on this for sensitive documents. Put the deployment behind real authentication (an identity proxy or HTTP basic auth at the host) if the PDFs matter.

## Stack

Versions come from `package.json`.

- Next.js 16.4 with the App Router, React 19.3, TypeScript 6.0
- Tailwind CSS 4.3 through `@tailwindcss/postcss`
- `adm-zip` 0.6 for the zip download
- ESLint 10 with typescript-eslint 8
- bun as the package manager (`bun.lock`)

TypeScript is held at 6.x because typescript-eslint 8.72 refuses to load under TypeScript 7.

## Run it

```sh
bun install
echo 'NEXT_PUBLIC_DRONE_PASSPHRASE=your-passphrase' > .env.local
bun run dev                  # http://localhost:3000
```

To load documents, set `DOCS_SOURCE_DIR` to a folder of PDFs, or drop PDFs into `public/documents/` and run `bun run generate-files`.

For a production build:

```sh
NEXT_PUBLIC_DRONE_PASSPHRASE=your-passphrase DOCS_SOURCE_DIR=/path/to/pdfs bun run build
bun run start
```

The passphrase must be set at build time, not at start time.

## Scripts

| Script | What it does |
| --- | --- |
| `dev` | Sync documents, generate the list, start `next dev --turbopack` |
| `build` | Sync documents, generate the list, run `next build` |
| `start` | Run `next start` on the built app |
| `lint` | Run ESLint |
| `sync-documents` | Run the sync script only |
| `generate-files` | Run the list generator only |

There is no test suite. Type-check with `bunx tsc --noEmit`.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_DRONE_PASSPHRASE` | login | Passphrase, read at build time. Login always fails if it is unset. |
| `DOCS_SOURCE_DIR` | sync script | Local folder of PDFs |
| `DOCS_ARCHIVE_URL` | sync script | URL of a zip with PDFs, ignored if `DOCS_SOURCE_DIR` is set |
| `DOCS_ARCHIVE_*` | sync script | Download auth, listed above |
