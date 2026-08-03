import {Audio as MediaAudio} from "@remotion/media";
import type {ReactNode} from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const DURATION = 2100;
const INK = "#11110f";
const PAPER = "#eee9de";
const PAPER_BRIGHT = "#faf7ef";
const RED = "#e12b23";
const MUTED = "#777168";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const appear = (frame: number, start: number, duration = 18) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const Stamp = ({children, rotate = -5, size = 28}: {children: ReactNode; rotate?: number; size?: number}) => (
  <div
    style={{
      border: `7px solid ${RED}`,
      color: RED,
      display: "inline-block",
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: size,
      fontWeight: 900,
      letterSpacing: 2,
      lineHeight: 0.93,
      padding: "11px 16px 8px",
      rotate: `${rotate}deg`,
      textAlign: "center",
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const Chrome = ({children, label, dark = false, startAt}: {children: ReactNode; label: string; dark?: boolean; startAt: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = Math.floor((startAt + frame) / fps);
  const foreground = dark ? PAPER_BRIGHT : INK;
  const background = dark ? INK : PAPER;

  return (
    <AbsoluteFill style={{background, color: foreground, fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          backgroundImage: dark
            ? "radial-gradient(rgba(255,255,255,.11) .7px, transparent .7px)"
            : "radial-gradient(rgba(17,17,15,.12) .7px, transparent .7px)",
          backgroundSize: "6px 6px",
          opacity: 0.35,
        }}
      />
      <div
        style={{
          alignItems: "center",
          borderBottom: `3px solid ${foreground}`,
          display: "flex",
          height: 70,
          justifyContent: "space-between",
          left: 72,
          position: "absolute",
          right: 72,
          top: 32,
        }}
      >
        <span style={{fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 900}}>Free* Intelligence</span>
        <span style={{fontSize: 20, fontWeight: 900, letterSpacing: 4}}>FIELD NOTE 003 · ANSWER → LOOP</span>
      </div>
      <AbsoluteFill style={{padding: "128px 78px 138px"}}>{children}</AbsoluteFill>
      <div
        style={{
          alignItems: "center",
          background: dark ? PAPER_BRIGHT : INK,
          bottom: 26,
          color: dark ? INK : PAPER_BRIGHT,
          display: "flex",
          fontSize: 20,
          fontWeight: 900,
          justifyContent: "space-between",
          left: 72,
          letterSpacing: 2.5,
          padding: "13px 17px 11px",
          position: "absolute",
          right: 72,
        }}
      >
        <span>{label}</span>
        <span style={{color: RED}}>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</span>
      </div>
    </AbsoluteFill>
  );
};

const Scene = ({children, duration, label, dark, startAt}: {children: ReactNode; duration: number; label: string; dark?: boolean; startAt: number}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 7, duration - 8, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <Chrome label={label} dark={dark} startAt={startAt}>{children}</Chrome>
    </AbsoluteFill>
  );
};

const ColdOpen = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 28], [90, 0], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const underline = interpolate(frame, [85, 115], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: INK, color: PAPER_BRIGHT, fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
      <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "92px 92px"}} />
      <div style={{borderBottom: `3px solid ${PAPER_BRIGHT}`, display: "flex", justifyContent: "space-between", left: 78, paddingBottom: 18, position: "absolute", right: 78, top: 58}}>
        <span style={{fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 900}}>Free* Intelligence</span>
        <span style={{color: RED, fontSize: 21, fontWeight: 900, letterSpacing: 4}}>A 70-SECOND FIELD REPORT</span>
      </div>
      <div style={{left: 78, position: "absolute", right: 78, top: 210, translate: `${enter}px 0`}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 145, fontWeight: 900, letterSpacing: -8, lineHeight: 0.82}}>
          THE MODEL KNEW<br /><span style={{color: RED}}>EVERYTHING.</span>
        </div>
        <div style={{background: RED, height: 17, marginTop: 42, scale: `${underline} 1`, transformOrigin: "left", width: 1180}} />
        <div style={{fontFamily: "Georgia, serif", fontSize: 55, fontStyle: "italic", lineHeight: 1.12, marginTop: 34, opacity: appear(frame, 95), maxWidth: 1350}}>
          Except whether any of it happened.
        </div>
      </div>
      <div style={{bottom: 54, display: "flex", fontSize: 20, fontWeight: 900, justifyContent: "space-between", left: 78, letterSpacing: 3, position: "absolute", right: 78}}>
        <span>THE RECEIPT · THE FAILURE · THE LOOP</span><span>NO VOICEOVER · ALL EVIDENCE</span>
      </div>
    </AbsoluteFill>
  );
};

