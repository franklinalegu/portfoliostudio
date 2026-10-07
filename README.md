# Portfolio Studio · MRJAMESBRAND LTD

Finished projects, collected, published, and presented. One folder, no build step, no database, no account. Data stays in the browser on the device that runs it.

## Run it

Double click **`start-server.bat`**, then open http://127.0.0.1:8081

Any static server works as well: `python -m http.server 8081` from this folder. Use a different port from Contract Studio when both run at once.

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

* **First run setup.** No password ships with the studio. The first screen forces creation of a username plus password of 8 characters or more, stored only as a salted SHA 256 hash.
* **Locking.** Unlock lasts for the browser tab only. Ten quiet minutes lock the studio. Five wrong tries trigger a growing wait that survives reloads. The page hides from search crawlers.
* **Encrypted backups.** Recommended for every backup, protected by PBKDF2 plus AES GCM. Plain export asks for explicit confirmation first.
* **Hardened rendering.** All output is escaped, inline handlers are gone, and a Content Security Policy ships with the page.

## Data, backup, and retention

* All records live in browser localStorage under one key. There is no server copy.
* Recommended routine: encrypted backup after every publishing session. Keep the backup password with whoever must restore the file.
* Project data plus covers exist in three places only: this browser, exported backups, and any screenshots or PDFs you make. PII such as client names follows the same retention rule as Contract Studio: keep only for the business relationship plus statutory archiving, then delete exports.

## Deploy on GitHub Pages with a subdomain

Push `main`. The `pages.yml` workflow publishes this folder automatically.

1. Repo, then Settings, then Pages, then Source: **GitHub Actions**.
2. DNS: `CNAME portfolio` pointing to `<user>.github.io`.
3. Pages, then Custom domain: `portfolio.mrjamesbrandltd.com`. HTTPS is enforced automatically.
4. Open the live URL once and create the password on the first run screen, then restore the latest backup to carry data over.

## Files

| File | Purpose |
|---|---|
| `index.html` | Shell, sidebar, and mobile nav |
| `app.js` | The whole studio: store, views, covers, lock, crypto |
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

They cover buttons and nav, full CRUD plus category filter plus encrypted backup round trip, lock plus throttle plus auto lock timing, and audit items such as escaping, CSP, login gating, and retention notes.

## Troubleshooting

1. **Login appears on a fresh open.** Expected. Unlock lives in the tab only.
2. **Studio looks empty on a new device.** Storage is per browser. Restore the latest backup through Settings.
3. **A project misses the display.** Only PUBLISHED items show. Check status plus the active category filter.
4. **Cover will not upload.** It must be PNG or JPG under 5MB. Larger files need resizing first.
5. **Encrypted backup will not open.** The password differs from the one set at export. There is no recovery path.
