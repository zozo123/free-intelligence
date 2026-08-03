import assert from "node:assert/strict";
import {access, readFile, stat} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages tells the complete answer-to-loop story", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /THE MODEL[\s\S]*WAS NOT[\s\S]*THE PRODUCT/);
  assert.match(html, /A model can sound right\. A harness has to show its work/);
  assert.match(html, /The failure was[\s\S]*architectural/i);
  assert.match(html, /MODELS PROPOSE/);
  assert.match(html, /HARNESSES ACT/);
  assert.match(html, /EVIDENCE DECIDES/);
  assert.match(html, /HUMANS REMAIN ACCOUNTABLE/);
});

test("the public story is honest about provenance, price, and autonomy", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /exact model configuration was not preserved/i);
  assert.match(html, /historical receipts—not a reproducible benchmark/i);
  assert.match(html, /model and provider charges may vary/i);
  assert.match(html, /This wrapper is not a sandbox/i);
  assert.match(html, /Human review remains mandatory/i);
  assert.doesNotMatch(html, /guaranteed correct|zero cost per answer/i);
});

test("the receipt lab is static, accessible, and contains all three historical captures", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");
  assert.match(script, /Reykjavik Moon Cheese Accord/);
  assert.match(script, /launched a baguette into the crowd/);
  assert.match(script, /International Bureau of Suspicious Sandwiches/);
  assert.match(script, /exact model configuration not preserved/);
  assert.match(script, /showArchitecture\("harness"\)/);
  assert.doesNotMatch(script, /fetch\(|Authorization|Bearer|api\.cline\.bot|CLINE_API_KEY/);
});

test("the installer stays local and links to the harness-only wrapper", async () => {
  const [html, script] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);
  assert.match(html, /cline auth/);
  assert.match(script, /\.local\/bin\/askcline/);
  assert.match(script, /public\/askcline/);
  assert.match(script, /navigator\.clipboard/);
  assert.doesNotMatch(html, /temporary Cline token|\/api\/ask/i);
});

test("the film and share assets ship with GitHub Pages", async () => {
  const movie = await stat(new URL("public/free-intelligence-report.mp4", root));
  assert.ok(movie.size > 1_000_000);
  await Promise.all([
    access(new URL("public/film-poster.png", root)),
    access(new URL("public/og.png", root)),
    access(new URL("public/askcline", root)),
    access(new URL(".nojekyll", root)),
  ]);
});