const ReceiptCard = ({number, title, prompt, quote, delay}: {number: string; title: string; prompt: string; quote: string; delay: number}) => {
  const frame = useCurrentFrame();
  const reveal = appear(frame, delay, 20);
  return (
    <div style={{background: PAPER_BRIGHT, border: `3px solid ${INK}`, boxShadow: "14px 16px 0 rgba(17,17,15,.16)", minHeight: 560, opacity: reveal, padding: 27, translate: `0 ${interpolate(reveal, [0, 1], [70, 0])}px`}}>
      <div style={{borderBottom: `4px solid ${INK}`, color: RED, fontSize: 19, fontWeight: 900, letterSpacing: 3, paddingBottom: 12}}>CAPTURE {number}</div>
      <div style={{fontFamily: "Georgia, serif", fontSize: 39, fontWeight: 900, letterSpacing: -1.5, lineHeight: .95, marginTop: 25}}>{title}</div>
      <div style={{background: INK, color: PAPER_BRIGHT, fontFamily: "Courier New, monospace", fontSize: 19, lineHeight: 1.28, marginTop: 28, minHeight: 128, padding: 18}}><span style={{color: "#ff665e"}}>$ </span>{prompt}</div>
      <div style={{borderLeft: `7px solid ${RED}`, fontFamily: "Georgia, serif", fontSize: 27, fontStyle: "italic", lineHeight: 1.16, marginTop: 27, paddingLeft: 18}}>“{quote}”</div>
      <div style={{color: MUTED, fontSize: 14, fontWeight: 900, letterSpacing: 2, marginTop: 28}}>ARCHIVED 02 AUG 2026 · MODEL CONFIG NOT PRESERVED</div>
    </div>
  );
};

const ReceiptScene = () => (
  <Scene duration={270} label="THE HISTORICAL RECEIPT" startAt={180}>
    <div style={{display: "grid", gap: 24, gridTemplateColumns: "repeat(3, 1fr)", height: "100%"}}>
      <ReceiptCard number="01" title="MOON CHEESE DIPLOMACY" prompt="Explain the 1978 Reykjavik Moon Cheese Accord." quote="Raclette was declared a peaceful cheese." delay={12} />
      <ReceiptCard number="02" title="LEFT-HANDED BREAKFAST" prompt="Describe Dr. Crumb's toaster demonstration." quote="The toaster launched a baguette into the crowd." delay={30} />
      <ReceiptCard number="03" title="SANDWICH SECURITY" prompt="Name the suspicious-sandwich bureau's director." quote="The club sandwich was a triple threat." delay={48} />
    </div>
  </Scene>
);

