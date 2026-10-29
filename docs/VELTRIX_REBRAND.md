# Veltrix frontend rebrand

## Direction

Rebrand the existing team knowledge workspace to Veltrix, using the supplied glossy ribbon V and icon board as the visual reference. Keep the current React/Vite implementation and all authentication, Turnstile, SSE, ingestion and local AI contracts. Public hostname and server settings stay administrator-controlled.

The identity uses Void `#060711`, Obsidian `#0d1022`, Violet `#a65bff`, Electric `#235bff`, Cyan `#00dcf5`, and Frost `#eef0ff`. The original supplied emblem is served locally for the login artwork. A lightweight SVG ribbon mark is used for compact branding and favicon. Navigation gets purpose-drawn glossy icons. Manrope and Noto Sans Thai remain self-hosted, with a new type scale, clearer reading sizes, geometric wordmark and quieter metadata.

## Layout and interaction

Login: full-height brand stage on the left, quiet focused form on the right. Desktop workspace: recessed navigation rail, floating command bar, wide workspace. Overview: a single branded intelligence canvas and compact metrics, followed by actual conversation content. Library, assistant, task board, import, account settings, dialogs, command palette and error/empty/loading states share new controls and surfaces. Mobile: compact header, scroll-safe forms, bottom navigation, no decorative artwork competing with content.

Dark is the default for new preferences; existing saved preferences remain valid. Light has its own pale violet surfaces and readable contrast. Theme choices remain in Settings. Motion covers initial reveal, navigation, dialog opening, control state, hover, focus, loading and confirmation. Decorative motion finishes rather than running behind reading surfaces. Operating-system reduced-motion and the existing user toggle suppress decorative animation.

## Verification and delivery

Run the existing functional suite, TypeScript, on-prem production build and branding checks. Review the changed UI for responsive layout and keyboard behavior where local browser tooling permits. Deliver changes in this repository for the user's existing Git push/pull workflow. No cloud deployment or credential changes are required for this visual release.

## Completed verification — 2026-10-29

- TypeScript passed; 26 functional tests passed. Both on-prem Vite and Sites/Vinext production builds passed.
- Isolated local Chromium acceptance: login, all six workspace screens, dark/light, 390px mobile without horizontal overflow, OS reduced-motion, command menu and Escape, file import through the UI, transcript dialog, task creation/status update, and logout back to Login. No browser page errors; 21 screenshots retained locally under `outputs/veltrix/` (ignored by Git).
- Turnstile responsive layout was checked with a local widget fixture at viewport widths 320, 360, 701, 900, 1440 and 390px, including resizes. Below 300px available width the widget switches to Compact; wider forms use Flexible. Tokenless login stays disabled. This verifies layout and frontend gating, not a real Cloudflare challenge. Existing server-side verification tests still pass. Check the real production widget after deployment.
- All four product UI modules import the local `veltrix-icons` implementation rather than Lucide defaults. Icons are purpose-drawn SVG interpretations of the supplied reference board, with scoped gradient IDs, decorative accessibility semantics, and semantic success/error colors.
- The supplied large emblem is copied unchanged into `public/brand/veltrix-emblem.png`; compact marks and favicon use `public/brand/veltrix-mark.svg`. Fonts remain local and retain their included licenses. Internal session names, existing appearance storage key, database, environment variables and server hostname remain compatible.

## Deployment using the existing Git workflow

Commit and push this source from the local repository. On the company server, inspect `git status --short` and retain the existing CPU tuning edits. This release does not change `onprem/server.ts`, `onprem/model.ts`, or `deployment/compose.yaml`; do not discard those local changes. Pull with `--ff-only`, build the app image, then recreate only the app with the existing Turnstile Compose overlay enabled. Keep using both `compose.yaml` and `compose.turnstile.yaml` in every deployment command. Do not copy `environment.example` over the server's `.env`. No DNS, credential, certificate or data migration is needed.

Cloudflare widget sizing reference: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/#widget-sizes
