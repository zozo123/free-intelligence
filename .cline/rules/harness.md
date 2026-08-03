# Repository operating contract

`askcline "task"` is the product: one command into Cline's full end-to-end agent harness.

- Every user-facing mode must dispatch to the official Cline CLI. Do not add or restore a direct Chat Completions HTTP client.
- A plain task must inspect, implement, validate, diagnose failures, retry, review the diff, and summarize the finished state.
- `raw` is only a deprecated compatibility alias for the harness-backed `text` mode.
- Delegate authentication, provider/model configuration, streaming, sessions, tools, and context management to Cline.
- Never read or parse private Cline session credentials and never collect credentials in the static site.
- Agent mode defaults to autonomous execution, high reasoning, multiple retries, and no artificial timeout. Keep a narrow catastrophic-command deny policy and make safer overrides explicit.
- Never claim tests, lint, type checks, or builds passed unless they were actually run.
- Preserve unrelated user changes and avoid expanding scope silently.
- Verification mode must disambiguate entities, inspect evidence, cite inspected sources, distinguish inference, and abstain when evidence is insufficient.
- Every behavior change to `public/askcline` requires deterministic tests proving all modes still invoke `cline`.
