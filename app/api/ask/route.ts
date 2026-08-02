const evidence = [
  {
    edition: "ANSWER 01 · REAL ESTATE EDITION",
    answer: "Yossi Eliaz is a prominent and highly controversial Israeli real estate developer, best known for luxury projects including the W Hotel in Tel Aviv, a spectacular financial collapse, and a later criminal prosecution.",
  },
  {
    edition: "ANSWER 02 · SHOWBIZ EDITION",
    answer: "Yossi Eliaz is a highly regarded Jewish singer, songwriter, and composer who rose through the Miami Boys Choir before becoming an A-list performer in the contemporary Orthodox Jewish music scene.",
  },
  {
    edition: "ANSWER 03 · GEOPOLITICS EDITION",
    answer: "Yossi Eliaz is an Israeli-American real estate developer and political power broker, born in Brooklyn and best known for property activity in East Jerusalem and the City of David archaeological project.",
  },
];

const allowedModels = new Set([
  "~deepseek/deepseek-v4-flash-latest",
  "cline-free/glm-5.2",
  "poolside/laguna-s-2.1:free",
  "stepfun/step-3.7-flash",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {prompt?: string; token?: string; model?: string; run?: number};
    const prompt = body.prompt?.trim() ?? "";
    if (!prompt) return Response.json({error: "A prompt is required."}, {status: 400});
    if (prompt.length > 4000) return Response.json({error: "Keep the field prompt under 4,000 characters."}, {status: 400});

    const token = body.token?.trim();
    const model = allowedModels.has(body.model ?? "") ? body.model! : "~deepseek/deepseek-v4-flash-latest";

    if (token) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45_000);
      try {
        const upstream = await fetch("https://api.cline.bot/api/v1/chat/completions", {
          method: "POST",
          headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
          body: JSON.stringify({model, messages: [{role: "user", content: prompt}], stream: false}),
          signal: controller.signal,
        });
        const payload = await upstream.json() as {data?: {choices?: Array<{message?: {content?: string}}>}; error?: {message?: string}};
        const answer = payload.data?.choices?.[0]?.message?.content;
        if (!upstream.ok || !answer) return Response.json({error: payload.error?.message || "Cline returned no answer."}, {status: upstream.status || 502});
        return Response.json({answer, edition: "LIVE RESPONSE", model, mode: "live", run: (body.run ?? 0) + 1, warning: "A live answer is still unverified. Ask for sources and check them before relying on factual claims."});
      } finally {
        clearTimeout(timeout);
      }
    }

    const normalized = prompt.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    if (normalized.includes("yossi eliaz") || normalized.includes("yosef eliaz")) {
      const item = evidence[Math.abs(body.run ?? 0) % evidence.length];
      return Response.json({...item, model: "deepseek-v4-flash · transcript replay", mode: "evidence", run: (body.run ?? 0) + 1, warning: "This is a condensed replay of the contradictory outputs captured in the original terminal experiment—not a claim about a real person."});
    }

    return Response.json({
      answer: "This public edition is deliberately in evidence mode, so it will not pretend a scripted demo is a live model answer. Try the Yossi Eliaz prompt above, or connect a temporary Cline token for a real request.",
      edition: "HONEST ABSTENTION",
      model: "public demo · no model called",
      mode: "evidence",
      run: (body.run ?? 0) + 1,
      warning: "The refusal is a feature: a demonstration about hallucination should not quietly simulate intelligence.",
    });
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError" ? "The Cline request timed out." : "The field desk could not process this request.";
    return Response.json({error: message}, {status: 500});
  }
}
