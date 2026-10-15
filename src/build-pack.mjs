// Compila src/packs/macros/*.json → packs/macros (LevelDB). Uso: node src/build-pack.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
// Usa la classic-level que trae la instalación de Foundry (~/foundryvtt)
const require = createRequire(path.join(process.env.FOUNDRY_DIR ?? path.join(os.homedir(), "foundryvtt"), "package.json"));
const { ClassicLevel } = require("classic-level");
const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src/packs/macros");
const dest = path.join(root, "packs/macros");
fs.rmSync(dest, { recursive: true, force: true });
const db = new ClassicLevel(dest, { valueEncoding: "json" });
await db.open();
const batch = db.batch();
for (const f of fs.readdirSync(src).filter(f => f.endsWith(".json"))) {
  const { _key, ...doc } = JSON.parse(fs.readFileSync(path.join(src, f), "utf8"));
  batch.put(_key, doc);
  console.log("+", doc.name);
}
await batch.write();
await db.close();
