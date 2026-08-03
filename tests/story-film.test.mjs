import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the Remotion source matches the current product architecture", async () => {
  const source = await readFile(new URL("free-intelligence-film/src/Composition.tsx", root), "utf8");
  assert.match(source, /THE MODEL KNEW/);
  assert.match(source, /FROM <span style=\{\{color: INK\}\}>ANSWER<\/span>/);
  assert.match(source, /INTELLIGENCE AS/);
  assert.match(source, /MODELS PROPOSE/);
  assert.match(source, /HARNESSES ACT/);
  assert.match(source, /EVIDENCE DECIDES/);
  assert.match(source, /Not a sandbox/);
  assert.match(source, /MODEL CONFIG NOT PRESERVED/);
  assert.doesNotMatch(source, /Uses your authenticated local token|ONE ANSWER OUT|0¢ PER ANSWER/);
});

test("the film is exactly 70 seconds and shares one visual source with poster and OG", async () => {
  const source = await readFile(new URL("free-intelligence-film/src/Composition.tsx", root), "utf8");
  assert.match(source, /const FPS = 30/);
  assert.match(source, /const DURATION = 2100/);
  assert.match(source, /id="FreeIntelligenceReport"/);
  assert.match(source, /id="FreeIntelligencePoster"/);
  assert.match(source, /id="FreeIntelligenceOg"/);
});

test("the film package strips nondeterministic MP4 metadata", async () => {
  const pkg = JSON.parse(await readFile(new URL("free-intelligence-film/package.json", root), "utf8"));
  assert.match(pkg.scripts["normalize:film"], /map_metadata -1/);
  assert.match(pkg.scripts["normalize:film"], /map_chapters -1/);
  assert.match(pkg.scripts["normalize:film"], /fflags \+bitexact/);
  assert.match(pkg.scripts["render:all"], /normalize:film/);
});

test("the committed media manifest identifies the canonical render", async () => {
  const manifest = JSON.parse(await readFile(new URL("public/media-manifest.json", root), "utf8"));
  assert.equal(manifest.story, "field-note-003");
  assert.equal(manifest.duration_seconds, 70);
  assert.match(manifest.video_sha256, /^[a-f0-9]{64}$/);
  assert.match(manifest.poster_sha256, /^[a-f0-9]{64}$/);
  assert.match(manifest.og_sha256, /^[a-f0-9]{64}$/);
  assert.equal(manifest.source, "free-intelligence-film/src/Composition.tsx");
  assert.match(manifest.normalization, /metadata stripped/);
});

test("the main CI workflow renders, verifies, and proves byte reproducibility", async () => {
  const workflow = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");
  assert.match(workflow, /render-film:/);
  assert.match(workflow, /apt-get install -y ffmpeg/);
  assert.match(workflow, /SOURCE_DATE_EPOCH: 0/);
  assert.match(workflow, /npm run render:all/);
  assert.match(workflow, /ffprobe/);
  assert.match(workflow, /duration.*>= 69\.9.*<= 70\.1/);
  assert.match(workflow, /media-manifest\.json/);
  assert.match(workflow, /Prove committed media is reproducible/);
  assert.match(workflow, /git diff --exit-code/);
  assert.match(workflow, /git push origin/);
  assert.match(workflow, /\[rendered film\]/);
});
