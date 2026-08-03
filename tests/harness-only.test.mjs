import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function absent(path) {
  await assert.rejects(access(new URL(path, root)));
}

test("all executable askcline modes are harness-backed", async () => {
  const source = await readFile(new URL("public/askcline", root), "utf8");
  assert.match(source, /exec cline/);
  assert.match(source, /raw\).*text_mode/);
  assert.match(source, /\*\) agent_mode/);
  assert.doesNotMatch(source, /api\.cline\.bot|CLINE_API_KEY|providers\.json|accessToken/);
  assert.doesNotMatch(source, /\bcurl\b|\bjq\b/);
});

test("the obsolete browser API and credential client are gone", async () => {
  await Promise.all([
    absent("app/api/ask/route.ts"),
    absent("app/AskLab.tsx"),
    absent("app/page.tsx"),
    absent("app/layout.tsx"),
    absent("app/globals.css"),
    absent("app/InstallCommand.tsx"),
    absent("app/chatgpt-auth.ts"),
  ]);
});

test("documentation and the public site describe one harness architecture", async () => {
  const [readme, html] = await Promise.all([
    readFile(new URL("README.md", root), "utf8"),
    readFile(new URL("index.html", root), "utf8"),
  ]);
  assert.match(readme, /There is no direct Chat Completions client/);
  assert.match(html, /NO DIRECT MODEL HTTP CLIENT/);
  assert.doesNotMatch(readme, /export CLINE_API_KEY|Raw API calls require/);
  assert.doesNotMatch(html, /temporary Cline token|\/api\/ask/i);
});

test("the root package contains no dormant application runtime", async () => {
  const pkg = JSON.parse(await readFile(new URL("package.json", root), "utf8"));
  assert.equal(pkg.version, "1.1.0");
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.deepEqual(pkg.devDependencies ?? {}, {});
  assert.deepEqual(Object.keys(pkg.scripts), ["test"]);
});
