# Portfolio Studio · MRJAMESBRAND LTD

Finished projects, collected, published, and presented. One folder, no build step, no database for project data, no account. Project data stays in the browser on the device that runs it; the studio password is verified by an online database so it works on every device.

## Run it

Double click **`start-server.bat`**, then open http://127.0.0.1:8081

A plain static server (`python -m http.server 8081`) previews the interface, but the login gate needs the PHP/SQLite backend. For a fully working local copy use PHP 8 with `pdo_sqlite`: `php -S 127.0.0.1:8081` and point `PORTFOLIO_DB` at a local SQLite database. Use a different port from Contract Studio when both run at once.

## What it does

* **Dashboard**: project counts, published against draft, featured total, recent work, one button to add a project
* **Projects**: every project as a card with cover, client, category, year, status, plus open, edit, publish, feature, and delete
* **Editor**: side form plus live preview. Title, client, category, year, link, summary, full story, cover upload, featured flag, status
* **Display**: public style grid of published work only, filterable by category, featured first, with a full detail view per project
* **Covers**: PNG or JPG upload, resized on the way in, removable at any time
* **Project images**: upload many JPG shots per project. They stack full width on the project page like Behance. Favor a handful of strong shots since browser storage is limited
* **Backup and restore**: the whole studio as one file, plain or password encrypted
* **Print and PDF**: browser print with a document only stylesheet

## Publishing flow

1. Add a project. It starts as DRAFT and stays off the display.
2. Fill the story and upload the cover. Save at any point.
3. Tick Featured for the pieces that should lead the grid.
4. Publish. It appears on the display at once, in its category filter.
5. Unpublish any time to pull it back without deleting anything.

## Security model

* **Server-side password.** The studio password is provisioned in the online SQLite database as a PHP password hash, never as plain text and never in the client. Every device opens on the login screen; first-run setup is not used once the account exists. Change it any time from Settings.
* **Locking.** Unlock lasts for the browser tab only. Ten quiet minutes lock the studio. Five wrong tries trigger a growing wait enforced by the server that survives reloads and applies across devices. The page hides from search crawlers.
* **Encrypted backups.** Recommended for every backup, protected by PBKDF2 plus AES GCM. Plain export asks for explicit confirmation first.
* **Hardened rendering.** All output is escaped, inline handlers are gone, and a Content Security Policy ships with the page.

## Data, backup, and retention

* Project data plus covers exist in three places only: this browser, exported backups, and any screenshots or PDFs you make. The password hash and login throttle live in a SQLite database outside the web root. PII such as client names follows the same retention rule as Contract Studio: keep only for the business relationship plus statutory archiving, then delete exports.
* Recommended routine: encrypted backup after every publishing session. Keep the backup password with whoever must restore the file.

## Deploy with the main website

This studio is bundled into the `mrjamesbrand` repo and served from it:

* `https://mrjamesbrandltd.com/portfolio-studio`
* `https://portfolio.mrjamesbrandltd.com` (Vercel domain plus a host rewrite)

The bundle lives at `apps/web/public/portfolio-studio`. Never edit it there. Change this repo, then from the `mrjamesbrand` repo root run:

```
node scripts/sync-portfolio-studio.mjs
```

Then commit and push. Saving a project syncs it to Sanity through `/api/studio/portfolio`, so published work appears on `mrjamesbrandltd.com/work`.

Set `STUDIO_TOKEN` in the Vercel project, then paste the same value in Studio, Settings, Sync token when opening the subdomain. The admin session cookie is host-only, so the subdomain needs this token. Also set `SANITY_API_WRITE_TOKEN` so the API can upload covers and create projects.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell, sidebar, and mobile nav |
| `app.js` | The whole studio: store, views, covers, lock, crypto |
| `api/auth.php` | Server-side login, password change, and throttling |
| `styles.css` | Brand styling plus print rules |
| `start-server.bat` | Local server launcher |
| `btn-test.mjs`, `crud-test.mjs`, `lock-test.mjs`, `audit-test.mjs` | Test suites, run with node |

## Tests

Run from this folder:

```
node btn-test.mjs
node crud-test.mjs
node lock-test.mjs
node audit-test.mjs
```

They cover buttons and nav, full CRUD plus category filter plus encrypted backup round trip, server-verified lock plus throttle plus auto lock timing, and audit items such as escaping, CSP, login gating, and retention notes.

## Hostinger subdomain

`portfolio.mrjamesbrandltd.com` is served from `~/domains/mrjamesbrandltd.com/public_html/portfolio`. The login endpoint is `api/auth.php`; it needs PHP 8 with `pdo_sqlite` and a database at `~/portfolio-data/studio.sqlite`, outside the web root. Upload the site files plus `api/auth.php` and `api/.htaccess`, then seed the account once with a PHP `password_hash`. The client never receives the hash or the password.

## Troubleshooting

1. **Login appears on a fresh open.** Expected. Unlock lives in the tab only.
2. **Studio looks empty on a new device.** Storage is per browser. Restore the latest backup through Settings.
3. **A project misses the display.** Only PUBLISHED items show. Check status plus the active category filter.
4. **Cover will not upload.** It must be PNG or JPG under 5MB. Larger files need resizing first.
5. **Encrypted backup will not open.** The password differs from the one set at export. There is no recovery path.