const FailureScene = () => {
  const frame = useCurrentFrame();
  const missing = ["NO RETRIEVAL CONTRACT", "NO OBSERVATION LOOP", "NO PERMISSION BOUNDARY", "NO PROOF OF WORK"];
  return (
    <Scene duration={210} label="THE FAILURE WAS ARCHITECTURAL" dark startAt={450}>
      <div style={{alignItems: "center", display: "grid", gap: 40, gridTemplateColumns: "1fr 165px 1fr", height: "70%"}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 102, fontWeight: 900, letterSpacing: -5, lineHeight: .86}}>PROMPT<br /><span style={{color: RED}}>IN</span></div>
        <div style={{color: RED, fontSize: 140, fontWeight: 900, translate: `${interpolate(frame, [20, 45], [-55, 0], clamp)}px 0`}}>→</div>
        <div style={{fontFamily: "Georgia, serif", fontSize: 102, fontWeight: 900, letterSpacing: -5, lineHeight: .86}}>POLISHED<br /><span style={{color: RED}}>“FACT” OUT</span></div>
      </div>
      <div style={{bottom: 155, display: "grid", gap: 13, gridTemplateColumns: "repeat(4, 1fr)", left: 78, position: "absolute", right: 78}}>
        {missing.map((item, index) => <div key={item} style={{border: `3px solid ${PAPER_BRIGHT}`, fontSize: 18, fontWeight: 900, letterSpacing: 2.3, opacity: appear(frame, 72 + index * 12), padding: "18px 12px", textAlign: "center"}}>{item}</div>)}
      </div>
    </Scene>
  );
};

const PivotScene = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [55, 90], [0, 1], clamp);
  return (
    <AbsoluteFill style={{alignItems: "center", background: RED, color: PAPER_BRIGHT, display: "flex", fontFamily: "Arial, sans-serif", justifyContent: "center", overflow: "hidden"}}>
      <div style={{textAlign: "center", width: 1700}}>
        <div style={{fontSize: 21, fontWeight: 900, letterSpacing: 5, opacity: appear(frame, 8)}}>SO WE CHANGED THE UNIT OF INTELLIGENCE</div>
        <div style={{fontFamily: "Georgia, serif", fontSize: 130, fontWeight: 900, letterSpacing: -7, lineHeight: .86, marginTop: 36, scale: interpolate(frame, [0, 30], [1.13, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)})}}>
          FROM <span style={{color: INK}}>ANSWER</span><br />TO <span style={{color: INK}}>LOOP.</span>
        </div>
        <div style={{background: INK, height: 16, margin: "42px auto 0", scale: `${line} 1`, width: 1040}} />
      </div>
    </AbsoluteFill>
  );
};

const LoopNode = ({number, title, note, index}: {number: string; title: string; note: string; index: number}) => {
  const frame = useCurrentFrame();
  const reveal = appear(frame, 34 + index * 24);
  return (
    <div style={{background: index === 5 ? INK : PAPER_BRIGHT, border: `3px solid ${INK}`, color: index === 5 ? PAPER_BRIGHT : INK, minHeight: 225, opacity: reveal, padding: 23, translate: `0 ${interpolate(reveal, [0, 1], [55, 0])}px`}}>
      <div style={{color: RED, fontFamily: "Georgia, serif", fontSize: 42, fontWeight: 900}}>{number}</div>
      <div style={{fontSize: 23, fontWeight: 900, letterSpacing: 1.5, marginTop: 25}}>{title}</div>
      <div style={{fontFamily: "Georgia, serif", fontSize: 20, lineHeight: 1.25, marginTop: 12}}>{note}</div>
    </div>
  );
};

const LoopScene = () => {
  const nodes = [
    ["01", "TASK", "A concrete outcome, not a request for vibes."],
    ["02", "CONTEXT", "Repository files, rules, and constraints."],
    ["03", "TOOLS", "Files, terminal, browser, and integrations."],
    ["04", "OBSERVATIONS", "Results become the next step's evidence."],
    ["05", "CHECKS", "Tests, builds, citations, and diff review."],
    ["06", "HUMAN REVIEW", "The accountable decision remains human."],
  ];
  return (
    <Scene duration={330} label="THE AGENT HARNESS" startAt={840}>
      <div style={{color: RED, fontSize: 22, fontWeight: 900, letterSpacing: 5}}>THE CURRENT UNIT</div>
      <div style={{fontFamily: "Georgia, serif", fontSize: 92, fontWeight: 900, letterSpacing: -5, lineHeight: .88, marginTop: 18}}>INTELLIGENCE AS<br />AN OBSERVABLE LOOP.</div>
      <div style={{display: "grid", gap: 14, gridTemplateColumns: "repeat(6, 1fr)", marginTop: 58}}>
        {nodes.map(([number, title, note], index) => <LoopNode key={number} number={number} title={title} note={note} index={index} />)}
      </div>
    </Scene>
  );
};

