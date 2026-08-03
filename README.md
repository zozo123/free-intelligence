# Free* Intelligence

**`askcline "task"` is now one command for Cline's full end-to-end agent harness.**

The original field report showed what happens when a raw model endpoint receives a leading false premise: it can return fluent, unsupported history. Version 1.0 keeps that raw path explicit, but makes the harness the product:

```text
askcline "task"
  -> inspect workspace
  -> use Cline tools
  -> edit and execute
  -> run tests/build
  -> diagnose and retry
  -> review the diff
  -> report the finished result
```

A model call produces text. A harness turns the model into an agent.

## Install

Install and authenticate the official Cline CLI, then install the transparent wrapper:

```bash
cline auth
mkdir -p "$HOME/.local/bin"
curl -fsSL https://zozo123.github.io/free-intelligence/public/askcline -o "$HOME/.local/bin/askcline"
chmod +x "$HOME/.local/bin/askcline"
export PATH="$HOME/.local/bin:$PATH"
```

## One command

Run it from the repository you want Cline to own end-to-end:

```bash
cd my-repository
askcline "inspect the repo, implement the issue, run every relevant check, fix failures, and leave it ready to merge"
```

A plain task is the autonomous agent mode. It defaults to:

- the current workspace;
- Act mode with tool auto-approval enabled;
- high reasoning effort;
- five consecutive-mistake retries;
- no artificial task timeout;
- an explicit inspect -> implement -> validate -> retry -> review -> summarize loop;
- a small deny policy for catastrophic host and force-push commands.

The wrapper does not force a model. It uses the model and provider configured in Cline unless `CLINE_MODEL` or `CLINE_PROVIDER` is supplied.

## Other modes

```bash
# Open Cline interactively in the current directory
askcline

# Same full agent path, written explicitly
askcline agent "fix the tests and finish"

# Investigate without autonomous edits
askcline plan "design the migration"

# Evidence-oriented research and abstention
askcline verify "Did this event actually happen?"

# The old one-shot completion path, now explicit
export CLINE_API_KEY="..."
askcline raw "Summarize this:" "$(cat notes.txt)"

# Validate the installation
askcline doctor
```

Set `ASKCLINE_JSON=true` for Cline NDJSON events. Set `ASKCLINE_AUTO_APPROVE=false` for approval-gated runs. Set `ASKCLINE_UNRESTRICTED=true` only when you intentionally want to bypass the wrapper's catastrophic-command deny policy.

## Why the default changed

The raw endpoint cannot inspect a repository, run a command, observe a failure, edit a file, or continue a tool loop. Cline CLI can. The default command therefore delegates authentication, sessions, tools, rules, hooks, context management, and execution to Cline instead of reimplementing those pieces in Bash.

`raw` remains valuable for low-stakes transformations and clean shell pipelines. It is not the default because it is not agentic.

## Safety boundary

Autonomous execution is powerful. Use a clean branch and a workspace you are prepared to modify. The wrapper blocks a small set of catastrophic commands by default, but it does not sandbox the process or make generated changes correct. Review the diff before publishing.

The wrapper never reads Cline's private token files. Agent runs let the official CLI manage its authentication. Raw API calls require an explicit `CLINE_API_KEY`. The static GitHub Pages site never accepts credentials.

## Validation

```bash
npm test
bash -n public/askcline
```

The deterministic suite covers:

- the autonomous default dispatch;
- full Cline CLI flags and finish-line task contract;
- approval and JSON overrides;
- interactive mode;
- current and legacy raw API responses;
- HTTP failures and nonzero exits;
- clean stdout for raw pipelines;
- absence of private-token scraping.

GitHub Actions run the suite on Ubuntu and macOS and run ShellCheck on Linux.

## Field report

The root GitHub Pages site preserves the original three fictional-premise captures and the 60-second Remotion report. Those receipts demonstrate the explicit `askcline raw` path, not the new agentic default.

```bash
python3 -m http.server 8000
```

To edit or render the film:

```bash
cd free-intelligence-film
npm install
npm run dev
npx remotion render FreeIntelligenceReport out/free-intelligence-report.mp4
```

Free describes the price. The harness determines the behavior. Validation determines whether the result is ready.
