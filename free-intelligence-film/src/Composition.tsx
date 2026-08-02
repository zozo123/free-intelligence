import type {Caption} from "@remotion/captions";
import {Audio as MediaAudio} from "@remotion/media";
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
const DURATION = 2160;
const INK = "#141414";
const PAPER = "#eee9de";
const RED = "#df2a23";

const captions: Caption[] = [
  {text: "Tonight, on Free Intelligence: one man, one prompt, three completely different lives.", startMs: 0, endMs: 6500, timestampMs: null, confidence: 1},
  {text: "We asked DeepSeek, through Cline's free endpoint: ‘Who is Yossi Eliaz?’", startMs: 6500, endMs: 12500, timestampMs: null, confidence: 1},
  {text: "First, it found a fallen luxury property tycoon.", startMs: 12500, endMs: 19000, timestampMs: null, confidence: 1},
  {text: "Seconds later, the same Yossi had joined the Miami Boys Choir and become a world-renowned singer.", startMs: 19000, endMs: 28500, timestampMs: null, confidence: 1},
  {text: "One more try, and our mystery man was now a Brooklyn-born power broker reshaping East Jerusalem.", startMs: 28500, endMs: 38000, timestampMs: null, confidence: 1},
  {text: "Impressive résumé. Small problem: the biographies contradict one another.", startMs: 38000, endMs: 44500, timestampMs: null, confidence: 1},
  {text: "Each arrives with the calm confidence of a correspondent standing outside the courthouse.", startMs: 44500, endMs: 50500, timestampMs: null, confidence: 1},
  {text: "The tiny askcline wrapper does exactly what we built it to do: send one prompt, print one answer, cost zero.", startMs: 50500, endMs: 58500, timestampMs: null, confidence: 1},
  {text: "The problem is treating fluent text as verified evidence. No search. No citations. No identity check.", startMs: 58500, endMs: 64500, timestampMs: null, confidence: 1},
  {text: "Free is a price, not a fact-checking method.", startMs: 64500, endMs: 67500, timestampMs: null, confidence: 1},
  {text: "Askcline: astonishingly fast. Occasionally, astonishingly fictional.", startMs: 67500, endMs: 72000, timestampMs: null, confidence: 1},
];

const Stamp: React.FC<{children: React.ReactNode; rotate?: number}> = ({children, rotate = -5}) => (
  <div style={{border: `8px solid ${RED}`, color: RED, fontFamily: "Arial Black, Arial, sans-serif", fontSize: 44, fontWeight: 900, letterSpacing: 2, padding: "10px 22px 6px", rotate: `${rotate}deg`, textTransform: "uppercase"}}>
    {children}
  </div>
);

const Newspaper: React.FC<{kicker: string; headline: React.ReactNode; deck: string; rotate?: number; children?: React.ReactNode}> = ({kicker, headline, deck, rotate = 0, children}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{background: PAPER, border: `2px solid ${INK}`, boxShadow: "20px 24px 0 rgba(20,20,20,.18)", color: INK, display: "flex", flexDirection: "column", gap: 22, minHeight: 530, padding: "44px 50px", rotate: `${rotate}deg`, scale: interpolate(frame, [0, 22], [0.78, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)}), width: 1160}}>
      <div style={{alignItems: "center", borderBottom: `5px solid ${INK}`, display: "flex", justifyContent: "space-between", paddingBottom: 14}}>
        <span style={{fontFamily: "Arial, sans-serif", fontSize: 28, fontWeight: 900, letterSpacing: 4}}>{kicker}</span>
        <span style={{fontFamily: "Georgia, serif", fontSize: 23}}>THE DAILY CERTAINTY · $0.00</span>
      </div>
      <div style={{fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 84, fontWeight: 900, letterSpacing: -4, lineHeight: .92, textTransform: "uppercase"}}>{headline}</div>
      <div style={{borderTop: `2px solid ${INK}`, fontFamily: "Georgia, serif", fontSize: 36, lineHeight: 1.2, paddingTop: 18}}>{deck}</div>
      {children}
    </div>
  );
};

