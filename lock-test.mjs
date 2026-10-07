import { readFileSync } from "fs";
import assert from "assert";
const src = readFileSync(new URL("./app.js", import.meta.url), "utf8");
assert.ok(!/lockHash: "[^"]+"/.test(src.replace('lockHash: ""', "")), "no seeded hash may ship");
assert.ok(src.includes('lockHash: ""'), "default lockHash must be empty");
for (const s of ["needsSetup", "vSetup", "trySetup", "Create password", "10 * 60 * 1000", "setInterval(", "mjb-portfolio-attempts", "n >= 5"]) assert.ok(src.includes(s), "missing lock: " + s);
assert.ok(!src.includes("length < 4"), "no 4 char minimum may remain");
assert.ok(!src.includes("visibilitychange"), "must not instant lock on tab switch");
console.log("lock-test: green");
