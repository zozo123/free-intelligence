# Free* Intelligence

A static GitHub Pages field report about `askcline`: a tiny Bash wrapper that sends a one-shot prompt to Cline’s free-model chat endpoint and prints only the answer to stdout.

The experiment began with three identical runs:

```bash
askcline "who is yossi eliaz?"
```

The model returned three mutually incompatible biographies—a luxury property developer, a Jewish music star, and an East Jerusalem power broker—with the same polished confidence each time. The wrapper did exactly what it was built to do. The mistake was treating a fluent, ungrounded completion as evidence.

## What is included

- A no-install, static evidence lab that transparently replays the three captured answers.
- An honest abstention for other prompts instead of a simulated “live” response.
- The downloadable `askcline` Bash wrapper.
- A 72-second Remotion report with voiceover, captions, sound design, and editorial newsprint motion graphics.
- A practical explanation of the failure mode: ambiguous identity, no retrieval, no source contract, and fresh sampling.

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