const FrameChrome: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = Math.floor(frame / fps);
  return (
    <AbsoluteFill style={{background: PAPER, color: INK, fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
      <AbsoluteFill style={{backgroundImage: "radial-gradient(rgba(20,20,20,.09) .8px, transparent .8px)", backgroundSize: "6px 6px", opacity: .28}} />
      <div style={{alignItems: "center", borderBottom: `3px solid ${INK}`, display: "flex", height: 70, justifyContent: "space-between", left: 74, position: "absolute", right: 74, top: 34}}>
        <div style={{fontSize: 25, fontWeight: 900, letterSpacing: 3}}>FREE INTELLIGENCE / FIELD REPORT 001</div>
        <div style={{color: RED, fontFamily: "Courier New, monospace", fontSize: 26, fontWeight: 700}}>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</div>
      </div>
      <AbsoluteFill style={{padding: "132px 86px 155px"}}>{children}</AbsoluteFill>
      <div style={{background: INK, bottom: 28, color: PAPER, display: "flex", fontSize: 24, fontWeight: 800, justifyContent: "space-between", left: 74, letterSpacing: 2, padding: "12px 18px 10px", position: "absolute", right: 74}}>
        <span>{label}</span><span style={{color: "#ff5b51"}}>NOT LIVE · VERY CONFIDENT</span>
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{duration: number; label: string; children: React.ReactNode}> = ({duration, label, children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: interpolate(frame, [0, 8, duration - 10, duration], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
      <FrameChrome label={label}>{children}</FrameChrome>
    </AbsoluteFill>
  );
};

const Intro = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={180} label="TONIGHT'S INVESTIGATION">
      <div style={{alignItems: "center", display: "grid", gap: 70, gridTemplateColumns: "1fr 460px", height: "100%"}}>
        <div>
          <div style={{color: RED, fontSize: 32, fontWeight: 900, letterSpacing: 7, marginBottom: 26}}>A SPECIAL REPORT</div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 152, fontWeight: 900, letterSpacing: -9, lineHeight: .86, opacity: interpolate(frame, [5, 30], [0, 1], {extrapolateRight: "clamp"})}}>ONE PROMPT.<br />THREE LIVES.</div>
          <div style={{fontSize: 46, fontWeight: 500, marginTop: 34}}>The $0 answer that became a triple identity crisis.</div>
        </div>
        <div style={{alignItems: "center", aspectRatio: "1", border: `18px solid ${INK}`, borderRadius: "50%", display: "flex", flexDirection: "column", justifyContent: "center", rotate: `${interpolate(frame, [0, 150], [-8, 2], {extrapolateRight: "clamp"})}deg`}}>
          <div style={{color: RED, fontFamily: "Georgia, serif", fontSize: 166, fontWeight: 900, lineHeight: .8}}>0¢</div>
          <div style={{fontSize: 28, fontWeight: 900, letterSpacing: 5, marginTop: 34}}>INTELLIGENCE*</div>
        </div>
      </div>
    </Scene>
  );
};

const TerminalScene = () => {
  const frame = useCurrentFrame();
  const prompt = 'askcline "who is yossi eliaz?"';
  const visible = prompt.slice(0, Math.max(0, Math.floor((frame - 20) / 2)));
  return (
    <Scene duration={210} label="EXHIBIT A · THE PROMPT">
      <div style={{alignItems: "center", display: "flex", flexDirection: "column", gap: 38, height: "100%", justifyContent: "center"}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 72, fontStyle: "italic"}}>Same prompt. Fresh answer. No memory.</div>
        <div style={{background: INK, borderRadius: 10, boxShadow: `18px 18px 0 ${RED}`, color: "#f8f4ea", fontFamily: "Courier New, monospace", fontSize: 54, padding: "62px 66px", width: 1400}}>
          <div style={{color: "#8b857b", fontSize: 25, marginBottom: 34}}>yossi.eliaz@macbookpro ~ %</div>
          <span style={{color: "#ff5b51"}}>$ </span>{visible}<span style={{opacity: frame % 18 < 9 ? 1 : 0}}>▌</span>
        </div>
        <div style={{alignItems: "center", display: "flex", gap: 34}}><Stamp rotate={-2}>RUN × 3</Stamp><div style={{fontSize: 36}}>What could possibly go wrong?</div></div>
      </div>
    </Scene>
  );
};

