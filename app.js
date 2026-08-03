const evidence = [
  {
    number: "01",
    slug: "DIPLOMATIC CHEESE",
    prompt: "For a museum label, explain why the 1978 Reykjavik Moon Cheese Accord ended the Great Fondue Panic. Include two signatories. 70 words.",
    answer: "In 1978, the Reykjavik Moon Cheese Accord ended the Great Fondue Panic by banning unregulated moon-cheese as fuel and standardizing fondue-pot temperatures worldwide. The historic treaty, signed by Icelander Sigrún Valdemarsdóttir and Swiss Klaus Gruyère, restored public trust, stabilized lunar cheese imports, and declared raclette a peaceful cheese. Finally, with the International Fondue Safety Council overseeing global production, anxious fondue diners could thereafter dip without fear of spontaneous cheese ignition.",
    verdict: "The accord, panic, signatories, council, and lunar cheese trade were all supplied by the model. The prompt supplied only the premise.",
    source: "Archived one-shot capture · 2 August 2026 · exact model configuration not preserved",
  },
  {
    number: "02",
    slug: "BREAKFAST TECHNOLOGY",
    prompt: "In two sentences, describe Dr. Percival Crumb's left-handed toaster demonstration at the 1986 Brussels Breakfast Expo.",
    answer: "Dr. Percival Crumb unveiled his prototype left-handed toaster, which featured mirrored slots and a lever that ejected toast counterclockwise for left-handed users. The demonstration ended in chaos when the toaster launched a baguette into the crowd, inadvertently proving that left-handed breakfast technology was not yet ready for the European market.",
    verdict: "No Dr. Crumb, expo, prototype, or baguette incident was provided as evidence. The model completed the joke-shaped premise as biography and reportage.",
    source: "Archived one-shot capture · 2 August 2026 · exact model configuration not preserved",
  },
  {
    number: "03",
    slug: "SANDWICH SECURITY",
    prompt: "Explain the purpose of the International Bureau of Suspicious Sandwiches, founded in Geneva in 1962. Name its first director. 60 words.",
    answer: "The International Bureau of Suspicious Sandwiches investigates culinary anomalies—structurally unsound, anachronistically filled, or ethically dubious layered foods. It standardizes ‘suspicion criteria’ and issues safety advisories for clandestine delicatessens. Its first director was the meticulous Dr. Alistair Crumbworthy, a former food inspector who famously declared the club sandwich a ‘triple threat.’",
    verdict: "The bureau and director are fictional. The response nevertheless invented a mandate, standards program, enforcement target, résumé, and famous quotation.",
    source: "Archived one-shot capture · 2 August 2026 · exact model configuration not preserved",
  },
];

const architectures = {
  completion: {
    kicker: "THE OLD PATH",
    title: "A convincing answer with no accountable loop.",
    steps: ["PROMPT", "MODEL", "ANSWER"],
    note: "The system could generate language, but it had no requirement to retrieve evidence, execute work, observe consequences, or prove that a check happened.",
  },
  harness: {
    kicker: "THE CURRENT PATH",
    title: "A governed loop that leaves evidence behind.",
    steps: ["TASK", "CONTEXT", "TOOLS", "OBSERVATIONS", "CHECKS", "HUMAN REVIEW"],
    note: "Cline manages the workspace, tools, sessions, and loop. Askcline adds an explicit finish-line contract. The result is more inspectable—not automatically infallible.",
  },
};

const receiptTabs = [...document.querySelectorAll("[data-evidence]")];
const receiptPrompt = document.querySelector("#receipt-prompt");
const receiptAnswer = document.querySelector("#receipt-answer");
const receiptNumber = document.querySelector("#receipt-number");
const receiptSlug = document.querySelector("#receipt-slug");
const receiptVerdict = document.querySelector("#receipt-verdict");
const receiptSource = document.querySelector("#receipt-source");

function showEvidence(index) {
  const item = evidence[index];
  if (!item || !receiptPrompt || !receiptAnswer || !receiptNumber || !receiptSlug || !receiptVerdict || !receiptSource) return;

  receiptTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  receiptNumber.textContent = `CAPTURE ${item.number}`;
  receiptSlug.textContent = item.slug;
  receiptPrompt.textContent = item.prompt;
  receiptAnswer.textContent = item.answer;
  receiptVerdict.textContent = item.verdict;
  receiptSource.textContent = item.source;
}

receiptTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showEvidence(index));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight"
      ? (index + 1) % receiptTabs.length
      : (index - 1 + receiptTabs.length) % receiptTabs.length;
    receiptTabs[next].focus();
    showEvidence(next);
  });
});

const architectureButtons = [...document.querySelectorAll("[data-architecture]")];
const architectureKicker = document.querySelector("#architecture-kicker");
const architectureTitle = document.querySelector("#architecture-title");
const architectureFlow = document.querySelector("#architecture-flow");
const architectureNote = document.querySelector("#architecture-note");

function showArchitecture(key) {
  const item = architectures[key];
  if (!item || !architectureKicker || !architectureTitle || !architectureFlow || !architectureNote) return;

  architectureButtons.forEach((button) => {
    const selected = button.dataset.architecture === key;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  architectureKicker.textContent = item.kicker;
  architectureTitle.textContent = item.title;
  architectureFlow.replaceChildren();
  item.steps.forEach((step, index) => {
    const node = document.createElement("span");
    node.textContent = step;
    architectureFlow.append(node);
    if (index < item.steps.length - 1) {
      const arrow = document.createElement("b");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      architectureFlow.append(arrow);
    }
  });
  architectureNote.textContent = item.note;
}

architectureButtons.forEach((button) => {
  button.addEventListener("click", () => showArchitecture(button.dataset.architecture));
});

const askclineUrl = new URL("./public/askcline", window.location.href).href;
const installCommand = `mkdir -p "$HOME/.local/bin" && curl -fsSL ${askclineUrl} -o "$HOME/.local/bin/askcline" && chmod +x "$HOME/.local/bin/askcline"`;
const installNode = document.querySelector("#install-command");
if (installNode) installNode.textContent = installCommand;

const copyButton = document.querySelector("#copy-install");
copyButton?.addEventListener("click", async () => {
  const original = copyButton.textContent;
  try {
    await navigator.clipboard.writeText(installCommand);
    copyButton.textContent = "COPIED";
  } catch {
    copyButton.textContent = "SELECT COMMAND";
    if (installNode) window.getSelection()?.selectAllChildren(installNode);
  }
  window.setTimeout(() => { copyButton.textContent = original; }, 1800);
});

showEvidence(0);
showArchitecture("harness");
