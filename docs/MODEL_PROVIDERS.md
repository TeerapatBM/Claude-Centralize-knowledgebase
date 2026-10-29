# Veltrix model providers

Catalog reviewed 2026-10-29. API access, quotas, regions and pricing vary by account; a chat subscription does not imply API credits. The catalog is an explicit allowlist rather than an automatic model downloader.

Ollama defaults to the installed `qwen3:4b-instruct-2507-q4_K_M` on the 8-core, 16 GB RAM CPU server without GPU. `qwen3:1.7b`, `gemma3:1b` and `qwen2.5-coder:3b` are optional manual installations. CPU latency depends on available memory and context length.

Cloud requests require explicit user consent in the caller and send the question, selected company evidence and bounded chat history to the selected external provider. Keys belong in request headers, never URLs. Do not log keys or request payloads. OpenAI requests set `store:false`; this is not a claim about every provider's retention policy. Google free-tier data may be used to improve its products; review provider terms before sending company data.

`answerCloud(input, send = fetch)` is runtime neutral and returns `{ answer, model, provider }`. It supports OpenAI Responses, Anthropic Messages, Google generateContent, and Groq/DeepSeek/xAI chat completions. It uses only fixed official endpoints, refuses redirects, validates the provider/model pair, limits history to eight messages of 6,000 characters and evidence to eight excerpts of 5,000 characters, and aborts requests after 90 seconds. The caller must authorize evidence access and enforce total request bounds. Company facts must cite supplied evidence numbers; general advice must be distinguished from company facts. Documents/history are explicitly untrusted. Model instructions are a safeguard, not an authorization boundary.

Provider response bodies and transport errors are never forwarded to users. Status-based errors cover credentials/access, quota/rate limits, rejected requests and unavailable service. Empty or malformed successful responses fail. Tests inject mock fetch; no paid/live generation calls are required.

Primary references:

- [OpenAI models](https://developers.openai.com/api/docs/models) and [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create): GPT-6 Astra, GPT-6.1 Sol/Terra and GPT-6 Luna.
- [Anthropic models](https://platform.claude.com/docs/en/about-claude/models/overview) and [Messages](https://platform.claude.com/docs/en/api/messages): Claude Opus/Sonnet/Haiku 5.5.
- [Google model pricing](https://ai.google.dev/gemini-api/docs/pricing): Gemini 4 Argon is paid; Gemini 3.8 Flash and 3.5 Flash-Lite have limited free tiers. [generateContent reference](https://ai.google.dev/api/generate-content).
- [Groq supported models](https://console.groq.com/docs/models): `openai/gpt-oss-120b` and `openai/gpt-oss-20b`. Llama 3.1/3.3 are marked Enterprise and omitted. Catalog marks Groq paid conservatively; check account free-plan eligibility and [rate limits](https://console.groq.com/docs/rate-limits). [API reference](https://console.groq.com/docs/api-reference).
- [DeepSeek API](https://api-docs.deepseek.com): `deepseek-flash`, `deepseek-v4-pro`.
- [xAI models](https://docs.x.ai/developers/models): `grok-4.7`; [API reference](https://docs.x.ai/developers/api-reference).
- [Ollama documentation](https://docs.ollama.com).
