"use strict";
/* MRJAMESBRAND Portfolio Studio — finished projects, managed and displayed. Standalone, localStorage-backed. No build step. */
const KEY = "mjb-portfolio-studio-v1";
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const uid = () => Math.random().toString(36).slice(2, 10);
const thisYear = () => new Date().getFullYear();
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const CATS = ["Brand Identity", "Logo Design", "Web Design", "Consulting", "Training / Workshop", "AI Mastery", "Webinar Branding", "Social Media Templates", "Social Media Management", "Wedding Branding", "Presentations", "Company Profile", "Personal Branding", "Digital Illustrations", "Ads Placement", "Digital Marketing", "Web Management", "Web Applications / Software", "Other"];

const store = {
  data: { items: [], settings: { studio: "MrJamesBrand Ltd", email: "hello@mrjamesbrandltd.com", adminUser: "mrjamesbrandltd", lockHash: "" } },
  load() {
    try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && Array.isArray(d.items)) this.data = Object.assign(this.data, d); } catch (e) {}
    this.data.settings = Object.assign({ studio: "MrJamesBrand Ltd", email: "hello@mrjamesbrandltd.com", adminUser: "mrjamesbrandltd", lockHash: "" }, this.data.settings);
    if (!Array.isArray(this.data.items)) this.data.items = [];
  },
  save() { localStorage.setItem(KEY, JSON.stringify(this.data)); }
};
store.load();
const S = store.data;
let route = { view: "dashboard", id: null, cat: "" };
let draft = null;

function blankItem() {
  return { id: uid(), ref: "PRJ-MJB-" + String(Math.floor(1000 + Math.random() * 9000)),
    title: "", client: "", category: "Brand Identity", year: thisYear(), summary: "", description: "",
    url: "", cover: "", featured: false, status: "DRAFT", createdAt: new Date().toISOString().slice(0, 10) };
}
const published = () => S.items.filter((x) => x.status === "PUBLISHED");

/* ---------- views ---------- */
function badge(s) { return `<span class="badge b-${s.toLowerCase()}">${s}</span>`; }
function nav() { $$(".navlink").forEach((b) => b.classList.toggle("active", b.dataset.view === route.view)); }
function coverImg(x, h) {
  if (x.cover) return `<img src="${x.cover}" alt="${esc(x.title)} cover" style="width:100%;height:${h || 180}px;object-fit:cover;display:block">`;
  return `<div style="width:100%;height:${h || 180}px;display:flex;align-items:center;justify-content:center;background:var(--mist,#f0ede6);font-size:2rem">◍</div>`;
}

function vDashboard() {
  const n = S.items.length, pub = published().length, feat = S.items.filter((x) => x.featured && x.status === "PUBLISHED").length;
  const recent = S.items.slice(-4).reverse();
  return `<div id="glow" class="no-print" aria-hidden="true"></div>
    <p class="eyebrow">Portfolio Studio</p>
    <h1 class="page-title">Finished <span class="hl">work.</span></h1>
    <p class="lede">Collect finished projects, publish the best, and present them as a portfolio.</p>
    <div class="grid3">
      <div class="card"><p class="eyebrow">Projects</p><h2 style="font-size:2rem">${n}</h2><p>${pub} published · ${n - pub} draft</p></div>
      <div class="card"><p class="eyebrow">Featured</p><h2 style="font-size:2rem">${feat}</h2><p>on display</p></div>
      <div class="card"><p class="eyebrow">Create</p><h2 style="font-size:1.2rem">New project</h2>
        <p class="mt"><button class="btn btn-lime" data-act="new">+ New Project</button></p></div>
    </div>
    <h3 class="mt" style="margin:24px 0 12px">Recent projects</h3>
    ${recent.length ? `<div class="grid3">${recent.map(projectCard).join("")}</div>`
      : `<div class="card empty">No projects yet. <button class="btn btn-primary" data-act="new">Add the first one</button></div>`}`;
}

