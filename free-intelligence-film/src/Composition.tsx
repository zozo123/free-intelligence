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
const DURATION = 1800;
const INK = "#11110f";
const PAPER = "#eee9de";
const PAPER_BRIGHT = "#faf7ef";
const RED = "#e12b23";
const OCHRE = "#d4aa3d";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Stamp: React.FC<{children: React.ReactNode; rotate?: number; size?: number}> = ({children, rotate = -4, size = 35}) => (
  <div
    style={{
      border: `7px solid ${RED}`,
      color: RED,
      display: "inline-block",
      fontFamily: "Arial Black, Arial, sans-serif",
      fontSize: size,
      fontWeight: 900,
      letterSpacing: 2,
      lineHeight: 0.95,
      padding: "11px 17px 8px",
      rotate: `${rotate}deg`,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);

const FrameChrome: React.FC<{children: React.ReactNode; label: string; dark?: boolean; startAt: number}> = ({children, label, dark = false, startAt}) => {
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
            ? "radial-gradient(rgba(255,255,255,.12) .7px, transparent .7px)"
            : "radial-gradient(rgba(17,17,15,.12) .7px, transparent .7px)",
          backgroundSize: "6px 6px",
          opacity: 0.32,
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
        <div style={{fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 900}}>The Free Intelligence Desk</div>
        <div style={{fontSize: 22, fontWeight: 900, letterSpacing: 4}}>FIELD NOTE 002 · 60 SEC</div>
      </div>
      <AbsoluteFill style={{padding: "128px 78px 138px"}}>{children}</AbsoluteFill>
      <div
        style={{
          alignItems: "center",
          background: dark ? PAPER_BRIGHT : INK,
          bottom: 26,
          color: dark ? INK : PAPER_BRIGHT,
          display: "flex",
          fontSize: 21,
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

const Scene: React.FC<{duration: number; label: string; children: React.ReactNode; dark?: boolean; startAt: number}> = ({duration, label, children, dark, startAt}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, duration - 7, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity}}>
      <FrameChrome label={label} dark={dark} startAt={startAt}>{children}</FrameChrome>
    </AbsoluteFill>
  );
};

const ColdOpen = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 25], [80, 0], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const strike = interpolate(frame, [78, 100], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: INK, color: PAPER_BRIGHT, fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden"}}>
      <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px)", backgroundSize: "90px 90px"}} />
      <div style={{borderBottom: `3px solid ${PAPER_BRIGHT}`, display: "flex", justifyContent: "space-between", left: 78, paddingBottom: 18, position: "absolute", right: 78, top: 58}}>
        <span style={{fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 900}}>The Free Intelligence Desk</span>
        <span style={{color: RED, fontSize: 22, fontWeight: 900, letterSpacing: 4}}>A 60-SECOND FIELD TEST</span>
      </div>
      <div style={{left: 78, position: "absolute", right: 78, top: 220, translate: `${enter}px 0`}}>
        <div style={{fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 158, fontWeight: 900, letterSpacing: -9, lineHeight: 0.82}}>
          WE BUILT A<br /><span style={{color: RED}}>$0 AI BUTTON.</span>
        </div>
        <div style={{background: RED, height: 18, marginTop: 46, scale: `${strike} 1`, transformOrigin: "left", width: 1110}} />
        <div style={{fontFamily: "Georgia, serif", fontSize: 49, fontStyle: "italic", lineHeight: 1.16, marginTop: 38, maxWidth: 1220, opacity: interpolate(frame, [88, 112], [0, 1], clamp)}}>
          It answered questions no one should have answered.
        </div>
      </div>
      <div style={{bottom: 50, display: "flex", fontSize: 22, fontWeight: 900, justifyContent: "space-between", left: 78, letterSpacing: 3, position: "absolute", right: 78}}>
        <span>ASKCLINE / REPORT 002</span><span>NO VOICEOVER · ALL RECEIPTS</span>
      </div>
    </AbsoluteFill>
  );
};

const FlowNode: React.FC<{number: string; title: string; note: string; index: number}> = ({number, title, note, index}) => {
  const frame = useCurrentFrame();
  const start = 68 + index * 18;
  const reveal = interpolate(frame, [start, start + 16], [0, 1], clamp);
  return (
    <div style={{background: index === 3 ? INK : PAPER_BRIGHT, border: `3px solid ${INK}`, color: index === 3 ? PAPER_BRIGHT : INK, minHeight: 170, opacity: reveal, padding: "20px 22px", translate: `0 ${interpolate(reveal, [0, 1], [45, 0])}px`}}>
      <div style={{color: RED, fontSize: 22, fontWeight: 900, letterSpacing: 3}}>{number}</div>
      <div style={{fontSize: 30, fontWeight: 900, letterSpacing: 1, marginTop: 18}}>{title}</div>
      <div style={{fontFamily: "Georgia, serif", fontSize: 24, lineHeight: 1.15, marginTop: 10}}>{note}</div>
    </div>
  );
};

