import { readFileSync } from "fs";
import assert from "assert";
const src = readFileSync(new URL("./app.js", import.meta.url), "utf8");
const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");
const has = (s) => { assert.ok(src.includes(s), "missing: " + s); };
for (const a of [`data-act="new"`, `data-act="open"`, `data-act="edit"`, `data-act="save"`, `data-act="del"`, `data-act="publish"`, `data-act="feature"`, `data-act="filter"`, `data-act="backup-enc"`, `data-act="print"`, `[data-act='lock']`]) has(a);
for (const v of [`data-view="dashboard"`, `data-view="projects"`, `data-view="display"`, `data-view="settings"`]) assert.ok(html.includes(v), "missing nav: " + v);
assert.ok(html.includes("noindex"), "display must hide from crawlers");
console.log("btn-test: green");
