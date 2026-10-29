# Team login and Cloudflare Turnstile

## What this release changes

Anonymous visitors see a dedicated responsive login page before the workspace. Existing server-side session checks still protect every workspace API. Team members share one company workspace; projects are filters, not permission boundaries. There is no public signup. Only an administrator can create members under Settings → Account. Disable a member there to revoke their sessions and ingestion tokens.

Use a unique username and password of 12–128 characters for each member. Passwords are salted and hashed with scrypt in SQLite, never embedded in JavaScript or committed to source. Do not send real passwords through chat or commit a credential list. Create accounts directly in the administrator interface and distribute initial credentials through your company's approved private channel. Members can change their password under Settings; changing it revokes existing sessions.

## Turnstile setup

1. In Cloudflare Dashboard → Turnstile, add a Managed widget for hostname `cks.sysplatsec.dev` (hostname only, no protocol or path). Keep pre-clearance disabled. Turnstile can work with the existing DNS-only deployment; changing the DNS record to proxied is not required for this integration.
2. Put the public site key in the server's protected `deployment/.env` as `TURNSTILE_SITE_KEY=...`. It is intentionally visible to browsers. Store the **secret key** only in `deployment/secrets/turnstile_secret.txt`, owned by UID 1000 (the container's `node` user), mode `0600`, matching the existing admin secret. A root-owned `0600` file will be unreadable inside this container. Never put the secret in frontend variables, Git, screenshots, or chat.
3. Add `-f /srv/commons/source/deployment/compose.turnstile.yaml` AFTER the existing `-f /srv/commons/source/deployment/compose.yaml` in every Compose invocation, including the `dc` helper. Keep the existing `--env-file` argument. Validate the merged configuration without printing environment secrets: `dc config --quiet`. Recreate only the app: `dc up -d --no-deps app` (build the new app image first when deploying this release).
4. The app must reach `https://challenges.cloudflare.com` outbound on TCP 443; browsers must be able to load the widget there. A configured widget fails closed if verification is unavailable. Configure both keys together: partial configuration prevents startup. With neither key configured, ordinary password login remains enabled. The runtime endpoint exposes only the public site key.

The server calls Cloudflare Siteverify before password verification and requires `success: true`, exact hostname from `PUBLIC_ORIGIN`, and action `login`. Tokens are single-use, expire after five minutes, and are limited to 2048 characters. Failed submissions reset the widget. Do not use Cloudflare test keys in production.

Turnstile reduces automated login abuse. Membership is enforced by the account database and session authorization. It does not add an identity allowlist at Cloudflare's edge. Cloudflare Access would be a separate deployment requiring identity-provider and routing decisions, plus deliberate handling of bearer-token collectors and long-running AI requests.

## Production rollout — preserve current server patches

The live server has local CPU model tuning (`EVIDENCE_LIMIT`, `NUM_PREDICT`, instruct model). Do not overwrite `onprem/server.ts`, `onprem/model.ts`, `.env`, or the base Compose file wholesale. First capture `git status`, the local diff, and backups. Apply this release's patch only after `git apply --check` succeeds against the live tree. Resolve any overlap while keeping the model tuning. Build and validate before recreating the app. Caddy, HAProxy, certificates, and Ollama do not need a configuration change for this feature.

Keep a copy of the existing source changes, image ID, database backup, and Compose commands before rollout. If the new app fails health checks, restore the previous app image/source and the original Compose invocation; avoid modifying the database or reverting unrelated services. Disabling the Turnstile overlay restores password-only login, so treat that as a deliberate administrator action.

## Acceptance checks

- A private browser session sees Login, not the workspace. Anonymous workspace/settings/events requests return 401.
- Existing administrator login works. Create one test member, confirm shared workspace access and that member cannot administer accounts.
- With Turnstile enabled, missing/invalid/expired tokens are rejected, including direct POST attempts. Valid challenge plus valid credentials signs in. Wrong password requires a fresh challenge.
- Session cookie remains Secure, HttpOnly, SameSite=Strict; logout and password changes return the UI to Login.
- SSE heartbeats, AI answers with citations, and authorized bearer-token ingestion still work after login.
- Disable the test member and verify their sessions and tokens stop working.

## References

- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/