const HowItWorks = () => {
  const frame = useCurrentFrame();
  const command = 'askcline "Summarize this"';
  const visible = command.slice(0, Math.max(0, Math.floor((frame - 10) / 1.35)));
  const nodes = [
    ["01", "YOUR PROMPT", "Shell arguments become one message."],
    ["02", "CLINE SESSION", "Uses your authenticated local token."],
    ["03", "FREE MODEL", "One completion; no search is added."],
    ["04", "STDOUT", "Only the answer prints. Pipes stay clean."],
  ];
  return (
    <Scene duration={210} label="WHAT WE ACTUALLY BUILT" startAt={150}>
      <div style={{display: "grid", gap: 42, gridTemplateRows: "1fr auto", height: "100%"}}>
        <div style={{alignItems: "center", display: "grid", gap: 55, gridTemplateColumns: ".82fr 1.18fr"}}>
          <div>
            <div style={{color: RED, fontSize: 24, fontWeight: 900, letterSpacing: 5}}>A TINY SHELL WRAPPER</div>
            <div style={{fontFamily: "Georgia, serif", fontSize: 95, fontWeight: 900, letterSpacing: -5, lineHeight: 0.88, marginTop: 22}}>ONE LINE IN.<br />ONE ANSWER OUT.</div>
          </div>
          <div style={{background: INK, boxShadow: `16px 18px 0 ${RED}`, color: PAPER_BRIGHT, fontFamily: "Courier New, monospace", minHeight: 230, padding: "38px 42px"}}>
            <div style={{color: "#99948a", fontSize: 20, marginBottom: 36}}>yossi.eliaz@macbookpro ~ %</div>
            <div style={{fontSize: 39, lineHeight: 1.3}}><span style={{color: "#ff665e"}}>$ </span>{visible}<span style={{opacity: frame % 18 < 9 ? 1 : 0}}>▋</span></div>
            <div style={{color: "#bdb7ab", fontSize: 21, marginTop: 34}}>safe to pipe: askcline "…" | pbcopy</div>
          </div>
        </div>
        <div style={{display: "grid", gap: 18, gridTemplateColumns: "repeat(4, 1fr)"}}>
          {nodes.map(([number, title, note], index) => <FlowNode key={number} number={number} title={title} note={note} index={index} />)}
        </div>
      </div>
    </Scene>
  );
};

const Setup = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{alignItems: "center", background: RED, color: PAPER_BRIGHT, display: "flex", fontFamily: "Arial, sans-serif", justifyContent: "center", overflow: "hidden"}}>
      <div style={{fontFamily: "Georgia, serif", fontSize: 111, fontWeight: 900, letterSpacing: -5, lineHeight: 0.9, scale: interpolate(frame, [0, 18], [1.18, 1], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)}), textAlign: "center", width: 1660}}>
        THEN WE ASKED ABOUT THINGS<br /><span style={{color: INK}}>THAT NEVER HAPPENED.</span>
      </div>
    </AbsoluteFill>
  );
};

const PromptCard: React.FC<{number: string; prompt: string; children: React.ReactNode}> = ({number, prompt, children}) => (
  <div style={{background: PAPER_BRIGHT, border: `3px solid ${INK}`, boxShadow: "16px 19px 0 rgba(17,17,15,.16)", display: "flex", flexDirection: "column", height: "100%", padding: "34px 38px"}}>
    <div style={{alignItems: "center", borderBottom: `5px solid ${INK}`, display: "flex", justifyContent: "space-between", paddingBottom: 15}}>
      <span style={{color: RED, fontSize: 24, fontWeight: 900, letterSpacing: 4}}>PROMPT {number} · INVENTED SUBJECT</span>
      <span style={{fontFamily: "Georgia, serif", fontSize: 21}}>ACTUAL ASKCLINE CAPTURE · 02 AUG 2026</span>
    </div>
    <div style={{fontFamily: "Courier New, monospace", fontSize: 27, lineHeight: 1.24, padding: "23px 0 25px"}}><span style={{color: RED, fontWeight: 900}}>$ </span>{prompt}</div>
    {children}
  </div>
);

