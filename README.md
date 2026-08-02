# Free* Intelligence

A static GitHub Pages field report about `askcline`: a tiny Bash wrapper that sends a one-shot prompt to Cline’s free-model chat endpoint and prints only the answer to stdout.

Field Note 002 uses three intentionally fictional prompts: the Reykjavik Moon Cheese Accord, Dr. Percival Crumb’s left-handed toaster, and the International Bureau of Suspicious Sandwiches. The displayed answers were captured from the real wrapper, unedited. They show how readily a leading false premise can become polished, source-free history.

## What is included

- A no-install, static evidence exhibit that transparently replays the three captured answers.
- The downloadable `askcline` Bash wrapper.
- A 60-second Remotion report with an original non-vocal score, sound design, and editorial newsprint motion graphics.
- A complete installation guide, terminal examples, and the one-line prompt-to-stdout mechanism.
- A practical explanation of the failure mode: leading premise, no retrieval, no source contract, and fluent specificity.

The public site intentionally does not accept Cline credentials. GitHub Pages has no private server, and an access token should never be embedded in a static site.

## GitHub Pages

The deployable site is the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `public/free-intelligence-report.mp4`
- `public/film-poster.png`
- `public/og.png`
- `public/askcline`

GitHub Pages publishes directly from the `main` branch root.

## How `askcline` works

1. Joins the command-line arguments into one prompt.
2. Reads the access token from an existing authenticated Cline CLI session.
3. Sends one OpenAI-compatible chat-completion request to the selected free model.
4. Prints only the returned message to stdout, keeping shell pipelines clean.
5. If the token has expired, performs a tiny Cline run to refresh it and retries once.

This makes it useful for low-stakes transformations such as drafts, summaries of supplied text, brainstorming, and code sketches. It does not add search, citations, identity resolution, or fact checking.

## Install `askcline`

Authenticate the Cline CLI once:

```bash
cline auth cline
```

Install the wrapper:

```bash
mkdir -p "$HOME/.local/bin"
curl -fsSL https://zozo123.github.io/free-intelligence/public/askcline -o "$HOME/.local/bin/askcline"
chmod +x "$HOME/.local/bin/askcline"
export PATH="$HOME/.local/bin:$PATH"
```

Then use it from any shell:

```bash
askcline "What is the capital of France? One word."
askcline "Summarize this:" "$(cat notes.txt)" | pbcopy
```

Requires the authenticated Cline CLI, `curl`, `jq`, and `python3`.

## Preview the Pages site locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Edit or render the film

```bash
cd free-intelligence-film
npm install
npm run dev
npx remotion render FreeIntelligenceReport out/free-intelligence-report.mp4
```

The score is deterministic and can be regenerated with:

```bash
node scripts/generate-score.mjs public/newsroom-score.wav
```