function projectCard(x) {
  return `<div class="card" style="padding:0;overflow:hidden">${coverImg(x)}
    <div style="padding:16px">
      <p class="eyebrow">${esc(x.category)} · ${esc(String(x.year))} ${x.featured ? "· ★" : ""}</p>
      <h3 class="mt">${esc(x.title) || "(untitled)"}</h3>
      <p style="font-size:.85rem;color:var(--stone)">${esc(x.client)}</p>
      <p class="mt">${badge(x.status)}</p>
      <p class="mt rowactions"><button data-act="open" data-id="${x.id}">Open</button><button data-act="edit" data-id="${x.id}">Edit</button></p>
    </div></div>`;
}

function vProjects() {
  const rows = S.items.slice().reverse();
  return `<p class="eyebrow">Admin</p><h1 class="page-title">All <span class="hl">projects</span></h1>
    <div class="toolbar"><span class="spacer"></span><button class="btn btn-primary" data-act="new">+ New Project</button></div>
    ${rows.length ? `<div class="grid3">${rows.map(projectCard).join("")}</div>`
      : `<div class="card empty">No projects yet. <button class="btn btn-primary" data-act="new">Add the first one</button></div>`}`;
}

function vEditor() {
  const d = draft;
  return `<p class="eyebrow">Admin · ${esc(d.ref)} ${badge(d.status)}</p>
    <h1 class="page-title">${S.items.find((x) => x.id === d.id) ? "Edit" : "New"} <span class="hl">project</span></h1>
    <div class="toolbar no-print">
      <button class="btn btn-primary" data-act="save">Save</button>
      <button class="btn btn-ghost" data-act="publish">${d.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
      <button class="btn btn-ghost" data-act="preview-display">Display →</button>
      <span class="spacer"></span><button class="btn" data-act="print">Print / PDF</button>
    </div><div id="err"></div>
    <div class="editor"><div class="panel card no-print">
      <h3>Project</h3><div class="formgrid">
        <label class="f full">Title*<input data-f="title" value="${esc(d.title)}"></label>
        <label class="f">Client<input data-f="client" value="${esc(d.client)}"></label>
        <label class="f">Category<select data-f="category">${CATS.map((c) => `<option${d.category === c ? " selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
        <label class="f">Year<input type="number" min="2000" max="2100" data-f="year" value="${esc(String(d.year))}"></label>
        <label class="f">Link URL<input data-f="url" value="${esc(d.url)}" placeholder="https://"></label>
        <label class="f full">Summary<textarea data-f="summary">${esc(d.summary)}</textarea></label>
        <label class="f full">Story<textarea data-f="description" rows="5">${esc(d.description)}</textarea></label>
        <label class="f">Featured<span style="display:flex;align-items:center;gap:10px;margin-top:6px;font-size:.9rem;font-weight:400;text-transform:none;letter-spacing:normal"><input type="checkbox" data-f="featured"${d.featured ? " checked" : ""} style="width:22px;height:22px">${d.featured ? "On display" : "Off"}</span></label>
        <label class="f">Status<select data-f="status"><option${d.status === "DRAFT" ? " selected" : ""}>DRAFT</option><option${d.status === "PUBLISHED" ? " selected" : ""}>PUBLISHED</option></select></label>
      </div>
      <h3 class="mt">Cover image</h3>
      ${d.cover ? `<p><img src="${d.cover}" alt="cover" style="max-width:100%;max-height:220px"></p><p class="mt"><button class="btn btn-danger" data-act="cover-clear">Remove cover</button></p>`
        : `<p><button class="btn btn-ghost" data-act="cover-pick">Upload cover</button><input type="file" id="cover-file" accept="image/png,image/jpeg" style="display:none"></p>
          <p style="font-size:.8rem;color:var(--stone)">PNG or JPG, resized on upload.</p>`}
    </div><div id="preview"><div class="doc"><div class="doc-page">${coverImg(d, 260)}
      <p class="eyebrow mt">${esc(d.category)} · ${esc(String(d.year))}</p>
      <h1>${esc(d.title) || "(untitled)"}</h1>
      <p><strong>${esc(d.client)}</strong></p>
      <p>${esc(d.summary).replace(/\n/g, "<br>")}</p>
      <p>${esc(d.description).replace(/\n/g, "<br>")}</p>
      ${d.url ? `<p><a href="${esc(d.url)}">${esc(d.url)}</a></p>` : ""}
    </div></div></div></div>`;
}

function vDisplay() {
  const cats = ["", ...new Set(published().map((x) => x.category))];
  const list = published().filter((x) => !route.cat || x.category === route.cat).sort((a, b) => (b.featured - a.featured) || String(b.year).localeCompare(String(a.year)));
  return `<p class="eyebrow">Portfolio Studio</p>
    <h1 class="page-title">Selected <span class="hl">work.</span></h1>
    <div class="toolbar no-print">${cats.map((c) => `<button class="btn ${route.cat === c ? "btn-primary" : "btn-ghost"}" data-act="filter" data-cat="${esc(c)}">${c || "All"}</button>`).join("")}</div>
    ${list.length ? `<div class="grid3 mt">${list.map((x) => `<button class="card" style="padding:0;overflow:hidden;text-align:left;cursor:pointer" data-act="open-display" data-id="${x.id}">${coverImg(x)}
      <div style="padding:16px"><p class="eyebrow">${esc(x.category)} · ${esc(String(x.year))}${x.featured ? " · ★" : ""}</p>
      <h3 class="mt">${esc(x.title)}</h3><p style="font-size:.85rem;color:var(--stone)">${esc(x.client)}</p></div></button>`).join("")}</div>`
    : `<div class="card empty mt">Nothing published${route.cat ? " in this category" : ""} yet.</div>`}`;
}

function vDetail(id) {
  const x = S.items.find((y) => y.id === id);
  if (!x) return `<div class="card empty">Not found.</div>`;
  return `<p class="eyebrow">Work · ${esc(x.ref)} ${badge(x.status)}</p>
    <h1 class="page-title">${esc(x.title) || "(untitled)"}</h1>
    <div class="toolbar no-print">
      <button class="btn btn-ghost" data-act="back-display">← Display</button>
      <button class="btn btn-ghost" data-act="edit" data-id="${x.id}">Edit</button>
      <button class="btn btn-ghost" data-act="publish" data-id="${x.id}">${x.status === "PUBLISHED" ? "Unpublish" : "Publish"}</button>
      <button class="btn btn-ghost" data-act="feature" data-id="${x.id}">${x.featured ? "Unfeature" : "Feature"}</button>
      <span class="spacer"></span><button class="btn btn-danger" data-act="del" data-id="${x.id}">Delete</button>
    </div>
    <div class="doc mt"><div class="doc-page">${coverImg(x, 320)}
      <p class="eyebrow mt">${esc(x.category)} · ${esc(String(x.year))} · ${esc(x.client)}</p>
      <h2>${esc(x.title) || "(untitled)"}</h2>
      <p>${esc(x.summary).replace(/\n/g, "<br>")}</p>
      <p>${esc(x.description).replace(/\n/g, "<br>")}</p>
      ${x.url ? `<p><a href="${esc(x.url)}" target="_blank" rel="noopener">View live →</a></p>` : ""}
    </div></div>`;
}

function vSettings() {
  const s = S.settings;
  return `<p class="eyebrow">Admin</p><h1 class="page-title">Studio <span class="hl">settings</span></h1>
    <div class="card no-print" style="max-width:640px"><div class="formgrid">
      <label class="f">Studio name<input id="set-studio" value="${esc(s.studio)}"></label>
      <label class="f">Contact email<input id="set-email" value="${esc(s.email)}"></label>
      <label class="f">Admin username<input id="set-adminuser" value="${esc(s.adminUser || "")}" autocomplete="username"></label>
    </div><p class="mt"><button class="btn btn-primary" data-act="save-settings">Save settings</button></p></div>
    <div class="card no-print mt" style="max-width:640px"><h3>Backup</h3>
      <p style="font-size:.85rem;color:var(--stone)">All projects and settings live in this browser. Encrypted backup is recommended.</p>
      <p class="mt"><button class="btn btn-primary" data-act="backup-enc">Download encrypted backup</button>
      <button class="btn btn-ghost" data-act="backup">Plain backup</button>
      <button class="btn btn-ghost" data-act="restore">Restore backup</button>
      <input type="file" id="restore-file" accept="application/json,.json" style="display:none"></p></div>
    <div class="card no-print mt" style="max-width:640px"><h3>Studio login ${S.settings.lockHash ? "(on)" : "(off)"}</h3>
      <p style="font-size:.85rem;color:var(--stone)">Password gate this studio on shared devices. Stored as a hash, never plain text.</p>
      <div class="formgrid mt">
        <label class="f">New password<input id="set-pass" type="password" autocomplete="new-password"></label>
        <label class="f">Confirm<input id="set-pass2" type="password" autocomplete="new-password"></label>
      </div>
      <p class="mt"><button class="btn btn-primary" data-act="save-lock">Set password</button>
      ${S.settings.lockHash ? `<button class="btn btn-danger" data-act="remove-lock">Remove lock</button>` : ""}</p></div>`;
}

/* ---------- lock ---------- */
const isLocked = () => !!S.settings.lockHash && sessionStorage.getItem("mjb-unlocked") !== "1";
const needsSetup = () => !S.settings.lockHash;
function lockNow() { sessionStorage.removeItem("mjb-unlocked"); route = { view: "dashboard", id: null }; render(); }
function render() {
  const app = $("#app");
  const side = document.querySelector(".sidebar");
  if (needsSetup()) { if (side) side.style.display = "none"; app.innerHTML = vSetup(); window.scrollTo(0, 0); return; }
  if (isLocked()) { if (side) side.style.display = "none"; app.innerHTML = vLock(); window.scrollTo(0, 0); return; }
  if (side) side.style.display = "";
  if (route.view === "dashboard") app.innerHTML = vDashboard();
  else if (route.view === "projects") app.innerHTML = vProjects();
  else if (route.view === "editor") app.innerHTML = vEditor();
  else if (route.view === "display") app.innerHTML = vDisplay();
  else if (route.view === "detail") app.innerHTML = vDetail(route.id);
  else if (route.view === "settings") app.innerHTML = vSettings();
  nav();
  window.scrollTo(0, 0);
}
function setPath(o, path, v) { const k = path.split("."); let t = o; for (let i = 0; i < k.length - 1; i++) t = t[k[i]]; t[k[k.length - 1]] = v; }
function refreshPreview() {
  const p = $("#preview"); if (!p || !draft) return;
  p.innerHTML = `<div class="doc"><div class="doc-page">${coverImg(draft, 260)}
    <p class="eyebrow mt">${esc(draft.category)} · ${esc(String(draft.year))}</p>
    <h1>${esc(draft.title) || "(untitled)"}</h1>
    <p><strong>${esc(draft.client)}</strong></p>
    <p>${esc(draft.summary).replace(/\n/g, "<br>")}</p>
    <p>${esc(draft.description).replace(/\n/g, "<br>")}</p></div></div>`;
}
function persistDraft() {
  if (!draft.title.trim()) { const er = $("#err"); if (er) er.innerHTML = `<div class="alert">Title is required.</div>`; window.scrollTo(0, 0); return false; }
  const i = S.items.findIndex((x) => x.id === draft.id);
  if (i >= 0) S.items[i] = draft; else S.items.push(draft);
  store.save(); return true;
}
function toast(m) { let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); } t.textContent = m; t.className = "show"; clearTimeout(t._h); t._h = setTimeout(() => (t.className = ""), 2200); }
function vLock() {
  return `<div style="min-height:80vh;display:flex;align-items:center;justify-content:center">
    <form id="lockform" class="card" style="width:100%;max-width:380px">
      <p class="eyebrow">Restricted</p><h1 class="page-title" style="font-size:2.2rem;white-space:nowrap">Studio <span class="hl">login</span></h1>
      <div id="lockerr"></div>
      <label class="f mt">Username<input id="lockuser" autocomplete="username" value="mrjamesbrandltd"></label>
      <label class="f mt">Password<input id="lockpass" type="password" autocomplete="current-password"></label>
      <p class="mt"><button class="btn btn-primary" type="submit" style="width:100%">Unlock</button></p>
    </form></div>`;
}
function vSetup() {
  return `<div style="min-height:80vh;display:flex;align-items:center;justify-content:center">
    <form id="setupform" class="card" style="width:100%;max-width:380px">
      <p class="eyebrow">First run</p><h1 class="page-title">Set studio <span class="hl">password</span></h1>
      <p style="font-size:.85rem;color:var(--stone)">No password ships with the studio. Create one now, it stays only in this browser.</p>
      <div id="lockerr"></div>
      <label class="f mt">Username<input id="lockuser" autocomplete="username" value="${esc(S.settings.adminUser || "mrjamesbrandltd")}"></label>
      <label class="f mt">New password<input id="lockpass" type="password" autocomplete="new-password"></label>
      <label class="f mt">Confirm<input id="lockpass2" type="password" autocomplete="new-password"></label>
      <p class="mt"><button class="btn btn-primary" type="submit" style="width:100%">Create password</button></p>
    </form></div>`;
}
async function sha(s) {
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("mjb:" + s));
    return "s256:" + Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch (e) { let h = 5381; const str = "mjb:" + s; for (let i = 0; i < str.length; i++) h = (((h << 5) + h + str.charCodeAt(i)) | 0); return "dj2:" + (h >>> 0).toString(16); }
}
async function tryUnlock() {
  let a = { n: 0, until: 0 };
  try { a = Object.assign(a, JSON.parse(localStorage.getItem("mjb-portfolio-attempts"))); } catch (e) {}
  const now = Date.now();
  if (now < a.until) { const er = $("#lockerr"); if (er) er.innerHTML = `<div class="alert">Too many tries. Wait ${Math.ceil((a.until - now) / 1000)}s.</div>`; return; }
  const u = $("#lockuser").value.trim().toLowerCase(), v = $("#lockpass").value;
  if (u === String(S.settings.adminUser || "").toLowerCase() && (await sha(v)) === S.settings.lockHash) {
    try { localStorage.setItem("mjb-portfolio-attempts", JSON.stringify({ n: 0, until: 0 })); } catch (e) {}
    sessionStorage.setItem("mjb-unlocked", "1"); poke(); render(); toast("Welcome back.");
  } else {
    a.n++; a.until = a.n >= 5 ? now + Math.min(30000 * Math.pow(2, a.n - 5), 900000) : 0;
    try { localStorage.setItem("mjb-portfolio-attempts", JSON.stringify(a)); } catch (e) {}
    const er = $("#lockerr"); if (er) er.innerHTML = `<div class="alert">Wrong username or password.${a.until > now ? ` Locked ${Math.ceil((a.until - now) / 1000)}s.` : ""}</div>`;
  }
}
async function trySetup() {
  const u = $("#lockuser").value.trim() || "mrjamesbrandltd", a = $("#lockpass").value, b = $("#lockpass2").value;
  const er = $("#lockerr");
  if (!a || a.length < 8) { if (er) er.innerHTML = `<div class="alert">Password needs at least 8 characters.</div>`; return; }
  if (a !== b) { if (er) er.innerHTML = `<div class="alert">Passwords do not match.</div>`; return; }
  S.settings.adminUser = u; S.settings.lockHash = await sha(a); store.save();
  sessionStorage.setItem("mjb-unlocked", "1"); poke(); render(); toast("Password created.");
}
/* Idle auto-lock: 10 min without input. Hidden tabs go quiet too, so the timer covers them. */
let lastAct = Date.now();
function poke() { lastAct = Date.now(); }
["click", "input", "keydown", "touchstart"].forEach((ev) => document.addEventListener(ev, poke, { passive: true }));
setInterval(() => {
  if (!S.settings.lockHash || isLocked() || needsSetup()) return;
  if (Date.now() - lastAct > 10 * 60 * 1000) lockNow();
}, 30000);
document.addEventListener("submit", (e) => {
  if (e.target.id === "lockform") { e.preventDefault(); tryUnlock(); }
  else if (e.target.id === "setupform") { e.preventDefault(); trySetup(); }
});

/* ---------- events ---------- */
document.addEventListener("input", (e) => {
  const t = e.target;
  if (route.view === "editor" && draft && t.dataset.f) {
    const k = t.dataset.f;
    draft[k] = t.type === "checkbox" ? t.checked : (t.type === "number" ? Number(t.value) : t.value);
    refreshPreview();
  }
});
function syncDraft(id) {
  const d = S.items.find((x) => x.id === id); if (!d) return null;
  draft = JSON.parse(JSON.stringify(d)); return draft;
}
document.addEventListener("click", async (e) => {
  if (e.target.closest("[data-act='lock']")) { sessionStorage.removeItem("mjb-unlocked"); route = { view: "dashboard", id: null }; render(); return; }
  const nv = e.target.closest(".navlink"); if (nv) { route = { view: nv.dataset.view, id: null }; render(); return; }
  const b = e.target.closest("[data-act]"); if (!b) return;
  const act = b.dataset.act, id = b.dataset.id;
  if (act === "print") { window.print(); }
  else if (act === "new") { draft = blankItem(); route = { view: "editor", id: null }; render(); }
  else if (act === "open") { route = { view: "detail", id }; render(); }
  else if (act === "edit") { if (syncDraft(id)) { route = { view: "editor", id }; render(); } }
  else if (act === "save") { if (persistDraft()) toast("Project saved ✓"); }
  else if (act === "publish") {
    const x = S.items.find((y) => y.id === (id || (draft && draft.id))); if (!x && !draft) return;
    if (id) { x.status = x.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"; store.save(); render(); toast(x.status === "PUBLISHED" ? "Published." : "Unpublished."); }
    else { if (!persistDraft()) return; draft.status = draft.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"; persistDraft(); route = { view: "detail", id: draft.id }; render(); }
  }
  else if (act === "feature") { const x = S.items.find((y) => y.id === id); if (x) { x.featured = !x.featured; store.save(); render(); } }
  else if (act === "del") { const x = S.items.find((y) => y.id === id); if (x && confirm(`Delete "${x.title || x.ref}"?`)) { S.items = S.items.filter((y) => y.id !== id); store.save(); route = { view: "projects", id: null }; render(); toast("Deleted."); } }
  else if (act === "preview-display") { if (persistDraft(true)) { route = { view: "display", id: null }; render(); } }
  else if (act === "open-display") { route = { view: "detail", id }; render(); }
  else if (act === "back-display") { route = { view: "display", id: null }; render(); }
  else if (act === "filter") { route = { view: "display", id: null, cat: b.dataset.cat || "" }; render(); }
  else if (act === "cover-pick") { const f = $("#cover-file"); if (f) f.click(); }
  else if (act === "cover-clear") { if (draft && confirm("Remove the cover image?")) { draft.cover = ""; render(); } }
  else if (act === "save-settings") {
    S.settings.studio = $("#set-studio").value; S.settings.email = $("#set-email").value;
    if ($("#set-adminuser")) S.settings.adminUser = $("#set-adminuser").value.trim() || "mrjamesbrandltd";
    store.save(); toast("Settings saved."); render();
  }
  else if (act === "backup") {
    if (!confirm("Plain backup contains project data in readable form. Download anyway? (Encrypted backup is recommended.)")) return;
    download(`portfolio-studio-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(store.data, null, 2)); toast("Plain backup downloaded.");
  }
  else if (act === "backup-enc") {
    const a = prompt("Set a backup password (give it to whoever restores this file):");
    if (!a || a.length < 8) { if (a !== null) alert("Backup password needs at least 8 characters."); return; }
    const c = prompt("Confirm backup password:");
    if (a !== c) { alert("Passwords do not match."); return; }
    encBackup(a, JSON.stringify(store.data)).then((env) => {
      download(`portfolio-studio-backup-${new Date().toISOString().slice(0, 10)}.enc.json`, env); toast("Encrypted backup downloaded.");
    }).catch(() => alert("Encryption failed on this browser."));
  }
  else if (act === "restore") { const f = $("#restore-file"); if (f) f.click(); }
  else if (act === "save-lock") {
    const a = $("#set-pass").value, x = $("#set-pass2").value;
    if (!a || a.length < 8) { alert("Password needs at least 8 characters."); return; }
    if (a !== x) { alert("Passwords do not match."); return; }
    S.settings.lockHash = await sha(a); store.save();
    $("#set-pass").value = ""; $("#set-pass2").value = "";
    toast("Studio lock is on."); render();
  }
  else if (act === "remove-lock") {
    if (confirm("Remove the studio lock?")) { S.settings.lockHash = ""; store.save(); render(); }
  }
});
document.addEventListener("focusout", (e) => {
  if (route.view !== "editor" || !draft) return;
  if (e.target.dataset && e.target.dataset.f) render();
});
document.addEventListener("change", (e) => {
  if (e.target.id === "cover-file") {
    const f = e.target.files[0]; e.target.value = ""; if (!f || !draft) return;
    if (f.size > 5 * 1024 * 1024) { alert("Cover must be under 5MB."); return; }
    const rd = new FileReader();
    rd.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1200, sc = Math.min(1, maxW / img.width);
        const cv = document.createElement("canvas");
        cv.width = Math.round(img.width * sc); cv.height = Math.round(img.height * sc);
        cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
        draft.cover = cv.toDataURL("image/png");
        persistDraft(true); render(); toast("Cover saved.");
      };
      img.onerror = () => alert("Could not read that image.");
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
    return;
  }
  if (e.target.id === "restore-file") {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const d = JSON.parse(r.result);
        if (d && d.enc === 1 && d.salt && d.iv && d.data) {
          const pw = prompt("Encrypted backup, enter backup password:");
          if (!pw) return;
          let plain;
          try { plain = await decBackup(pw, d); }
          catch (_) { alert("Wrong password or corrupt backup."); return; }
          const bk = JSON.parse(plain);
          if (!bk || !Array.isArray(bk.items) || !bk.settings) throw new Error("bad");
          store.data = Object.assign(store.data, bk); store.save(); draft = null;
          toast("Encrypted backup restored."); route = { view: "dashboard", id: null }; render();
          return;
        }
        if (!d || !Array.isArray(d.items) || !d.settings) throw new Error("bad");
        store.data = Object.assign(store.data, d); store.save(); draft = null;
        toast("Backup restored."); route = { view: "dashboard", id: null }; render();
      } catch (_) { alert("Invalid backup file."); }
    };
    r.readAsText(f); e.target.value = "";
  }
});
function download(name, text, type) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: type || "application/json" }));
  a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
/* Encrypted backup: PBKDF2(password) to AES-GCM. Envelope {enc:1,salt,iv,data} base64. */
const b64e = (b) => btoa(String.fromCharCode(...new Uint8Array(b)));
const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
async function backupKey(pw, salt) {
  const km = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 50000, hash: "SHA-256" }, km, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
async function encBackup(pw, plain) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await backupKey(pw, salt);
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plain));
  return JSON.stringify({ enc: 1, salt: b64e(salt), iv: b64e(iv), data: b64e(ct) });
}
async function decBackup(pw, env) {
  const key = await backupKey(pw, b64d(env.salt));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64d(env.iv) }, key, b64d(env.data));
  return new TextDecoder().decode(pt);
}

render();