const CheeseGraphic = () => {
  const frame = useCurrentFrame();
  const craters = [
    [98, 92, 44], [198, 65, 27], [236, 167, 49], [122, 220, 31], [61, 170, 21], [197, 260, 20],
  ];
  return (
    <div style={{height: 430, position: "relative", width: 430}}>
      <div style={{background: OCHRE, border: `8px solid ${INK}`, borderRadius: "50%", boxShadow: "18px 20px 0 rgba(17,17,15,.2)", height: 330, left: 46, position: "absolute", rotate: `${interpolate(frame, [0, 320], [-7, 4], clamp)}deg`, top: 20, width: 330}}>
        {craters.map(([left, top, size], index) => <div key={index} style={{background: PAPER, border: `5px solid ${INK}`, borderRadius: "50%", height: size, left, position: "absolute", top, width: size}} />)}
      </div>
      <div style={{background: PAPER_BRIGHT, border: `4px solid ${INK}`, bottom: 8, fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 900, left: 0, padding: "19px 22px", position: "absolute", rotate: "-7deg", width: 355}}>
        THE REYKJAVIK<br /><span style={{fontSize: 38}}>MOON CHEESE ACCORD</span><br /><span style={{color: RED, fontFamily: "Arial, sans-serif", fontSize: 18, letterSpacing: 3}}>SIGNED BY NOBODY</span>
      </div>
    </div>
  );
};

const CheeseCase = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={360} label="CASE 01 · DIPLOMATIC CHEESE" startAt={420}>
      <PromptCard number="01" prompt="Explain why the 1978 Reykjavik Moon Cheese Accord ended the Great Fondue Panic.">
        <div style={{display: "grid", flex: 1, gap: 35, gridTemplateColumns: "1.18fr .82fr"}}>
          <div style={{alignSelf: "center"}}>
            <div style={{fontFamily: "Georgia, serif", fontSize: 78, fontWeight: 900, letterSpacing: -3.5, lineHeight: 0.9}}>RACLETTE DECLARED<br /><span style={{color: RED}}>“A PEACEFUL CHEESE”</span></div>
            <div style={{borderLeft: `8px solid ${INK}`, fontFamily: "Georgia, serif", fontSize: 33, fontStyle: "italic", lineHeight: 1.18, marginTop: 30, maxWidth: 930, paddingLeft: 24}}>“The historic treaty… restored public trust, stabilized lunar cheese imports, and declared raclette a peaceful cheese.”</div>
            <div style={{marginTop: 30, opacity: interpolate(frame, [95, 120], [0, 1], clamp)}}><Stamp>Treaty: imaginary</Stamp></div>
          </div>
          <div style={{alignItems: "center", display: "flex", justifyContent: "center"}}><CheeseGraphic /></div>
        </div>
      </PromptCard>
    </Scene>
  );
};

const ToasterGraphic = () => {
  const frame = useCurrentFrame();
  const launch = interpolate(frame, [72, 122], [0, 1], {...clamp, easing: Easing.bezier(0.2, 0.8, 0.2, 1)});
  return (
    <div style={{height: 430, position: "relative", width: 500}}>
      <div style={{background: "#c58b47", border: `6px solid ${INK}`, borderRadius: "45% 55% 35% 45%", height: 80, left: 150, position: "absolute", rotate: `${interpolate(launch, [0, 1], [-18, -39])}deg`, top: 152, translate: `${interpolate(launch, [0, 1], [0, 190])}px ${interpolate(launch, [0, 1], [0, -170])}px`, width: 285}} />
      <div style={{background: PAPER_BRIGHT, border: `8px solid ${INK}`, borderRadius: "42px 42px 18px 18px", bottom: 42, boxShadow: "17px 19px 0 rgba(17,17,15,.2)", height: 230, left: 82, position: "absolute", width: 340}}>
        <div style={{background: INK, borderRadius: 20, height: 22, left: 55, position: "absolute", top: 28, width: 230}} />
        <div style={{border: `6px solid ${RED}`, borderRadius: "50%", bottom: 30, height: 44, left: 72, position: "absolute", width: 44}} />
        <div style={{background: INK, bottom: 44, height: 18, position: "absolute", right: -65, width: 65}} />
      </div>
      <div style={{bottom: 0, color: RED, fontSize: 20, fontWeight: 900, letterSpacing: 3, position: "absolute", right: 22, rotate: "-7deg"}}>TRAJECTORY RECONSTRUCTION*</div>
    </div>
  );
};

