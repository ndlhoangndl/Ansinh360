import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = resolve(appRoot, "../../data");

// Minimal RFC 4180 reader; imports original decoded cells without semantic conversion.
export function parseCsv(text) {
  const rows = []; let row = [], cell = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (c === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift();
  if (!headers || new Set(headers).size !== headers.length) throw new Error("Invalid CSV headers");
  return rows.map((values) => {
    if (values.length !== headers.length) throw new Error("CSV column count mismatch");
    return Object.fromEntries(headers.map((key, index) => [key, values[index]]));
  });
}

const inputs = {
  metadata: "00_README.csv", sources: "01_SOURCES.csv", lifeEvents: "02_LIFE_EVENTS.csv",
  policies: "03_POLICIES.csv", policyRules: "04_POLICY_RULES.csv", services: "05_SERVICES.csv", opportunities: "07_OPPORTUNITIES.csv",
  checklists: "11_SERVICE_CHECKLISTS.csv", profileFields: "12_PROFILE_FIELDS.csv",
};
const output = {}; const hashes = {};
for (const [name, file] of Object.entries(inputs)) {
  const bytes = readFileSync(resolve(dataRoot, file));
  output[name] = parseCsv(bytes.toString("utf8"));
  hashes[file] = createHash("sha256").update(bytes).digest("hex");
}
// Every item used by a recommendation must resolve to an existing official source.
const sources = new Set(output.sources.map((s) => s.source_id));
for (const row of [...output.policies, ...output.services, ...output.opportunities, ...output.checklists]) {
  if (!sources.has(row.source_id ?? row.legal_source_id)) throw new Error("Broken official source reference");
}
output.provenance = {
  datasetVersion: output.metadata.find((m) => m.key === "dataset_version").value,
  fileHashes: hashes,
  snapshotDate: output.metadata.find((m) => m.key === "updated_at").value,
};
writeFileSync(resolve(appRoot, "lib/demo-data.json"), JSON.stringify(output, null, 2) + "\n", "utf8");
console.log(`Frontend snapshot generated from ${Object.keys(inputs).length} original CSV files; source files untouched.`);
