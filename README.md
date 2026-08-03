# Free* Intelligence

**`askcline "task"` is one command for Cline's full end-to-end agent harness.**

The original field report showed why a bare model completion is not enough: a leading false premise can produce fluent, unsupported history. The current CLI has one execution architecture only:

```text
askcline "task"
  -> official Cline CLI
  -> workspace context and project rules
  -> tools and observations
  -> edits and commands
  -> validation requests and retries
  -> reported checks and final diff
```

There is no direct Chat Completions client in this repository. Authentication, model/provider configuration, streaming, sessions, tools, and the agent loop are delegated to Cline.

## Install

```bash
cline auth
mkdir -p "$HOME/.local/bin"
curl -fsSL https://zozo123.github.io/free-intelligence/public/askcline -o "$HOME/.local/bin/askcline"
chmod +x "$HOME/.local/bin/askcline"
export PATH="$HOME/.local/bin:$PATH"
askcline doctor
```

## One command

Run it inside the repository you want Cline to own end-to-end:

```bash
cd my-repository
askcline "inspect the repo, implement the issue, run every relevant check, fix failures, and leave it ready to merge"
```

The default mode uses Cline Act mode with tool auto-approval, high reasoning effort, five consecutive-mistake retries, no artificial timeout, project rules, and an explicit inspect -> implement -> validate -> retry -> review -> summarize contract.

**Autonomy warning:** the default agent path uses `--auto-approve true`. It can edit files and run commands. The deny policy is a guardrail, not a sandbox. Use a clean branch, review the diff, or set `ASKCLINE_AUTO_APPROVE=false`.

## Modes

Every mode below invokes the official Cline CLI harness:

```bash
askcline                                  # interactive Cline in this workspace
askcline agent "fix the tests"            # explicit autonomous agent mode
askcline plan "design the migration"      # Cline Plan mode
askcline verify "did this happen?"        # read-only Plan mode + evidence contract
askcline text "summarize this document"   # read-only Plan mode + direct-answer contract
askcline raw "legacy prompt"              # deprecated alias for text; still Cline Plan mode
askcline doctor                           # official Cline diagnostics
```

`raw` remains only as a compatibility alias. It no longer performs an HTTP request and does not require a separate API key. `plan`, `verify`, `text`, and `raw` are routed through Cline Plan mode so autonomous edits are reserved for the default agent path.

## Configuration

```bash
ASKCLINE_AUTO_APPROVE=false askcline "review only"
ASKCLINE_JSON=true askcline "list the TODOs"
CLINE_MODEL=provider/model askcline "run the task"
CLINE_PROVIDER=cline askcline "run the task"
CLINE_THINKING=xhigh askcline "solve the difficult issue"
CLINE_TIMEOUT=600 askcline "finish within ten minutes"
```

The wrapper sets a narrow deny policy for catastrophic host and force-push commands unless `ASKCLINE_UNRESTRICTED=true` is explicitly supplied.

## Verified Cline contract

The implementation follows the current official CLI contract:

- prompts start in Act mode;
- `--auto-approve` controls unattended tool execution;
- `--cwd` selects the workspace;
- `--thinking` controls reasoning effort;
- `--retries` controls consecutive-mistake tolerance;
- `--json` produces NDJSON events;
- `--plan` selects Plan mode;
- `CLINE_COMMAND_PERMISSIONS` restricts shell commands;
- `cline doctor` performs official diagnostics.

The finish-line prompt is a behavioral contract, not a proof system. Review the reported commands, test output, and final diff before publishing.

## Validation

```bash
npm test
bash -n public/askcline
```

The deterministic suite verifies:

- plain tasks dispatch to the autonomous Cline harness;
- plan, verify, text, raw-compatibility, interactive, and doctor paths all invoke `cline`;
- verify, text, and raw compatibility paths include `--plan` and disable auto-approval;
- the finish-line task contract and safety overrides are preserved;
- no source file contains a direct Cline API client or private-token access;
- the public site remains static and never accepts credentials.

GitHub Actions run the suite on Ubuntu and macOS and run ShellCheck on Linux.

## Field report

The GitHub Pages site preserves the three fictional-premise captures and the 60-second film as historical evidence of the old one-shot experiment. The downloadable command itself is harness-only.

```bash
python3 -m http.server 8000
```

Free describes the price. The harness determines the behavior. Evidence determines whether the result is ready.
