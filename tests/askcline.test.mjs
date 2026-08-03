import assert from "node:assert/strict";
import {chmod, mkdtemp, readFile, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import {spawnSync} from "node:child_process";
import test from "node:test";

const script = resolve("public/askcline");

async function fakePath(response, status = "200") {
  const dir = await mkdtemp(join(tmpdir(), "askcline-test-"));
  const curl = join(dir, "curl");
  await writeFile(curl, `#!/usr/bin/env bash\nset -euo pipefail\nout=''\nwhile [ $# -gt 0 ]; do\n  case "$1" in\n    --output) out="$2"; shift 2 ;;\n    --write-out) shift 2 ;;\n    *) shift ;;\n  esac\ndone\ncat > "$out" <<'JSON'\n${JSON.stringify(response)}\nJSON\nprintf '${status}'\n`);
  await chmod(curl, 0o755);
  return `${dir}:${process.env.PATH}`;
}

async function fakeCline() {
  const dir = await mkdtemp(join(tmpdir(), "askcline-cline-"));
  const cline = join(dir, "cline");
  await writeFile(cline, '#!/usr/bin/env bash\nif [ "${1:-}" = "--version" ]; then echo "1.0.0-test"; exit 0; fi\nprintf "%s\\n" "$*"\n');
  await chmod(cline, 0o755);
  return `${dir}:${process.env.PATH}`;
}

function run(args, env = {}) {
  return spawnSync("bash", [script, ...args], {
    encoding: "utf8",
    env: {...process.env, CLINE_API_KEY: "test-key", CLINE_RAW_MODEL: "test/model", ...env},
  });
}

test("script parses as valid bash", () => {
  const result = spawnSync("bash", ["-n", script], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr);
});

test("raw mode prints only a top-level OpenAI-compatible answer", async () => {
  const PATH = await fakePath({model: "test/model", choices: [{message: {content: "Paris"}}], usage: {prompt_tokens: 3, completion_tokens: 1, cost: 0}});
  const result = run(["raw", "capital?"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "Paris\n");
  assert.equal(result.stderr, "");
});

test("legacy wrapped responses remain readable during migration", async () => {
  const PATH = await fakePath({data: {choices: [{message: {content: "legacy"}}]}});
  const result = run(["raw", "question"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, "legacy\n");
});

test("HTTP failures are nonzero and never become stdout answers", async () => {
  const PATH = await fakePath({error: {message: "bad key"}}, "401");
  const result = run(["raw", "question"], {PATH});
  assert.notEqual(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(result.stderr, /HTTP 401\).*: bad key/);
});

test("raw mode requires an explicit API key", () => {
  const result = run(["raw", "question"], {CLINE_API_KEY: ""});
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /CLINE_API_KEY is required/);
});

test("a plain task invokes the full autonomous Cline harness", async () => {
  const PATH = await fakeCline();
  const result = run(["inspect", "repo"], {PATH, CLINE_MODEL: "", CLINE_PROVIDER: ""});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--cwd/);
  assert.match(result.stdout, /--auto-approve true/);
  assert.match(result.stdout, /--thinking high/);
  assert.match(result.stdout, /--retries 5/);
  assert.doesNotMatch(result.stdout, /--json/);
  assert.match(result.stdout, /Run the relevant formatter, linter, type checker, tests, and build/);
  assert.match(result.stdout, /USER TASK:\ninspect repo/);
});

test("agent alias and safety override are honored", async () => {
  const PATH = await fakeCline();
  const result = run(["agent", "fix", "it"], {PATH, ASKCLINE_AUTO_APPROVE: "false", ASKCLINE_JSON: "true"});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--auto-approve false/);
  assert.match(result.stdout, /--json/);
  assert.match(result.stdout, /USER TASK:\nfix it/);
});

test("no arguments opens the interactive harness in the current workspace", async () => {
  const PATH = await fakeCline();
  const result = run([], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--cwd/);
});

test("repository script never reads private Cline token storage", async () => {
  const source = await readFile(script, "utf8");
  assert.doesNotMatch(source, /providers\.json|accessToken/);
  assert.match(source, /CLINE_API_KEY/);
  assert.match(source, /\*\) agent_mode/);
});