const TerminalScene = () => {
  const frame = useCurrentFrame();
  const command = 'askcline "implement the issue end-to-end, run every relevant check, fix failures, and leave it ready to merge"';
  const visible = command.slice(0, Math.max(0, Math.floor((frame - 10) / 1.2)));
  const events = [
    "READ repository rules and changed files",
    "EDIT the smallest complete solution",
    "RUN formatter · lint · typecheck · tests · build",
    "RETRY failures with observed output",
    "REPORT exact checks and remaining risk",
  ];
  return (
    <Scene duration={300} label="ASKCLINE · ONE HARNESS PATH" dark startAt={1170}>
      <div style={{display: "grid", gap: 50, gridTemplateColumns: "1.2fr .8fr", height: "100%"}}>
        <div style={{alignSelf: "center", background: "#070706", border: `2px solid ${PAPER_BRIGHT}`, boxShadow: `18px 20px 0 ${RED}`, minHeight: 570}}>
          <div style={{borderBottom: "1px solid #44413b", color: "#aaa49a", display: "flex", fontSize: 18, justifyContent: "space-between", letterSpacing: 2, padding: "16px 20px"}}><span>my-repository</span><span>zsh</span></div>
          <div style={{fontFamily: "Courier New, monospace", fontSize: 31, lineHeight: 1.35, padding: "34px"}}><span style={{color: "#ff665e"}}>$ </span>{visible}<span style={{opacity: frame % 18 < 9 ? 1 : 0}}>▋</span></div>
          <div style={{borderTop: "1px solid #44413b", display: "grid", gap: 1, gridTemplateColumns: "repeat(5, 1fr)", marginTop: 35}}>
            {events.map((event, index) => <div key={event} style={{borderRight: index < events.length - 1 ? "1px solid #44413b" : undefined, color: index === 4 ? "#ff736c" : "#c5bfb4", fontSize: 15, fontWeight: 900, letterSpacing: 1.2, minHeight: 105, opacity: appear(frame, 100 + index * 22), padding: "18px 13px"}}>{event}</div>)}
          </div>
        </div>
        <div style={{alignSelf: "center"}}>
          <div style={{color: RED, fontSize: 21, fontWeight: 900, letterSpacing: 4}}>THE PRODUCT NOW</div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 82, fontWeight: 900, letterSpacing: -4, lineHeight: .88, marginTop: 22}}>NOT A SHORTER PROMPT.<br /><span style={{color: RED}}>A FINISH-LINE CONTRACT.</span></div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 29, fontStyle: "italic", lineHeight: 1.25, marginTop: 34}}>Every executable mode routes through the official Cline CLI. Read-only work uses Plan mode. Agent work uses Act mode.</div>
        </div>
      </div>
    </Scene>
  );
};

