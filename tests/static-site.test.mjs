import assert from "node:assert/strict";
import {access, readFile, stat} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("GitHub Pages entrypoint has the complete and accurate field report", async () => {
  const html = await readFile(new URL("index.html", root), "utf8");
  assert.match(html, /Free\* Intelligence/);
  assert.match(html, /THINGS THAT <span>NEVER HAPPENED/);
  assert.match(html, /Sixty seconds/);
  assert.match(html, /INSTALL ASKCLINE/);
  assert.match(html, /cline auth<\/code>/);
  assert.match(html, /False premise in/);
  assert.match(html, /READ-ONLY MODES ARE ENFORCED/);
  assert.match(html, /AUTONOMY WARNING/);
  assert.match(html, /not a sandbox/i);
  assert.match(html, /human review/i);
  assert.match(html, /public\/free-intelligence-report\.mp4/);
  assert.match(html, /zozo123\.github\.io\/free-intelligence/);
  assert.doesNotMatch(html, /chatgpt\.site|temporary Cline token|\/api\/ask/i);
});

test("the static lab is transparent and contains all three fictional-subject receipts", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");
  assert.match(script, /Reykjavik Moon Cheese Accord/);
  assert.match(script, /launched a baguette into the crowd/);
  assert.match(script, /International Bureau of Suspicious Sandwiches/);
  assert.match(script, /Dr\. Alistair Crumbworthy/);
  assert.doesNotMatch(script, /fetch\(|Authorization|Bearer|api\.cline\.bot/);
});

test("the installer stays local and links to the public wrapper", async () => {
  const script = await readFile(new URL("app.js", root), "utf8");
  assert.match(script, /\.local\/bin\/askcline/);
  assert.match(script, /public\/askcline/);
  assert.match(script, /navigator\.clipboard/);
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
