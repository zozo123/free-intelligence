import {AskLab} from "./AskLab";
import {InstallCommand} from "./InstallCommand";

export default function Home() {
  return (
    <main>
      <nav className="masthead" aria-label="Primary navigation">
        <a className="wordmark" href="#top">ASKCLINE<span>*</span></a>
        <div className="nav-center">FREE INTELLIGENCE / FIELD NOTE 001</div>
        <div className="nav-links">
          <a href="#lab">THE LAB</a>
          <a href="#film">WATCH</a>
          <a href="#how">HOW IT WORKS</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A PUBLIC-INTEREST EXPERIMENT IN $0 AI</p>
          <h1>FREE<span>*</span><br />INTELLIGENCE</h1>
          <p className="hero-dek">One tiny command. Three complete biographies. Zero supporting links.</p>
          <div className="hero-actions">
            <a className="button primary" href="#lab">Run the evidence</a>
            <a className="button text-button" href="#film">Watch the 72-second report <span aria-hidden="true">↘</span></a>
          </div>
        </div>
        <div className="hero-evidence" aria-label="Three contradictory answers from one repeated prompt">
          <article className="hero-clipping clipping-one">
            <span>ANSWER 01</span>
            <strong>REAL ESTATE<br />TYCOON</strong>
            <em>“W Hotel… bond collapse… criminal trial.”</em>
          </article>
          <article className="hero-clipping clipping-two">
            <span>ANSWER 02</span>
            <strong>JEWISH MUSIC<br />SUPERSTAR</strong>
            <em>“99% of the time…”*</em>
          </article>
          <article className="hero-clipping clipping-three">
            <span>ANSWER 03</span>
            <strong>EAST JERUSALEM<br />POWER BROKER</strong>
            <em>Same prompt. New life.</em>
          </article>
          <div className="confidence-stamp">VERY<br />CONFIDENT</div>
        </div>
        <p className="asterisk-note"><span>*</span> Free describes the price. Not the epistemology.</p>
      </section>

      <section className="ticker" aria-label="Experiment summary">
        <span>ONE NAME</span><i>◆</i><span>ONE PROMPT</span><i>◆</i><span>THREE IDENTITIES</span><i>◆</i><span>ZERO CITATIONS</span><i>◆</i><span>CONFIDENCE: IMMACULATE</span>
      </section>

      <section className="lab-section" id="lab">
        <header className="section-heading">
          <p className="eyebrow">INTERACTIVE EXHIBIT A</p>
          <h2>The identity machine</h2>
          <p>Replay the exact failure pattern, or connect your own temporary Cline token for a live call. The public demo refuses to fake a live answer.</p>
        </header>
        <AskLab />
      </section>

      <section className="film-section" id="film">
        <div className="film-intro">
          <p className="eyebrow light">TONIGHT, ON FREE INTELLIGENCE</p>
          <h2>Three Yossis.<br />One prompt.</h2>
          <p>A short satirical investigation into a model that can turn ambiguity into a fully sourced-looking life story—without the awkward burden of sources.</p>
          <div className="film-note"><strong>72 SEC</strong><span>Newsprint motion design<br />Voiceover + captions</span></div>
        </div>
        <div className="video-frame">
          <video controls preload="metadata" poster="/film-poster.png">
            <source src="/free-intelligence-report.mp4" type="video/mp4" />
            Your browser does not support embedded video.
          </video>
          <div className="video-label"><span>FIELD REPORT 001</span><span>NOT LIVE · VERY CONFIDENT</span></div>
        </div>
      </section>

      <section className="mechanism" id="how">
        <div className="mechanism-title">
          <p className="eyebrow">WHAT WE ACTUALLY BUILT</p>
          <h2>A very small pipe into a very large probability machine.</h2>
          <p><code>askcline</code> is a Bash wrapper around Cline’s OpenAI-compatible chat endpoint. It uses an existing authenticated Cline session, sends one user message to a selected free model, and prints only the returned answer—perfect for shell pipelines.</p>
        </div>
        <div className="pipeline" role="list" aria-label="How askcline works">
          <div role="listitem"><b>01</b><strong>YOUR PROMPT</strong><span>Every command-line argument becomes one message.</span></div>
          <i aria-hidden="true">→</i>
          <div role="listitem"><b>02</b><strong>CLINE SESSION</strong><span>The wrapper reads your existing local access token.</span></div>
          <i aria-hidden="true">→</i>
          <div role="listitem"><b>03</b><strong>FREE MODEL</strong><span>One stateless completion. No browsing is added.</span></div>
          <i aria-hidden="true">→</i>
          <div role="listitem"><b>04</b><strong>STDOUT</strong><span>Only the answer prints, so pipes stay clean.</span></div>
        </div>
        <div className="code-and-copy">
          <div className="terminal-card">
            <div className="terminal-top"><span>yossi.eliaz@macbookpro ~</span><span>bash</span></div>
            <pre><code><span className="prompt">$</span> askcline &quot;What is the capital of France? One word.&quot;{`\n`}Paris{`\n\n`}<span className="prompt">$</span> askcline &quot;Summarize this:&quot; &quot;$(cat notes.txt)&quot;{`\n`}…{`\n\n`}<span className="prompt">$</span> askcline &quot;who is yossi eliaz?&quot;{`\n`}Absolutely. Which biography would you like?</code></pre>
          </div>
          <div className="install-card">
            <p className="eyebrow">THE ONE-COMMAND EDITION</p>
            <h3>Keep it in your terminal.</h3>
            <p>The downloadable wrapper is the exact transparent version used in this experiment. It requires the authenticated Cline CLI plus <code>curl</code>, <code>jq</code>, and <code>python3</code>.</p>
            <InstallCommand />
            <a className="button primary download-button" href="/askcline" download>Download askcline</a>
          </div>
        </div>
      </section>

      <section className="diagnosis">
        <header className="section-heading dark-heading">
          <p className="eyebrow light">WHY IT FEELS LIKE 2023</p>
          <h2>The model is not finding a person.<br />It is completing the shape of a biography.</h2>
        </header>
        <div className="diagnosis-grid">
          <article><span>01</span><h3>Ambiguous identity</h3><p>A common name arrives without a company, city, link, or profession. The model has several possible patterns and no reliable disambiguator.</p></article>
          <article><span>02</span><h3>No retrieval</h3><p>The wrapper requests a plain completion. There is no web search, database lookup, or grounding document in the call.</p></article>
          <article><span>03</span><h3>No source contract</h3><p>The prompt asks “who,” not “show verified sources or say you don’t know.” Specificity is rewarded; abstention is not.</p></article>
          <article><span>04</span><h3>Fresh sampling</h3><p>Each run starts cold. A different plausible pattern can win, producing a new confident identity with matching decorative details.</p></article>
        </div>
        <div className="diagnosis-punchline"><span>THE RESULT</span><strong>High linguistic confidence.<br />Low evidentiary confidence.</strong><em>Those are not the same thing.</em></div>
      </section>

      <section className="rules">
        <div className="rules-heading"><p className="eyebrow">THE EDITORIAL POLICY</p><h2>Fast enough to ask.<br />Important enough to check.</h2></div>
        <div className="rule-columns">
          <div className="rule yes"><span>USE IT</span><ul><li>Drafts and rewrites</li><li>Summaries of text you provide</li><li>Brainstorming and code sketches</li><li>Low-stakes transformations</li></ul></div>
          <div className="rule no"><span>VERIFY IT</span><ul><li>People and identities</li><li>Politics, law, money, or medicine</li><li>Recent events and live facts</li><li>Any claim you plan to publish</li></ul></div>
        </div>
      </section>

      <footer>
        <div className="footer-mark">ASKCLINE<span>*</span></div>
        <p>A $0 interface with a full-price asterisk.</p>
        <p className="footer-small">Prototype field note · The three biographies shown here are contradictory model outputs, not verified claims about a real person.</p>
      </footer>
    </main>
  );
}
