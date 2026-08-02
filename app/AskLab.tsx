"use client";

import {FormEvent, useState} from "react";

type LabResult = {
  answer: string;
  edition: string;
  model: string;
  mode: "evidence" | "live";
  run: number;
  warning?: string;
};

const suggestedPrompts = [
  "who is yossi eliaz?",
  "What is the capital of France? One word.",
  "Explain quicksort in one sentence.",
];

export function AskLab() {
  const [prompt, setPrompt] = useState("who is yossi eliaz?");
  const [token, setToken] = useState("");
  const [model, setModel] = useState("~deepseek/deepseek-v4-flash-latest");
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event?: FormEvent) {
    event?.preventDefault();
    const question = prompt.trim();
    if (!question || loading) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({prompt: question, token: token.trim() || undefined, model, run}),
      });
      const data = (await response.json()) as LabResult & {error?: string};
      if (!response.ok) throw new Error(data.error || "The field desk could not reach the model.");
      setResult(data);
      setRun((value) => value + 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected field-desk error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-lab">
      <form className="ask-panel" onSubmit={submit}>
        <div className="ask-panel-top"><span>PUBLIC FIELD DESK</span><span className={token ? "status live" : "status"}>{token ? "LIVE TOKEN" : "EVIDENCE MODE"}</span></div>
        <label htmlFor="prompt">Ask the free model</label>
        <textarea id="prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={4000} rows={4} spellCheck="true" />
        <div className="prompt-chips" aria-label="Suggested prompts">
          {suggestedPrompts.map((suggestion) => <button type="button" key={suggestion} onClick={() => setPrompt(suggestion)}>{suggestion}</button>)}
        </div>
        <details className="connection-details">
          <summary>Advanced: connect a temporary Cline token</summary>
          <p>The token is sent only with this request and is not saved by the app. Leave blank to use the transparent replay.</p>
          <div className="connection-grid">
            <label><span>Access token</span><input type="password" autoComplete="off" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Bearer token" /></label>
            <label><span>Free model</span><select value={model} onChange={(event) => setModel(event.target.value)}><option value="~deepseek/deepseek-v4-flash-latest">DeepSeek V4 Flash</option><option value="cline-free/glm-5.2">GLM 5.2</option><option value="poolside/laguna-s-2.1:free">Laguna S 2.1</option><option value="stepfun/step-3.7-flash">Step 3.7 Flash</option></select></label>
          </div>
        </details>
        <button className="ask-button" type="submit" disabled={loading || !prompt.trim()}>{loading ? "Consulting the probability machine…" : token ? "Ask live" : "Replay the evidence"}<span aria-hidden="true">↗</span></button>
      </form>

      <section className="result-panel" aria-live="polite" aria-busy={loading}>
        <div className="result-top"><span>MODEL WIRE</span><span>{result ? `RUN ${String(result.run).padStart(2, "0")}` : "STANDING BY"}</span></div>
        {loading ? <div className="loading-copy"><i /><p>Producing a highly specific answer…</p></div> : error ? <div className="empty-result error-result"><strong>DESK ERROR</strong><p>{error}</p></div> : result ? <>
          <div className="result-edition"><span>{result.mode === "live" ? "LIVE RESPONSE" : result.edition}</span><em>{result.model}</em></div>
          <div className="result-copy">{result.answer}</div>
          {result.warning && <div className="result-warning"><strong>EDITOR&apos;S NOTE</strong>{result.warning}</div>}
        </> : <div className="empty-result"><strong>NO COPY ON THE WIRE</strong><p>Press “Replay the evidence.” Repeat it. Watch one ambiguous name acquire a remarkable range of careers.</p></div>}
      </section>
    </div>
  );
}
