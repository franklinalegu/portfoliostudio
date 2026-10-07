import { readFileSync } from "fs";
import assert from "assert";
const src = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const readme = readFileSync(new URL("./README.md", import.meta.url), "utf8");
assert.ok(!src.includes('onclick="'), "no inline handler attributes allowed");
for (const s of ["&#39;", "Content-Security-Policy", "encBackup", "decBackup", "AES-GCM"]) assert.ok(src.includes(s) || html.includes(s), "missing hardening: " + s);
assert.ok(/if \(isLocked\(\)\)/.test(src), "all views must sit behind login");
assert.ok(/PII|retention/i.test(readme), "README needs retention note");
// behance style: uniform grid, hero detail, appreciate once, prev/next, related
for (const s of ["pf-grid", "pfTile", "pf-hero", "appreciate", "pf-appr-", "More ${esc(x.category)}"]) assert.ok(src.includes(s), "missing behance: " + s);
// galleries: many uploads, stacked blocks, JPEG diet, quota guard
for (const s of ["images-file", "image-del", "Project images", "image/jpeg", "storage is full"]) assert.ok(src.includes(s), "missing gallery: " + s);
console.log("audit-test: green");
