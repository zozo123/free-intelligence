import assert from "node:assert/strict";
import {access, readFile} from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const hash = /^[a-f0-9]{64}$/;

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

test("the committed manifest proves semantic video and deterministic visual checkpoints", async () => {
  const manifest = JSON.parse(await readFile(new URL("public/media-manifest.json", root), "utf8"));
  assert.equal(manifest.story, "field-note-003");
  assert.equal(manifest.duration_seconds, 70);
  assert.deepEqual(manifest.video, {
    codec: "h264",
    width: 1920,
    height: 1080,
    frame_rate: "30/1",
    audio_codec: "aac",
    audio_sample_rate: 48000,
  });
  assert.match(manifest.poster_sha256, hash);
  assert.match(manifest.og_sha256, hash);
  assert.deepEqual(Object.keys(manifest.checkpoint_sha256), ["frame_0090", "frame_0540", "frame_0990", "frame_2010"]);
  for (const value of Object.values(manifest.checkpoint_sha256)) assert.match(value, hash);
  assert.equal(manifest.source, "free-intelligence-film/src/Composition.tsx");
  assert.match(manifest.verification, /semantic MP4 properties plus deterministic Remotion still checkpoints/);

  await Promise.all([
    access(new URL("public/checkpoints/frame-0090.png", root)),
    access(new URL("public/checkpoints/frame-0540.png", root)),
    access(new URL("public/checkpoints/frame-0990.png", root)),
    access(new URL("public/checkpoints/frame-2010.png", root)),
  ]);
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
