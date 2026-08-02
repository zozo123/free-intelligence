import assert from "node:assert/strict";
import {access, readFile, stat} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages entrypoint has the complete field report", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /Free\* Intelligence/);
  assert.match(html, /The identity machine/);
  assert.match(html, /Three Yossis/);
  assert.match(html, /completing the shape of a biography/);
  assert.match(html, /public\/free-intelligence-report\.mp4/);
  assert.match(html, /zozo123\.github\.io\/free-intelligence/);
  assert.doesNotMatch(html, /chatgpt\.site|temporary Cline token|\/api\/ask/i);
});

test("the static lab is transparent and contains all three evidence editions", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");
  assert.match(script, /REAL ESTATE EDITION/);
  assert.match(script, /SHOWBIZ EDITION/);
  assert.match(script, /GEOPOLITICS EDITION/);
  assert.match(script, /HONEST ABSTENTION/);
  assert.doesNotMatch(script, /fetch\(|Authorization|Bearer|api\.cline\.bot/);
});

test("the report film and share assets ship with the Pages site", async () => {
  const movie = await stat(new URL("public/free-intelligence-report.mp4", root));
  assert.ok(movie.size > 1_000_000);
  await Promise.all([
    access(new URL("public/film-poster.png", root)),
    access(new URL("public/og.png", root)),
    access(new URL("public/askcline", root)),
    access(new URL(".nojekyll", root)),
  ]);
});
