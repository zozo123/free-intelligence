# Free* Intelligence

**The same model behaves very differently with and without a harness.**

This repository is both a static field report about confident false-premise completion and a small, testable CLI that makes the execution boundary explicit:

```text
raw prompt  -> Cline Chat Completions API -> text
agent task  -> Cline CLI harness -> tools -> observations -> iterations -> result
verify fact -> Cline CLI harness + evidence/abstention contract -> supported answer or refusal
```

A model endpoint is not an agent, retrieval system, verifier, or evaluation harness.

## Install

Install and authenticate the official Cline CLI for `agent`, `verify`, and `doctor` modes. Create a Cline API key for `raw` mode.

```bash
mkdir -p "$HOME/.local/bin"
curl -fsSL https://zozo123.github.io/free-intelligence/public/askcline -o "$HOME/.local/bin/askcline"
chmod +x "$HOME/.local/bin/askcline"
export PATH="$HOME/.local/bin:$PATH"
```

## Use

Raw completion for clean shell pipelines:

```bash
export CLINE_API_KEY="..."
askcline raw "Summarize this:" "$(cat notes.txt)"
```

Full Cline coding-agent harness:

```bash
askcline agent "Inspect this repository, run the tests, fix failures, and explain the diff"
```

Agent mode defaults to `--auto-approve false`. Enable approval only inside a controlled workspace.

Evidence-oriented verification:

```bash
askcline verify "Who signed the Reykjavik Moon Cheese Accord?"
```

Verification mode asks Cline to disambiguate entities, retrieve evidence, cite what it inspected, separate inference, and abstain when evidence is insufficient. It also installs a restrictive command policy and tells the agent not to modify files.

Check the setup:

```bash
askcline doctor
```

## What changed in v0.2

- `raw`: supported `CLINE_API_KEY` authentication, current OpenAI-compatible response parsing, migration compatibility, retry handling, clean stdout/stderr, and nonzero failures.
- `agent`: delegates to the official Cline CLI harness with JSON traces, workspace context, timeout, model selection, and safe approval defaults.
- `verify`: uses the harness with an evidence and abstention contract plus restrictive command permissions.
- `doctor`: checks local dependencies and configuration.
- Deterministic tests cover API parsing, failures, private-token avoidance, and harness delegation.
- Cross-platform GitHub Actions run the static tests, wrapper tests, Bash validation, and ShellCheck.
- `.cline/rules/harness.md` preserves the architecture when Cline works on its own repository.
- `evals/cases.jsonl` seeds repeated evaluations for false premises, ambiguous identity, transformations, and repository repair.

## Evaluation

```bash
npm test
```

The tests verify:

- current and legacy API response parsing;
- errors never becoming successful stdout answers;
- explicit API-key usage rather than private Cline token scraping;
- safe delegation to the full Cline harness;
- Bash syntax and the static GitHub Pages exhibit.

## Boundaries

- `raw` does not browse, execute tools, inspect a repository, verify claims, or continue a tool loop.
- `agent` can execute tools; keep approval disabled unless the workspace is isolated and the task is understood.
- `verify` improves process but cannot guarantee that a source is correct or complete.
- The static GitHub Pages site never accepts credentials.
- Fluent output is not evidence by itself.

## Development

```bash
npm test
python3 -m http.server 8000
```

To edit or render the film:

```bash
cd free-intelligence-film
npm install
npm run dev
npx remotion render FreeIntelligenceReport out/free-intelligence-report.mp4
```

Free describes the price. The harness determines much of the behavior. Neither replaces verification.
