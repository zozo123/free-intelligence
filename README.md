# Free* Intelligence

**The model was not the product. The loop is.**

Free* Intelligence began as a one-shot experiment: fictional premises went in, polished history came out. The point was never that one particular model was uniquely bad. The point was that a prompt-to-answer architecture had no evidence contract, no observation loop, no permission boundary, and no proof of work.

The project now tells the complete story:

```text
OLD
prompt -> model -> answer

CURRENT
task -> context -> tools -> observations -> checks -> human review
```

`askcline "task"` routes work through the official Cline CLI. Cline supplies authentication, sessions, workspace context, tools, permissions, and the agent loop. The wrapper adds a finish-line contract: inspect, implement, validate, retry, review, and report exactly what happened.

## The thesis

- Models propose.
- Harnesses act.
- Evidence decides.
- Humans remain accountable.

A harness makes consequential work more observable and governable. It does not make generated work automatically correct.

## Install

```bash
cline auth
mkdir -p "$HOME/.local/bin"
curl -fsSL https://zozo123.github.io/free-intelligence/public/askcline -o "$HOME/.local/bin/askcline"
chmod +x "$HOME/.local/bin/askcline"
export PATH="$HOME/.local/bin:$PATH"
askcline doctor
```

Then run from a clean branch:

```bash
askcline "inspect the repo, implement the issue, run every relevant check, fix failures, and leave it ready to merge"
```

## Execution modes

Every executable path uses the official Cline CLI:

```bash
askcline                                  # interactive Cline
askcline agent "fix the tests"            # autonomous Act mode
askcline plan "design the migration"      # read-only Plan mode
askcline verify "did this happen?"        # evidence-oriented Plan mode
askcline text "summarize this document"   # read-only Plan mode
askcline raw "legacy prompt"              # deprecated alias to text mode
askcline doctor                           # official diagnostics
```

The default task path uses auto-approval and can edit files or run commands. The wrapper is not a sandbox. Keep permissions narrow, use a clean branch, and review the final diff and evidence.

## Price truth

The wrapper is free and open source. The model or provider configured in Cline may be free or paid. “Free” describes the original experiment and the wrapper—not a universal per-run price guarantee.

## Historical receipts

The three fictional-premise prompts and outputs were preserved from the original one-shot experiment on **2 August 2026**. The exact model configuration was not preserved. They are useful historical demonstrations, not a reproducible benchmark.

The browser experience is static: it makes no model request and accepts no credentials.

## Site

The GitHub Pages site is published from the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `public/askcline`
- `public/free-intelligence-report.mp4`
- `public/film-poster.png`
- `public/og.png`
- `public/checkpoints/*.png`
- `public/media-manifest.json`

Preview locally:

```bash
python3 -m http.server 8000
```

## Film

The 70-second Remotion film follows four beats:

1. the historical receipt;
2. the architectural failure;
3. the shift from answer to loop;
4. the remaining human responsibility.

Rendering requires Node.js and FFmpeg:

```bash
cd free-intelligence-film
npm ci
npm run lint
npm run render:all
```

Lossy MP4 encoders may produce different container bytes for an equivalent render, so CI does not pretend that byte identity is a meaningful correctness guarantee. Instead, it strictly verifies the movie’s duration, codecs, dimensions, frame rate, and audio rate, and compares deterministic Remotion stills from four points on the actual film timeline byte-for-byte. Poster, social card, checkpoint hashes, and semantic movie properties are recorded in `public/media-manifest.json`.

## Validation

```bash
npm ci
npm test
bash -n public/askcline
cd free-intelligence-film && npm ci && npm run lint
```

CI runs the root tests on Ubuntu and macOS, validates the Bash wrapper, runs ShellCheck on Linux, renders the complete film, and verifies its semantic and visual checkpoints before merge.

Free is a price. Intelligence is a process. Evidence is the standard.
