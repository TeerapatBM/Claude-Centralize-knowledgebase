# Veltrix assistant: models, documents, links and languages

## Model selection and keys

Choose provider and model in the chat header or Settings → AI and server. Ollama remains the default on-prem provider. Installed models are discovered from the configured Ollama server; optional models cannot be selected until installed by an administrator. No model is downloaded automatically. The catalog includes local Qwen/Gemma/Coder options and cloud options from OpenAI, Anthropic, Google, Groq, DeepSeek and xAI. Each model has a Thai/English use-case description and a local/free-tier/paid label. These descriptions are starting points for evaluation, not measured quality guarantees.

Set your own provider API key in Settings. Keys remain in page memory, are sent only to this app's authenticated chat endpoint for the selected request, and are not written to browser storage, the database or audit payloads. Reloading the page or logging out clears keys. Provider/model choices apply to subsequent requests; completed messages retain the model that generated them. There is no automatic paid fallback.

Cloud calls require a separate explicit checkbox confirming that conversation history, attached text and retrieved team evidence will leave the company server. Free tiers depend on country, account, current quota and billing configuration. In particular Google free-tier data may be used to improve Google products. An eligible free-tier model is not a guarantee that every account/request will be free. Paid API access is separate from consumer chat subscriptions. See [MODEL_PROVIDERS.md](MODEL_PROVIDERS.md) for official source links, verified model IDs and provider details.

## Documents and conversation

The new chat supports follow-up messages, model selection, attachment previews, source citations, copying answers and a New chat action. Switching to Settings does not discard the current thread or attachments. A page reload, logout or New chat clears the current thread. This release does not persist chat threads or attachments in the company database. Import into the shared library remains a deliberate separate action.

Supported attachments: PDF containing actual selectable text, DOCX, TXT, Markdown, CSV, JSON, LOG and YAML. Each file is at most 5 MB, a PDF at most 100 pages, extracted text at most 80,000 characters per file, at most 5 files/links combined and 200,000 extracted characters in total. Extraction runs in the browser. PDF scans require OCR beforehand; images, embedded attachments, layout and formatting are not sent as vision inputs. DOCX expanded content has a 20 MB / 1,000-entry limit. Protected/corrupt documents show extraction errors.

Long documents are reduced to relevant excerpts plus opening context. The model does not see every character of a long document, and the UI says this. New chat uses documents even when the team library is empty, and separates general suggestions from claims supported by company evidence. Sources are numbered and can be opened for inspection. External model requests are currently non-streaming and may wait for the whole answer.

For CPU inference, the existing `EVIDENCE_LIMIT` (1–8, default 8) and `NUM_PREDICT` (64–1024, default 1024) remain supported. The live company's values 5 / 512 are preserved by deployment. New local chat caps questions at 4,000 characters, includes the last 4 history messages up to 500 characters each and at most 6,000 evidence characters. Cloud chat supports questions up to 12,000 characters and the last 8 bounded messages. The single-inference gate is shared across old and new local inference routes to avoid CPU overload. No GPU is required for the existing local model.

## Links

On-prem link attachment fetches public HTTPS HTML/plain-text/Markdown pages, shows extracted text, and attaches it to the current chat. It does not send a browser cookie, login credential or provider API key to that site. Pages requiring login or client-side rendering may not contain useful readable text. Download a private document and attach the file instead. Sites-hosted previews support file attachments and cloud chat; the public-link reader is on-prem only and its button is disabled on Sites.

The reader allows only HTTPS port 443, rejects URL credentials/local/private/metadata addresses, checks every DNS answer and every redirect, and pins the validated address into the outgoing connection to resist DNS rebinding. Responses are limited to 512 KB, at most 3 redirects and a 12-second overall request window. Link text is treated as untrusted evidence, never executable HTML. Authentication, same-origin checks and per-user/global limits apply to the reader.

## Theme and language

All product dropdowns use the Veltrix themed listbox/popover, including filters, sorting, task status, model/provider and language. Keyboard arrows, Home/End, Enter/Space, Escape, typeahead and disabled options are supported. Menus use the browser top layer so cards cannot clip them, reposition on scroll/resize, and use the active dark/light palette. Native file dialogs and the Cloudflare verification frame keep their own platform/provider appearance.

Switch Thai/English in Settings or on Login. The language is stored as a presentation preference in `veltrix.language.v1`, updates the document language and common UI labels/placeholders. User conversations and documents are not translated automatically. Dynamic provider/server errors can retain their original language. Model responses are requested in the selected language.

## Verification

Provider adapters are tested with injected responses for fixed endpoints, request schemas, reply parsing, errors and key redaction. No real paid inference is used in tests. The local integration test uses a synthetic Ollama server to verify attachment evidence, follow-up context, installed-model discovery and cloud-consent enforcement. Browser checks exercise real PDF/DOCX/TXT extraction, both languages, theme menus, local chat request payloads, key storage and mobile layout. Link UI tests use a synthetic response; network-policy/unit tests separately verify private-address rejection and text extraction. Real provider access and external network reachability must be checked using the deployment's own keys and network policy.

Use [UPDATE_ASSISTANT.md](UPDATE_ASSISTANT.md) for the one-pass rollout. The upgrade helper incorporates the previously local CPU tuning into tracked source, preserves environment and secret files, retains a Git stash/image backup and restores the prior image if activation fails.