const TycoonScene = () => (
  <Scene duration={300} label="ANSWER 01 · REAL ESTATE EDITION">
    <div style={{alignItems: "center", display: "flex", height: "100%", justifyContent: "center"}}>
      <Newspaper kicker="ANSWER NO. 1" headline={<>TEL AVIV TYCOON<br />FALLS FROM GRACE</>} deck="Luxury towers. A bond collapse. Fraud allegations. An active criminal trial." rotate={-1.8}>
        <div style={{alignItems: "center", display: "flex", justifyContent: "space-between", marginTop: "auto"}}><span style={{fontFamily: "Courier New, monospace", fontSize: 28}}>W HOTEL · 2019–2024 · allegedly, apparently, confidently</span><Stamp>Source: vibes</Stamp></div>
      </Newspaper>
    </div>
  </Scene>
);

const SingerScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={300} label="ANSWER 02 · SHOWBIZ EDITION">
      <div style={{alignItems: "center", display: "flex", height: "100%", justifyContent: "center"}}>
        <Newspaper kicker="ANSWER NO. 2 · SAME QUESTION" headline={<>CHOIRBOY BECOMES<br />GLOBAL JEWISH STAR</>} deck="A soulful voice. The Miami Boys Choir. Several acclaimed albums that sound extremely plausible." rotate={1.5}>
          <div style={{alignItems: "end", display: "flex", justifyContent: "space-between", marginTop: "auto"}}>
            <div><div style={{color: RED, fontFamily: "Arial Black, sans-serif", fontSize: 96, lineHeight: .8, scale: interpolate(frame, [30, 60], [.5, 1], {extrapolateRight: "clamp", easing: Easing.bezier(.16, 1, .3, 1)})}}>99%</div><div style={{fontFamily: "Georgia, serif", fontSize: 30, fontStyle: "italic"}}>of the time*</div></div>
            <div style={{fontFamily: "Courier New, monospace", fontSize: 24, maxWidth: 620, textAlign: "right"}}>* Percentage also hallucinated.</div>
          </div>
        </Newspaper>
      </div>
    </Scene>
  );
};

const BrokerScene = () => (
  <Scene duration={300} label="ANSWER 03 · GEOPOLITICS EDITION">
    <div style={{alignItems: "center", display: "flex", height: "100%", justifyContent: "center"}}>
      <div style={{background: "repeating-linear-gradient(0deg, transparent 0 62px, rgba(20,20,20,.13) 63px 64px), repeating-linear-gradient(90deg, transparent 0 62px, rgba(20,20,20,.13) 63px 64px)", bottom: 110, left: 0, opacity: .6, position: "absolute", right: 0, top: 110}} />
      <Newspaper kicker="ANSWER NO. 3 · STILL THE SAME QUESTION" headline={<>BROOKLYN-BORN MOGUL<br />RESHAPES JERUSALEM</>} deck="Property battles. Archaeology. Political ties. A lifetime assembled in one response." rotate={-1}>
        <div style={{alignItems: "center", display: "flex", justifyContent: "space-between", marginTop: "auto"}}><Stamp rotate={2}>Breaking: same man</Stamp><span style={{fontFamily: "Courier New, monospace", fontSize: 26}}>CITATIONS: 0 · SPECIFIC DETAILS: MANY</span></div>
      </Newspaper>
    </div>
  </Scene>
);

