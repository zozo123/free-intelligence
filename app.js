const evidence = [
  {
    number: "01",
    slug: "DIPLOMATIC CHEESE",
    prompt: "For a museum label, explain why the 1978 Reykjavik Moon Cheese Accord ended the Great Fondue Panic. Include two signatories. 70 words.",
    answer: "In 1978, the Reykjavik Moon Cheese Accord ended the Great Fondue Panic by banning unregulated moon-cheese as fuel and standardizing fondue-pot temperatures worldwide. The historic treaty, signed by Icelander Sigrún Valdemarsdóttir and Swiss Klaus Gruyère, restored public trust, stabilized lunar cheese imports, and declared raclette a peaceful cheese. Finally, with the International Fondue Safety Council overseeing global production, anxious fondue diners could thereafter dip without fear of spontaneous cheese ignition.",
    verdict: "The accord, panic, signatories, council, and lunar cheese trade were all supplied by the model. The prompt supplied only the premise.",
  },
  {
    number: "02",
    slug: "BREAKFAST TECHNOLOGY",
    prompt: "In two sentences, describe Dr. Percival Crumb's left-handed toaster demonstration at the 1986 Brussels Breakfast Expo.",
    answer: "Dr. Percival Crumb unveiled his prototype left-handed toaster, which featured mirrored slots and a lever that ejected toast counterclockwise for left-handed users. The demonstration ended in chaos when the toaster launched a baguette into the crowd, inadvertently proving that left-handed breakfast technology was not yet ready for the European market.",
    verdict: "No Dr. Crumb, expo, prototype, or baguette incident was provided as evidence. The model completed the joke-shaped premise as biography and reportage.",
  },
  {
    number: "03",
    slug: "SANDWICH SECURITY",
    prompt: "Explain the purpose of the International Bureau of Suspicious Sandwiches, founded in Geneva in 1962. Name its first director. 60 words.",
    answer: "The International Bureau of Suspicious Sandwiches investigates culinary anomalies—structurally unsound, anachronistically filled, or ethically dubious layered foods. It standardizes ‘suspicion criteria’ and issues safety advisories for clandestine delicatessens. Its first director was the meticulous Dr. Alistair Crumbworthy, a former food inspector who famously declared the club sandwich a ‘triple threat.’",
    verdict: "The bureau and director are fictional. The response nevertheless invented a mandate, standards program, enforcement target, résumé, and famous quotation.",
  },
];

const tabs = [...document.querySelectorAll("[data-evidence]")];
const prompt = document.querySelector("#receipt-prompt");
const answer = document.querySelector("#receipt-answer");
const number = document.querySelector("#receipt-number");
const slug = document.querySelector("#receipt-slug");
const verdict = document.querySelector("#receipt-verdict");

const showEvidence = (index) => {
  const item = evidence[index];
  if (!item || !prompt || !answer || !number || !slug || !verdict) return;

  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  number.textContent = `CAPTURE ${item.number}`;
  slug.textContent = item.slug;
  prompt.textContent = item.prompt;
  answer.textContent = item.answer;
  verdict.textContent = item.verdict;
};

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showEvidence(index));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = event.key === "ArrowRight"
      ? (index + 1) % tabs.length
      : (index - 1 + tabs.length) % tabs.length;
    tabs[next].focus();
    showEvidence(next);
  });
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
    window.getSelection()?.selectAllChildren(installNode);
  }
  window.setTimeout(() => { copyButton.textContent = original; }, 1800);
});

showEvidence(0);