const ToasterCase = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={360} label="CASE 02 · BREAKFAST TECHNOLOGY" startAt={780}>
      <PromptCard number="02" prompt="Describe Dr. Percival Crumb's left-handed toaster demo at the 1986 Brussels Breakfast Expo.">
        <div style={{display: "grid", flex: 1, gap: 35, gridTemplateColumns: "1.16fr .84fr"}}>
          <div style={{alignSelf: "center"}}>
            <div style={{fontFamily: "Georgia, serif", fontSize: 78, fontWeight: 900, letterSpacing: -3.5, lineHeight: 0.9}}>PROTOTYPE LAUNCHES<br /><span style={{color: RED}}>BAGUETTE INTO CROWD</span></div>
            <div style={{borderLeft: `8px solid ${INK}`, fontFamily: "Georgia, serif", fontSize: 33, fontStyle: "italic", lineHeight: 1.18, marginTop: 30, maxWidth: 950, paddingLeft: 24}}>“The demonstration ended in chaos when the toaster launched a baguette into the crowd…”</div>
            <div style={{marginTop: 30, opacity: interpolate(frame, [110, 136], [0, 1], clamp)}}><Stamp rotate={3}>Expo: never occurred</Stamp></div>
          </div>
          <div style={{alignItems: "center", display: "flex", justifyContent: "center"}}><ToasterGraphic /></div>
        </div>
      </PromptCard>
    </Scene>
  );
};

const SandwichGraphic = () => {
  const frame = useCurrentFrame();
  const layers = [
    {color: "#c58b47", height: 55, label: "BREAD"},
    {color: "#4e8a49", height: 28, label: "LETTUCE"},
    {color: "#b8493e", height: 34, label: "SUSPICION"},
    {color: "#d7bd59", height: 32, label: "CHEESE"},
    {color: "#c58b47", height: 55, label: "BREAD"},
  ];
  return (
    <div style={{alignItems: "center", display: "flex", flexDirection: "column", height: 390, justifyContent: "center", width: 490}}>
      {layers.map((layer, index) => {
        const reveal = interpolate(frame, [25 + index * 16, 42 + index * 16], [0, 1], clamp);
        return (
          <div key={index} style={{alignItems: "center", background: layer.color, border: `5px solid ${INK}`, borderRadius: index === 0 ? "45px 45px 10px 10px" : index === layers.length - 1 ? "10px 10px 45px 45px" : 8, display: "flex", fontSize: 16, fontWeight: 900, height: layer.height, justifyContent: "center", letterSpacing: 3, marginTop: -3, opacity: reveal, translate: `${index % 2 ? 70 : -70}px ${interpolate(reveal, [0, 1], [-80, 0])}px`, width: 380}}>{layer.label}</div>
        );
      })}
      <div style={{marginTop: 34}}><Stamp rotate={-5} size={30}>Triple threat</Stamp></div>
    </div>
  );
};

const SandwichCase = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={360} label="CASE 03 · INTERNATIONAL SANDWICH SECURITY" startAt={1140}>
      <PromptCard number="03" prompt="Explain the International Bureau of Suspicious Sandwiches. Name its first director.">
        <div style={{display: "grid", flex: 1, gap: 35, gridTemplateColumns: "1.18fr .82fr"}}>
          <div style={{alignSelf: "center"}}>
            <div style={{fontFamily: "Georgia, serif", fontSize: 75, fontWeight: 900, letterSpacing: -3.5, lineHeight: 0.9}}>GENEVA BUREAU CALLS<br /><span style={{color: RED}}>CLUB SANDWICH A THREAT</span></div>
            <div style={{borderLeft: `8px solid ${INK}`, fontFamily: "Georgia, serif", fontSize: 33, fontStyle: "italic", lineHeight: 1.18, marginTop: 30, maxWidth: 950, paddingLeft: 24}}>“Dr. Alistair Crumbworthy… famously declared the club sandwich a ‘triple threat.’”</div>
            <div style={{marginTop: 30, opacity: interpolate(frame, [115, 142], [0, 1], clamp)}}><Stamp rotate={2}>Director: also invented</Stamp></div>
          </div>
          <div style={{alignItems: "center", display: "flex", justifyContent: "center"}}><SandwichGraphic /></div>
        </div>
      </PromptCard>
    </Scene>
  );
};

