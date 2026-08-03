# Repository operating contract

This project compares a raw model completion with Cline's full agent harness.

- Preserve the distinction between `raw`, `agent`, and `verify` modes.
- Never read or parse private Cline session credentials. Raw API calls use `CLINE_API_KEY`; agent runs delegate authentication to the Cline CLI.
- Keep stdout machine-friendly. Answers and JSON traces go to stdout; diagnostics and metadata go to stderr.
- Errors must exit nonzero.
- Agent mode must default to tool auto-approval disabled.
- Verification mode must disambiguate entities, inspect evidence, cite inspected sources, distinguish inference, and abstain when evidence is insufficient.
- Never add credential collection to the static GitHub Pages site.
- Every behavior change to `public/askcline` requires deterministic tests.
