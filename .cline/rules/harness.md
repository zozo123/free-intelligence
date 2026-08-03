# Repository operating contract

`askcline "task"` is the product: one command into Cline's full end-to-end agent harness.

- Every user-facing mode must dispatch to the official Cline CLI. Do not add or restore a direct Chat Completions HTTP client.
- A plain task must inspect, implement, validate, diagnose failures, retry, review the diff, and summarize the finished state.
- `raw` is only a deprecated compatibility alias for the harness-backed `text` mode.
- Delegate authentication, provider/model configuration, streaming, sessions, tools, and context management to Cline.
- Never read or parse private Cline session credentials and never collect credentials in the static site.
- Agent mode defaults to autonomous execution, high reasoning, multiple retries, and no artificial timeout. Keep a narrow catastrophic-command deny policy and make safer overrides explicit.
- Never claim tests, lint, type checks, builds, citations, or rendered media passed unless they were actually produced and inspected.
- Preserve unrelated user changes and avoid expanding scope silently.
- Verification mode must disambiguate entities, inspect evidence, cite inspected sources, distinguish inference, and abstain when evidence is insufficient.
- Every behavior change to `public/askcline` requires deterministic tests proving all modes still invoke `cline`.

## Story and media contract

- The public thesis is: models propose, harnesses act, evidence decides, humans remain accountable.
- Keep the historical one-shot receipts clearly separate from the current harness implementation.
- State that the exact historical model configuration was not preserved; call the receipts demonstrations, not a reproducible benchmark.
- Never imply that a harness guarantees correctness, that auto-approved execution is sandboxed, or that every model run costs $0.
- The wrapper is free; provider and model charges may vary.
- Keep `index.html`, `README.md`, the Remotion source, poster, OG card, and rendered film narratively consistent.
- Rendered media must be generated from `free-intelligence-film/src/Composition.tsx`, validated in CI, and accompanied by `public/media-manifest.json`.
- Do not require byte-identical lossy MP4 encodes. Verify stable movie properties and compare deterministic Remotion still checkpoints from the actual timeline byte-for-byte.
