# Repository operating contract

`askcline "task"` is the product: one command into Cline's full end-to-end agent harness.

- A plain task must dispatch to the official Cline CLI agent, not the raw chat-completions endpoint.
- The default agent loop must inspect, implement, validate, diagnose failures, retry, review the diff, and summarize the finished state.
- The explicit `raw` subcommand remains a stateless completion path for shell pipelines and demonstrations.
- Never read or parse private Cline session credentials. Raw API calls use `CLINE_API_KEY`; agent runs delegate authentication to the Cline CLI.
- Agent mode defaults to autonomous execution, high reasoning, multiple retries, and no artificial timeout. Keep a narrow catastrophic-command deny policy and make safer overrides explicit.
- Never claim tests, lint, type checks, or builds passed unless they were actually run.
- Preserve unrelated user changes and avoid expanding scope silently.
- Verification mode must disambiguate entities, inspect evidence, cite inspected sources, distinguish inference, and abstain when evidence is insufficient.
- Never add credential collection to the static GitHub Pages site.
- Every behavior change to `public/askcline` requires deterministic tests.
