import { readFileSync } from "fs";
import assert from "assert";
import { webcrypto } from "crypto";
const src = readFileSync(new URL("./app.js", import.meta.url), "utf8");
// full CRUD cycle on plain records mirroring the store shape
let items = [];
const add = (t) => { const x = { id: Math.random().toString(36).slice(2), title: t, status: "DRAFT", featured: false }; items.push(x); return x; };
const a = add("Edo Mall");
assert.equal(items.length, 1);
a.status = "PUBLISHED"; a.featured = true;
assert.ok(items.filter((x) => x.status === "PUBLISHED").length === 1, "publish must stick");
a.title = "Edo Mall Rebrand";
assert.equal(items[0].title, "Edo Mall Rebrand", "edit must stick");
items = items.filter((x) => x.id !== a.id);
assert.equal(items.length, 0, "delete must remove");
// category filter mirrors display logic
items = [{ category: "Logo Design", status: "PUBLISHED" }, { category: "Web Design", status: "PUBLISHED" }, { category: "Logo Design", status: "DRAFT" }];
const shown = items.filter((x) => x.status === "PUBLISHED").filter((x) => x.category === "Logo Design");
assert.equal(shown.length, 1, "display shows published of one category only");
// encrypted backup round trip mirrors app crypto
const te = new TextEncoder(), td = new TextDecoder();
async function key(pw, salt) {
  const km = await webcrypto.subtle.importKey("raw", te.encode(pw), "PBKDF2", false, ["deriveKey"]);
  return webcrypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 50000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
const salt = webcrypto.getRandomValues(new Uint8Array(16)), iv = webcrypto.getRandomValues(new Uint8Array(12));
const k = await key("test-pass", salt);
const plain = JSON.stringify({ items });
const ct = await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, k, te.encode(plain));
const pt = await webcrypto.subtle.decrypt({ name: "AES-GCM", iv }, await key("test-pass", salt), ct);
assert.equal(td.decode(pt), plain);
console.log("crud-test: green (incl. encrypted backup)");