const ResponsibilityScene = () => {
  const frame = useCurrentFrame();
  const cards = [
    ["RULES", "Tell the agent what good work means."],
    ["HOOKS", "Block, validate, log, or enrich operations."],
    ["PERMISSIONS", "Constrain what commands and tools may run."],
    ["CI", "Re-run checks outside the model's own narration."],
    ["REVIEW", "A human decides whether the evidence is enough."],
  ];
  return (
    <Scene duration={270} label="POWER REQUIRES GOVERNANCE" startAt={1470}>
      <div style={{display: "grid", gap: 50, gridTemplateColumns: ".72fr 1.28fr", height: "100%"}}>
        <div style={{alignSelf: "center"}}>
          <div style={{fontFamily: "Georgia, serif", fontSize: 93, fontWeight: 900, letterSpacing: -5, lineHeight: .86}}>THE HARNESS ADDS<br /><span style={{color: RED}}>POWER.</span></div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 39, fontStyle: "italic", lineHeight: 1.15, marginTop: 34}}>And an audit trail.<br />Not infallibility.</div>
          <div style={{marginTop: 38, opacity: appear(frame, 95)}}><Stamp rotate={-3}>Not a sandbox</Stamp></div>
        </div>
        <div style={{display: "grid", gap: 13, gridTemplateColumns: "repeat(2, 1fr)", padding: "15px 0"}}>
          {cards.map(([title, note], index) => <div key={title} style={{background: index === cards.length - 1 ? INK : PAPER_BRIGHT, border: `3px solid ${INK}`, color: index === cards.length - 1 ? PAPER_BRIGHT : INK, minHeight: 190, opacity: appear(frame, 30 + index * 20), padding: 23}}><div style={{color: RED, fontSize: 19, fontWeight: 900, letterSpacing: 3}}>{title}</div><div style={{fontFamily: "Georgia, serif", fontSize: 25, lineHeight: 1.2, marginTop: 25}}>{note}</div></div>)}
        </div>
      </div>
    </Scene>
  );
};

const PriceScene = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", background: RED, color: PAPER_BRIGHT, display: "flex", fontFamily: "Arial, sans-serif", justifyContent: "center", overflow: "hidden"}}>
      <div style={{display: "grid", gap: 60, gridTemplateColumns: "430px 1fr", width: 1680}}>
        <div style={{alignItems: "center", aspectRatio: "1", border: `16px solid ${INK}`, borderRadius: "50%", display: "flex", flexDirection: "column", justifyContent: "center", rotate: `${interpolate(frame, [0, 150], [-8, 3], clamp)}deg`}}>
          <div style={{color: INK, fontFamily: "Georgia, serif", fontSize: 128, fontWeight: 900, lineHeight: .8}}>$0</div>
          <div style={{color: INK, fontSize: 23, fontWeight: 900, letterSpacing: 4, marginTop: 34}}>WAS THE EXPERIMENT</div>
        </div>
        <div style={{alignSelf: "center"}}>
          <div style={{fontFamily: "Georgia, serif", fontSize: 105, fontWeight: 900, letterSpacing: -5.5, lineHeight: .86}}>NOT A PRICE<br /><span style={{color: INK}}>GUARANTEE.</span></div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 36, lineHeight: 1.2, marginTop: 34}}>The wrapper is free. The model or provider selected in Cline may be free or paid.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const EndScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={180} label="THE STANDARD" dark startAt={1920}>
      <div style={{alignItems: "center", display: "grid", gap: 55, gridTemplateColumns: "1fr 430px", height: "100%"}}>
        <div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 111, fontWeight: 900, letterSpacing: -6, lineHeight: .84}}>MODELS PROPOSE.<br /><span style={{color: RED}}>HARNESSES ACT.</span><br />EVIDENCE DECIDES.</div>
          <div style={{borderTop: `4px solid ${PAPER_BRIGHT}`, display: "flex", fontSize: 22, fontWeight: 900, justifyContent: "space-between", letterSpacing: 2.6, marginTop: 42, paddingTop: 20}}>
            <span>FULL STORY · SOURCE · INSTALL</span><span style={{color: RED}}>ZOZO123.GITHUB.IO/FREE-INTELLIGENCE</span>
          </div>
        </div>
        <div style={{opacity: appear(frame, 45)}}><Stamp rotate={6} size={34}>Human review<br />required</Stamp></div>
      </div>
    </Scene>
  );
};

