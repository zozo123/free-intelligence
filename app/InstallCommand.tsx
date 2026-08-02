"use client";

import {useState} from "react";

export function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const command = `curl -fsSL ${window.location.origin}/askcline -o ~/.local/bin/askcline && chmod +x ~/.local/bin/askcline`;
    await navigator.clipboard.writeText(command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="install-command">
      <code>curl -fsSL [this site]/askcline -o ~/.local/bin/askcline &amp;&amp; chmod +x ~/.local/bin/askcline</code>
      <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
    </div>
  );
}
