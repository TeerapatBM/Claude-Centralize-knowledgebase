# Commons readiness & design refinement — 2026-10-29

Scope: one focused audit/refinement pass, reuse baseline tests and existing components. User explicitly delegates design, background motion and readiness improvements. No new paid provider, WebGL engine, image generation or backend subsystem.

## Public references reviewed (10)

The public pages and their accessible structure/content were opened for comparison. These are design interpretations for Commons, not claims of testing the logged-in products or extracting their private source. Visual browser inspection was stopped by automatic URL-confidence review; no browser workaround used.

| Reference | Pattern selected for Commons | Adaptation |
|---|---|---|
| [Linear](https://linear.app/) | Clear product hierarchy and focused workflows | Quiet shell, stronger content hierarchy, consistent action placement |
| [Notion](https://www.notion.com/) | Capture → find → act, citations | Guided empty state and visible source context |
| [Raycast](https://www.raycast.com/) | Keyboard-first access | Search command, visible shortcuts, predictable Enter behavior |
| [Perplexity](https://www.perplexity.ai/hub) | Question-first entry and evidence | Homepage question entry and readable answer/source separation |
| [Figma](https://www.figma.com/) | Tool workspace / collaborative canvas | Stable navigation and bounded work surfaces |
| [Vercel](https://vercel.com/) | Infrastructure/status clarity | Honest runtime/connection states, restrained visual framing |
| [Craft](https://www.craft.do/) | Documents, tasks and notes together | Comfortable reading width and useful task/context links |
| [Milanote](https://milanote.com/) | Organizing related creative material | Data-to-knowledge illustration and distinct source identities |
| [Superhuman](https://superhuman.com/) | Fast work-oriented navigation | Compact secondary controls and responsive feedback |
| [Framer](https://www.framer.com/) | Layered canvas and motion | Original CSS/SVG dimensional scene, no copied imagery/code |

## Design decision

Self-host Manrope (Latin) and Noto Sans Thai (Thai), including OFL license files. Slightly larger Thai UI text, calm opaque reading surfaces over a faint atmospheric canvas. A dimensional knowledge sphere is the one expressive visual; no competing particle effects behind text. Motion is transform/opacity only, stops automatically after its entrance cycle, and follows both Settings motion and OS reduced-motion. Keep Light/Dark and five accent themes.

## Audit findings to fix

- Discard stale AI responses after changing source scope/demo/auth.
- Clear account/token UI state on authentication loss.
- Demo must not open real task sources as incomplete demo conversations.
- Block duplicate submissions synchronously; visible in-flight feedback.
- Keep readable Thai font metrics, keyboard focus and touch target sizes.

## Verification

Baseline: 20 tests and tsc pass. Final: focused regression tests, complete suite, tsc, both frontend builds, review of changed paths. Native browser UI was blocked by automatic URL-confidence review; actual screenshot/mobile/manual keyboard QA remains unverified. Docker/company CPU/model rollout remains outside this workstation.

## Final evidence

- 23 tests pass; TypeScript passes.
- On-prem frontend build passes. Built HTML/fonts/guide/login/Ollama-offline status smoke passes.
- app/page.tsx: fixed stale request/scope publishing, synchronous duplicate submission, real/demo task mixing, missing transcript error, repeated file selection and latest-load race.
- components/workspace-settings.tsx: cleared token/account state after authentication loss and guarded late refresh responses; synchronous submit lock.
- components/workspace-ui.tsx: Enter respects IME composition.
- onprem/server.ts: missing assets return 404; font and Markdown MIME types set.
- Original dimensional scene uses finite CSS/SVG entrance; no WebGL, external embeds or continuous rendering loop.
- Manrope and Noto Sans Thai TTF files are self-hosted with their OFL licenses (about 383 KB combined, cached by the browser).
- Screenshot/actual browser/mobile keyboard checks not completed: native Computer Use was blocked by automatic review because the current browser URL could not be confirmed. No alternative UI automation used.
- Docker/company hardware/live model benchmarks remain unverified; see deployment guide.