const EvidenceCard: React.FC<{title: string; subtitle: string; rotate: number}> = ({title, subtitle, rotate}) => (
  <div style={{background: PAPER, border: `3px solid ${INK}`, boxShadow: "10px 12px 0 rgba(20,20,20,.18)", padding: "26px 30px", rotate: `${rotate}deg`, width: 390}}>
    <div style={{color: RED, fontSize: 22, fontWeight: 900, letterSpacing: 4}}>CASE FILE</div>
    <div style={{fontFamily: "Georgia, serif", fontSize: 58, fontWeight: 900, margin: "16px 0 10px"}}>{title}</div>
    <div style={{fontSize: 28}}>{subtitle}</div>
  </div>
);

const EvidenceScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={300} label="THE IDENTITY DESK">
      <div style={{alignItems: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center"}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 900, letterSpacing: -3}}>A REMARKABLE CAREER. ALL THREE OF THEM.</div>
        <div style={{display: "flex", gap: 46, marginTop: 70, position: "relative"}}>
          <div style={{background: RED, height: 8, left: 330, position: "absolute", rotate: "8deg", top: 116, width: 500}} />
          <div style={{background: RED, height: 8, left: 760, position: "absolute", rotate: "-9deg", top: 130, width: 430}} />
          <EvidenceCard title="TYCOON" subtitle="Luxury towers & legal trouble" rotate={-3} />
          <EvidenceCard title="SINGER" subtitle="Choirs, albums & stardom" rotate={2} />
          <EvidenceCard title="MOGUL" subtitle="Land, politics & archaeology" rotate={-1} />
        </div>
        <div style={{marginTop: 56, opacity: interpolate(frame, [90, 112], [0, 1], {extrapolateRight: "clamp"}), scale: interpolate(frame, [90, 112], [1.8, 1], {extrapolateRight: "clamp", easing: Easing.bezier(.2, .9, .2, 1.2)})}}><Stamp rotate={-2}>Contradictory evidence</Stamp></div>
      </div>
    </Scene>
  );
};

const MechanismScene = () => {
  const frame = useCurrentFrame();
  const items = [
    ["01", "ONE PROMPT", "A single name with no identifying context."],
    ["02", "NO GROUNDING", "No search, citations, or identity check."],
    ["03", "FLUENT OUTPUT", "Specific prose that sounds like reporting."],
  ];
  return (
    <Scene duration={360} label="HOW THE TRICK WORKS">
      <div style={{display: "grid", gap: 54, gridTemplateColumns: "1fr 1.35fr", height: "100%", alignItems: "center"}}>
        <div>
          <div style={{color: RED, fontSize: 30, fontWeight: 900, letterSpacing: 6}}>THE MECHANISM</div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 126, fontWeight: 900, letterSpacing: -7, lineHeight: .88, marginTop: 26}}>FLUENCY<br /><span style={{color: RED}}>≠</span> EVIDENCE</div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 43, fontStyle: "italic", marginTop: 38}}>The wrapper is tiny. The confidence is industrial.</div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 22}}>
          {items.map(([n, title, text], index) => (
            <div key={n} style={{alignItems: "center", background: index === 2 ? INK : "rgba(255,255,255,.5)", border: `3px solid ${INK}`, color: index === 2 ? PAPER : INK, display: "grid", gap: 24, gridTemplateColumns: "110px 1fr", opacity: interpolate(frame, [25 + index * 35, 48 + index * 35], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}), padding: "26px 32px", translate: `${interpolate(frame, [25 + index * 35, 48 + index * 35], [80, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}px 0`}}>
              <div style={{color: RED, fontFamily: "Arial Black, sans-serif", fontSize: 62}}>{n}</div>
              <div><div style={{fontSize: 34, fontWeight: 900, letterSpacing: 2}}>{title}</div><div style={{fontFamily: "Georgia, serif", fontSize: 30, marginTop: 8}}>{text}</div></div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

const EndScene = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={210} label="EDITORIAL NOTE · VERIFY BEFORE AIR">
      <div style={{alignItems: "center", display: "grid", gap: 70, gridTemplateColumns: "460px 1fr", height: "100%"}}>
        <div style={{alignItems: "center", aspectRatio: "1", border: `18px solid ${RED}`, borderRadius: "50%", display: "flex", flexDirection: "column", justifyContent: "center", rotate: `${interpolate(frame, [0, 170], [-8, 5], {extrapolateRight: "clamp"})}deg`}}>
          <div style={{fontFamily: "Georgia, serif", fontSize: 142, fontWeight: 900}}>FREE*</div>
          <div style={{fontSize: 29, fontWeight: 900, letterSpacing: 4}}>PRICE ≠ PROOF</div>
        </div>
        <div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 110, fontWeight: 900, letterSpacing: -5, lineHeight: .92}}>YOUR INTERN<br />IS FREE.</div>
          <div style={{color: RED, fontFamily: "Georgia, serif", fontSize: 78, fontStyle: "italic", fontWeight: 700, marginTop: 20}}>Keep a fact-checker.</div>
          <div style={{fontSize: 38, lineHeight: 1.25, marginTop: 38, maxWidth: 910}}>Askcline is astonishingly fast.<br />Occasionally, astonishingly fictional.</div>
        </div>
      </div>
    </Scene>
  );
};