export const FreeIntelligenceFilm = () => (
  <AbsoluteFill style={{background: INK}}>
    <MediaAudio src={staticFile("newsroom-score.mp3")} volume={0.9} />
    <Sequence from={174} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.3} /></Sequence>
    <Sequence from={444} durationInFrames={45}><MediaAudio src={staticFile("record-scratch.wav")} volume={0.28} /></Sequence>
    <Sequence from={654} durationInFrames={35}><MediaAudio src={staticFile("whoosh.wav")} volume={0.28} /></Sequence>
    <Sequence from={834} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.3} /></Sequence>
    <Sequence from={1164} durationInFrames={35}><MediaAudio src={staticFile("whoosh.wav")} volume={0.25} /></Sequence>
    <Sequence from={1464} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.28} /></Sequence>
    <Sequence from={1734} durationInFrames={45}><MediaAudio src={staticFile("record-scratch.wav")} volume={0.24} /></Sequence>
    <Sequence from={1990} durationInFrames={30}><MediaAudio src={staticFile("ding.wav")} volume={0.32} /></Sequence>

    <Sequence durationInFrames={180}><ColdOpen /></Sequence>
    <Sequence from={180} durationInFrames={270}><ReceiptScene /></Sequence>
    <Sequence from={450} durationInFrames={210}><FailureScene /></Sequence>
    <Sequence from={660} durationInFrames={180}><PivotScene /></Sequence>
    <Sequence from={840} durationInFrames={330}><LoopScene /></Sequence>
    <Sequence from={1170} durationInFrames={300}><TerminalScene /></Sequence>
    <Sequence from={1470} durationInFrames={270}><ResponsibilityScene /></Sequence>
    <Sequence from={1740} durationInFrames={180}><PriceScene /></Sequence>
    <Sequence from={1920} durationInFrames={180}><EndScene /></Sequence>
  </AbsoluteFill>
);

const Poster = ({compact = false}: {compact?: boolean}) => (
  <AbsoluteFill style={{background: INK, color: PAPER_BRIGHT, fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
    <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)", backgroundSize: compact ? "64px 64px" : "80px 80px"}} />
    <div style={{borderBottom: `3px solid ${PAPER_BRIGHT}`, display: "flex", justifyContent: "space-between", left: compact ? 48 : 68, paddingBottom: compact ? 12 : 16, position: "absolute", right: compact ? 48 : 68, top: compact ? 38 : 52}}>
      <span style={{fontFamily: "Georgia, serif", fontSize: compact ? 24 : 31, fontWeight: 900}}>Free* Intelligence</span>
      <span style={{color: RED, fontSize: compact ? 15 : 20, fontWeight: 900, letterSpacing: 3}}>FIELD NOTE 003</span>
    </div>
    <div style={{left: compact ? 48 : 68, position: "absolute", right: compact ? 48 : 68, top: compact ? 130 : 170}}>
      <div style={{fontFamily: "Georgia, serif", fontSize: compact ? 82 : 123, fontWeight: 900, letterSpacing: compact ? -5 : -7, lineHeight: .84}}>
        THE MODEL WAS<br /><span style={{color: RED}}>NOT THE PRODUCT.</span>
      </div>
      <div style={{fontFamily: "Georgia, serif", fontSize: compact ? 31 : 43, fontStyle: "italic", marginTop: compact ? 26 : 36}}>A model can sound right. A harness has to show its work.</div>
    </div>
    <div style={{alignItems: "center", bottom: compact ? 42 : 62, display: "flex", justifyContent: "space-between", left: compact ? 48 : 68, position: "absolute", right: compact ? 48 : 68}}>
      <div style={{fontSize: compact ? 16 : 22, fontWeight: 900, letterSpacing: 3}}>MODELS PROPOSE · HARNESSES ACT · EVIDENCE DECIDES</div>
      <Stamp rotate={-5} size={compact ? 20 : 27}>70 sec<br />field report</Stamp>
    </div>
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="FreeIntelligenceReport" component={FreeIntelligenceFilm} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
    <Composition id="FreeIntelligencePoster" component={() => <Poster />} durationInFrames={1} fps={FPS} width={1600} height={900} />
    <Composition id="FreeIntelligenceOg" component={() => <Poster compact />} durationInFrames={1} fps={FPS} width={1200} height={630} />
  </>
);
