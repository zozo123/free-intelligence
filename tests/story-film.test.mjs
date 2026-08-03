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

test("the film package renders deterministic timeline checkpoints", async () => {
  const pkg = JSON.parse(await readFile(new URL("free-intelligence-film/package.json", root), "utf8"));
  assert.match(pkg.scripts["normalize:film"], /remotion ffmpeg/);
  assert.match(pkg.scripts["normalize:film"], /map_metadata -1/);
  assert.match(pkg.scripts["render:checkpoints"], /--frame=90/);
  assert.match(pkg.scripts["render:checkpoints"], /--frame=540/);
  assert.match(pkg.scripts["render:checkpoints"], /--frame=990/);
  assert.match(pkg.scripts["render:checkpoints"], /--frame=2010/);
  assert.match(pkg.scripts["render:all"], /render:checkpoints/);
});

test("the current committed media manifest identifies an audited render", async () => {
  const manifest = JSON.parse(await readFile(new URL("public/media-manifest.json", root), "utf8"));
  assert.equal(manifest.story, "field-note-003");
  assert.equal(manifest.duration_seconds, 70);
  assert.equal(manifest.source, "free-intelligence-film/src/Composition.tsx");
});

test("the main CI workflow uses semantic movie checks and deterministic images", async () => {
  const workflow = await readFile(new URL(".github/workflows/ci.yml", root), "utf8");
  assert.match(workflow, /render-film:/);
  assert.match(workflow, /node_modules\/\.bin\/remotion/);
  assert.match(workflow, /remotion.*ffprobe|\$REMOTION ffprobe/);
  assert.match(workflow, /video_codec/);
  assert.match(workflow, /frame_rate/);
  assert.match(workflow, /audio_sample_rate/);
  assert.match(workflow, /frame-0090\.png/);
  assert.match(workflow, /semantic MP4 properties plus deterministic Remotion still checkpoints/);
  assert.match(workflow, /git diff --exit-code -- public\/film-poster\.png public\/og\.png public\/checkpoints public\/media-manifest\.json/);
  assert.doesNotMatch(workflow, /git diff --exit-code -- public\/free-intelligence-report\.mp4/);
  assert.match(workflow, /git push origin/);
  assert.match(workflow, /\[rendered film\]/);
});