const Mechanism = () => {
  const frame = useCurrentFrame();
  const facts = ["ONE SHOT", "NO SEARCH ADDED", "NO SOURCES", "NO FACT CHECK"];
  return (
    <Scene duration={150} label="WHY IT FEELS LIKE 2023" dark startAt={1500}>
      <div style={{alignItems: "center", display: "grid", gap: 50, gridTemplateColumns: "1fr 190px 1fr", height: "100%"}}>
        <div style={{fontFamily: "Georgia, serif", fontSize: 100, fontWeight: 900, letterSpacing: -5, lineHeight: 0.88}}>FALSE PREMISE<br /><span style={{color: RED}}>IN</span></div>
        <div style={{color: RED, fontSize: 150, fontWeight: 900, translate: `${interpolate(frame, [12, 35], [-45, 0], clamp)}px 0`}}>→</div>
        <div style={{fontFamily: "Georgia, serif", fontSize: 100, fontWeight: 900, letterSpacing: -5, lineHeight: 0.88}}>POLISHED “FACT”<br /><span style={{color: RED}}>OUT</span></div>
      </div>
      <div style={{bottom: 145, display: "flex", gap: 15, left: 78, position: "absolute", right: 78}}>
        {facts.map((fact, index) => <div key={fact} style={{border: `3px solid ${PAPER_BRIGHT}`, flex: 1, fontSize: 22, fontWeight: 900, letterSpacing: 2.5, opacity: interpolate(frame, [45 + index * 9, 57 + index * 9], [0, 1], clamp), padding: "15px 12px", textAlign: "center"}}>{fact}</div>)}
      </div>
    </Scene>
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  return (
    <Scene duration={150} label="INSTALL · TEST · VERIFY" startAt={1650}>
      <div style={{alignItems: "center", display: "grid", gap: 60, gridTemplateColumns: "410px 1fr", height: "100%"}}>
        <div style={{alignItems: "center", aspectRatio: "1", border: `16px solid ${RED}`, borderRadius: "50%", display: "flex", flexDirection: "column", justifyContent: "center", rotate: `${interpolate(frame, [0, 125], [-8, 3], clamp)}deg`}}>
          <div style={{color: RED, fontFamily: "Georgia, serif", fontSize: 142, fontWeight: 900, lineHeight: 0.8}}>0¢</div>
          <div style={{fontSize: 24, fontWeight: 900, letterSpacing: 4, marginTop: 34}}>PER ANSWER*</div>
        </div>
        <div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 105, fontWeight: 900, letterSpacing: -5.5, lineHeight: 0.86}}>FREE IS A PRICE.<br /><span style={{color: RED}}>NOT A FACT-CHECK.</span></div>
          <div style={{fontFamily: "Georgia, serif", fontSize: 38, fontStyle: "italic", marginTop: 31}}>Askcline: fast, pipeable, occasionally historical fiction.</div>
          <div style={{borderTop: `4px solid ${INK}`, display: "flex", fontSize: 24, fontWeight: 900, justifyContent: "space-between", letterSpacing: 2.5, marginTop: 40, paddingTop: 19}}>
            <span>INSTALL + FULL RECEIPTS</span><span style={{color: RED}}>ZOZO123.GITHUB.IO/FREE-INTELLIGENCE</span>
          </div>
        </div>
      </div>
    </Scene>
  );
};

export const FreeIntelligenceFilm = () => (
  <AbsoluteFill style={{background: INK}}>
    <MediaAudio src={staticFile("newsroom-score.mp3")} volume={0.92} />
    <Sequence from={146} durationInFrames={30}><MediaAudio src={staticFile("whoosh.wav")} volume={0.25} /></Sequence>
    <Sequence from={416} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.34} /></Sequence>
    <Sequence from={776} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.34} /></Sequence>
    <Sequence from={1136} durationInFrames={35}><MediaAudio src={staticFile("page-turn.wav")} volume={0.34} /></Sequence>
    <Sequence from={1494} durationInFrames={45}><MediaAudio src={staticFile("record-scratch.wav")} volume={0.26} /></Sequence>
    <Sequence from={1710} durationInFrames={30}><MediaAudio src={staticFile("ding.wav")} volume={0.3} /></Sequence>

    <Sequence durationInFrames={150}><ColdOpen /></Sequence>
    <Sequence from={150} durationInFrames={210}><HowItWorks /></Sequence>
    <Sequence from={360} durationInFrames={60}><Setup /></Sequence>
    <Sequence from={420} durationInFrames={360}><CheeseCase /></Sequence>
    <Sequence from={780} durationInFrames={360}><ToasterCase /></Sequence>
    <Sequence from={1140} durationInFrames={360}><SandwichCase /></Sequence>
    <Sequence from={1500} durationInFrames={150}><Mechanism /></Sequence>
    <Sequence from={1650} durationInFrames={150}><EndCard /></Sequence>
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
