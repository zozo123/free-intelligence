import assert from "node:assert/strict";
import {mkdtemp, readFile, writeFile, chmod} from "node:fs/promises";
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

function run(args, env = {}) {
  return spawnSync("bash", [script, ...args], {
    encoding: "utf8",
    env: {...process.env, CLINE_API_KEY: "test-key", CLINE_MODEL: "test/model", ...env},
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

test("agent mode delegates to Cline's harness with safe defaults", async () => {
  const dir = await mkdtemp(join(tmpdir(), "askcline-cline-"));
  const cline = join(dir, "cline");
  await writeFile(cline, '#!/usr/bin/env bash\nprintf "%s\\n" "$*"\n');
  await chmod(cline, 0o755);
  const result = run(["agent", "inspect", "repo"], {PATH: `${dir}:${process.env.PATH}`});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--json/);
  assert.match(result.stdout, /--auto-approve false/);
  assert.match(result.stdout, /inspect repo/);
});

test("repository script does not read private Cline token storage", async () => {
  const source = await readFile(script, "utf8");
  assert.doesNotMatch(source, /providers\.json|accessToken/);
  assert.match(source, /CLINE_API_KEY/);
});