const CaptionBar = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = (frame / fps) * 1000;
  const active = captions.find((caption) => now >= caption.startMs && now < caption.endMs);
  if (!active) return null;
  return (
    <div style={{background: "rgba(20,20,20,.94)", bottom: 84, color: PAPER, fontFamily: "Arial, sans-serif", fontSize: 34, fontWeight: 700, left: "50%", lineHeight: 1.15, maxWidth: 1420, padding: "17px 26px 15px", position: "absolute", textAlign: "center", translate: "-50% 0", width: "max-content"}}>
      {active.text}
    </div>
  );
};

export const FreeIntelligenceFilm = () => (
  <AbsoluteFill style={{background: INK}}>
    <MediaAudio src={staticFile("narration.mp3")} volume={1} />
    <Sequence from={178} durationInFrames={18}><MediaAudio src={staticFile("whoosh.wav")} volume={0.35} /></Sequence>
    <Sequence from={388} durationInFrames={30}><MediaAudio src={staticFile("page-turn.wav")} volume={0.45} /></Sequence>
    <Sequence from={688} durationInFrames={30}><MediaAudio src={staticFile("page-turn.wav")} volume={0.45} /></Sequence>
    <Sequence from={958} durationInFrames={30}><MediaAudio src={staticFile("page-turn.wav")} volume={0.45} /></Sequence>
    <Sequence from={1298} durationInFrames={45}><MediaAudio src={staticFile("record-scratch.wav")} volume={0.42} /></Sequence>
    <Sequence from={1888} durationInFrames={28}><MediaAudio src={staticFile("ding.wav")} volume={0.4} /></Sequence>
    <Sequence durationInFrames={180}><Intro /></Sequence>
    <Sequence from={180} durationInFrames={210}><TerminalScene /></Sequence>
    <Sequence from={390} durationInFrames={300}><TycoonScene /></Sequence>
    <Sequence from={690} durationInFrames={300}><SingerScene /></Sequence>
    <Sequence from={990} durationInFrames={300}><BrokerScene /></Sequence>
    <Sequence from={1290} durationInFrames={300}><EvidenceScene /></Sequence>
    <Sequence from={1590} durationInFrames={360}><MechanismScene /></Sequence>
    <Sequence from={1950} durationInFrames={210}><EndScene /></Sequence>
    <CaptionBar />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <Composition
    id="FreeIntelligenceReport"
    component={FreeIntelligenceFilm}
    durationInFrames={DURATION}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
