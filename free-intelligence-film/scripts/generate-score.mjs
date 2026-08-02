import {mkdirSync, writeFileSync} from "node:fs";
import {dirname, resolve} from "node:path";

const SAMPLE_RATE = 48_000;
const DURATION = 60;
const CHANNELS = 2;
const frames = SAMPLE_RATE * DURATION;
const left = new Float32Array(frames);
const right = new Float32Array(frames);

let seed = 0x5eed1234;
const random = () => {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return ((seed >>> 0) / 0xffffffff) * 2 - 1;
};

const panGains = (pan) => [Math.sqrt((1 - pan) / 2), Math.sqrt((1 + pan) / 2)];

const add = (time, duration, amplitude, pan, sample) => {
  const start = Math.max(0, Math.floor(time * SAMPLE_RATE));
  const end = Math.min(frames, Math.floor((time + duration) * SAMPLE_RATE));
  const [gainL, gainR] = panGains(pan);
  for (let i = start; i < end; i++) {
    const t = (i - start) / SAMPLE_RATE;
    const progress = t / duration;
    const value = sample(t, progress) * amplitude;
    left[i] += value * gainL;
    right[i] += value * gainR;
  }
};

const envelope = (progress, attack = 0.02, release = 0.25) => {
  const inGain = Math.min(1, progress / attack);
  const outGain = Math.min(1, (1 - progress) / release);
  return Math.max(0, Math.min(inGain, outGain));
};

const tone = ({time, duration, frequency, amplitude, pan = 0, kind = "sine"}) => {
  add(time, duration, amplitude, pan, (t, progress) => {
    const phase = 2 * Math.PI * frequency * t;
    const wave = kind === "triangle"
      ? (2 / Math.PI) * Math.asin(Math.sin(phase))
      : kind === "mallet"
        ? Math.sin(phase) + 0.34 * Math.sin(phase * 2.01) + 0.16 * Math.sin(phase * 3.98)
        : Math.sin(phase);
    return wave * envelope(progress, kind === "mallet" ? 0.005 : 0.035, kind === "mallet" ? 0.72 : 0.3) * (kind === "mallet" ? Math.exp(-3.1 * progress) : 1);
  });
};

const kick = (time, amplitude = 0.52) => {
  add(time, 0.28, amplitude, 0, (t, progress) => {
    const frequency = 95 * Math.pow(0.47, progress) + 39;
    return Math.sin(2 * Math.PI * frequency * t) * Math.exp(-9 * progress);
  });
};

const snare = (time, amplitude = 0.24) => {
  add(time, 0.2, amplitude, 0.08, (t, progress) => {
    const body = Math.sin(2 * Math.PI * 185 * t) * 0.32;
    return (random() * 0.68 + body) * Math.exp(-12 * progress);
  });
};

const hat = (time, amplitude = 0.075, pan = 0) => {
  add(time, 0.055, amplitude, pan, (_t, progress) => random() * Math.exp(-24 * progress));
};

const click = (time, amplitude = 0.12) => {
  add(time, 0.035, amplitude, -0.15, (t, progress) => Math.sin(2 * Math.PI * 1450 * t) * Math.exp(-35 * progress));
};

const hit = (time, root = 73.42, amplitude = 0.26) => {
  kick(time, amplitude * 1.45);
  [1, 1.5, 2, 3].forEach((ratio, index) => {
    tone({time, duration: 0.7 + index * 0.08, frequency: root * ratio, amplitude: amplitude / (index + 1), pan: index % 2 ? 0.24 : -0.24, kind: "mallet"});
  });
};

const beat = 0.5;
const bassPattern = [38, 38, 41, 43, 38, 38, 36, 33];
const melodyPattern = [74, 77, 81, 77, 84, 81, 77, 74];
const midi = (note) => 440 * Math.pow(2, (note - 69) / 12);

// A dry editorial clock opens the piece. It returns during the fact-check beat.
for (let second = 0; second < DURATION; second++) {
  click(second + 0.02, second < 5 || (second >= 50 && second < 55) ? 0.15 : 0.045);
}

// Main 120 BPM newsroom groove, deliberately handmade and deterministic.
for (let b = 0; b < DURATION / beat; b++) {
  const time = b * beat;
  const full = time >= 5 && time < 50;
  const finale = time >= 55;
  const active = full || finale;
  if (!active) continue;

  if (b % 2 === 0) kick(time, finale ? 0.48 : 0.4);
  if (b % 4 === 2) snare(time, finale ? 0.29 : 0.22);
  hat(time, 0.07, b % 2 ? 0.22 : -0.22);
  hat(time + beat / 2, 0.045, b % 2 ? -0.3 : 0.3);

  const note = bassPattern[b % bassPattern.length];
  tone({time, duration: beat * 0.92, frequency: midi(note), amplitude: 0.15, pan: -0.12, kind: "triangle"});

  if (b % 2 === 0) {
    const melody = melodyPattern[(b / 2) % melodyPattern.length];
    tone({time: time + 0.04, duration: 0.42, frequency: midi(melody), amplitude: finale ? 0.12 : 0.09, pan: 0.28, kind: "mallet"});
  }
}

// Scene-cut stings aligned to the on-screen newspaper slams.
[0, 5, 12, 14, 26, 38, 50, 55, 58.4].forEach((time, index) => {
  hit(time, index === 8 ? 73.42 : 65.41, index === 0 || index === 8 ? 0.35 : 0.23);
});

// A small ascending sign-off motif.
[62, 65, 69, 74].forEach((note, index) => {
  tone({time: 57.7 + index * 0.24, duration: 1.3, frequency: midi(note), amplitude: 0.14, pan: index % 2 ? 0.2 : -0.2, kind: "mallet"});
});

// Gentle limiter and WAV encoding.
const wav = Buffer.alloc(44 + frames * CHANNELS * 2);
wav.write("RIFF", 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(CHANNELS, 22);
wav.writeUInt32LE(SAMPLE_RATE, 24);
wav.writeUInt32LE(SAMPLE_RATE * CHANNELS * 2, 28);
wav.writeUInt16LE(CHANNELS * 2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(frames * CHANNELS * 2, 40);

for (let i = 0; i < frames; i++) {
  const softClip = (value) => Math.tanh(value * 1.3) * 0.82;
  wav.writeInt16LE(Math.round(softClip(left[i]) * 32767), 44 + i * 4);
  wav.writeInt16LE(Math.round(softClip(right[i]) * 32767), 46 + i * 4);
}

const output = resolve(process.argv[2] ?? "public/newsroom-score.wav");
mkdirSync(dirname(output), {recursive: true});
writeFileSync(output, wav);
console.log(`Wrote ${output} (${DURATION}s, ${SAMPLE_RATE} Hz stereo)`);
