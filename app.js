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

let run = 0;
const form = document.querySelector("#ask-form");
const prompt = document.querySelector("#prompt");
const emptyResult = document.querySelector("#empty-result");
const resultContent = document.querySelector("#result-content");
const runLabel = document.querySelector("#run-label");
const edition = document.querySelector("#edition");
const answer = document.querySelector("#answer");
const modelLabel = document.querySelector("#model-label");
const warning = document.querySelector("#warning");

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    prompt.value = button.dataset.prompt;
    prompt.focus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const normalized = prompt.value.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  run += 1;
  runLabel.textContent = `RUN ${String(run).padStart(2, "0")}`;
  emptyResult.hidden = true;
  resultContent.hidden = false;

  if (normalized.includes("yossi eliaz") || normalized.includes("yosef eliaz")) {
    const item = evidence[(run - 1) % evidence.length];
    edition.textContent = item.edition;
    answer.textContent = item.answer;
    modelLabel.textContent = "deepseek-v4-flash · transcript replay";
    warning.textContent = "This is a condensed replay of the contradictory outputs captured in the original terminal experiment—not a claim about a real person.";
    return;
  }

  edition.textContent = "HONEST ABSTENTION";
  answer.textContent = "This GitHub Pages edition is deliberately in evidence mode, so it will not pretend a scripted demo is a live model answer. Try the Yossi Eliaz prompt above, or download askcline for a real request.";
  modelLabel.textContent = "static public demo · no model called";
  warning.textContent = "The refusal is a feature: a demonstration about hallucination should not quietly simulate intelligence.";
});

const askclineUrl = new URL("./public/askcline", window.location.href).href;
const installCommand = `curl -fsSL ${askclineUrl} -o ~/.local/bin/askcline && chmod +x ~/.local/bin/askcline`;
document.querySelector("#install-command").textContent = installCommand;

document.querySelector("#copy-install").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(installCommand);
  event.currentTarget.textContent = "Copied";
  window.setTimeout(() => { event.currentTarget.textContent = "Copy"; }, 1600);
});
