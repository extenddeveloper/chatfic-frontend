import fs from "node:fs"

const required = [
  "src/App.tsx",
  "src/main.tsx",
  "src/core/config.ts",
  "src/core/storage.ts",
  "src/framer/custom-code-service.ts",
  "src/widget/widget-template.ts",
  "src/framer/custom-code-service.ts",
]

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`)
}

const widget = fs.readFileSync("src/widget/widget-template.ts", "utf8")
const service = fs.readFileSync("src/framer/custom-code-service.ts", "utf8")
for (const token of ["CHANNELS", "getUrl", "prefers-reduced-motion"]) {
  if (!widget.includes(token)) throw new Error(`Widget source missing ${token}`)
}

if (!service.includes("setCustomCode") || !service.includes("bodyEnd")) throw new Error("Custom Code service missing setCustomCode/bodyEnd")
console.log("Smoke check passed.")
