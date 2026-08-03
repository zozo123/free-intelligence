import assert from "node:assert/strict";
import {chmod, mkdtemp, readFile, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {join, resolve} from "node:path";
import {spawnSync} from "node:child_process";
import test from "node:test";

const script = resolve("public/askcline");

async function fakeCline() {
  const dir = await mkdtemp(join(tmpdir(), "askcline-cline-"));
  const cline = join(dir, "cline");
  await writeFile(cline, '#!/usr/bin/env bash\nprintf "%s\\n" "$*"\n');
  await chmod(cline, 0o755);
  return `${dir}:${process.env.PATH}`;
}

function run(args, env = {}) {
  return spawnSync("bash", [script, ...args], {
    encoding: "utf8",
    env: {...process.env, CLINE_MODEL: "", CLINE_PROVIDER: "", ...env},
  });
}

test("script parses as valid bash", () => {
  const result = spawnSync("bash", ["-n", script], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr);
});

test("a plain task invokes the full autonomous Cline harness", async () => {
  const PATH = await fakeCline();
  const result = run(["inspect", "repo"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--cwd/);
  assert.match(result.stdout, /--auto-approve true/);
  assert.match(result.stdout, /--thinking high/);
  assert.match(result.stdout, /--retries 5/);
  assert.match(result.stdout, /Run the relevant formatter, linter, type checker, tests, and build/);
  assert.match(result.stdout, /USER TASK:\ninspect repo/);
});

test("agent alias and JSON safety override are honored", async () => {
  const PATH = await fakeCline();
  const result = run(["agent", "fix", "it"], {PATH, ASKCLINE_AUTO_APPROVE: "false", ASKCLINE_JSON: "true"});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--auto-approve false/);
  assert.match(result.stdout, /--json/);
});

test("plan and verify use Cline Plan mode", async () => {
  const PATH = await fakeCline();
  const plan = run(["plan", "design", "it"], {PATH});
  const verify = run(["verify", "did", "it", "happen"], {PATH});
  assert.equal(plan.status, 0, plan.stderr);
  assert.match(plan.stdout, /--plan/);
  assert.equal(verify.status, 0, verify.stderr);
  assert.match(verify.stdout, /--plan/);
  assert.match(verify.stdout, /--auto-approve false/);
  assert.match(verify.stdout, /read-only verification mode/);
});

test("legacy raw command is routed through read-only Cline Plan mode", async () => {
  const PATH = await fakeCline();
  const result = run(["raw", "capital?"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /raw is deprecated/);
  assert.match(result.stdout, /--plan/);
  assert.match(result.stdout, /Cline harness in read-only Plan mode/);
});

test("text mode is harness-backed and enforced read-only", async () => {
  const PATH = await fakeCline();
  const result = run(["text", "summarize", "this"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--auto-approve false/);
  assert.match(result.stdout, /--plan/);
  assert.match(result.stdout, /Do not modify repository files/);
});

test("no arguments opens interactive Cline in the current workspace", async () => {
  const PATH = await fakeCline();
  const result = run([], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--cwd/);
});

test("doctor delegates to the official Cline doctor", async () => {
  const PATH = await fakeCline();
  const result = run(["doctor"], {PATH});
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "doctor");
});

test("there is no direct Cline HTTP client or private-token access", async () => {
  const source = await readFile(script, "utf8");
  assert.doesNotMatch(source, /api\.cline\.bot|CLINE_API_KEY|providers\.json|accessToken/);
  assert.doesNotMatch(source, /\bcurl\b|\bjq\b/);
  assert.match(source, /raw\).*text_mode/);
  assert.match(source, /\*\) agent_mode/);
  assert.match(source, /git push --force-with-lease/);
});
