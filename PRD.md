# Portfolio Studio · Product Requirements Document

Product of MRJAMESBRAND LTD. Companion to Contract Studio, which handles agreements and invoices. This studio handles finished work.

## 1. Product summary

Portfolio Studio is the memory and shop window of the studio. Finished engagements become project records with covers and stories. The best become published and featured, then present themselves on a filterable display. One folder, no build step, no database, no server.

## 2. Problem

Finished work scattered across drives, chats, and social posts. No single record of what shipped for whom, no curated set for prospects, and every portfolio update meant rebuilding pages by hand.

## 3. Goals

1. Every finished engagement becomes a project record in minutes.
2. Publishing is one tap, and unpublishing never destroys data.
3. The display reads as a finished portfolio: covers, categories, featured order, full stories.
4. The same security posture as Contract Studio: first run password, idle lock, throttled login, encrypted backups, hardened rendering.
5. Static deploy with zero maintenance, same as its sibling product.

## 4. Non goals

1. No public comments, likes, or analytics.
2. No multi user roles. One studio lock guards one collection.
3. No online editing from client side. Clients never touch this product.

## 5. Users

1. **Studio Principal.** Adds, edits, publishes, features, deletes, backs up.
2. **Prospect.** Reads the display, filters by service, opens full stories, follows project links.

## 6. Functional requirements

### Projects

1. Create with title, client, category, year, summary, story, link, cover, featured flag, and status.
2. Edit any field with live preview beside the form.
3. Delete only after explicit confirmation.
4. Publish and unpublish without data loss. Drafts never reach the display.
5. Feature and unfeature to order the display.

### Display

1. Show published projects only, featured first, then newest year.
2. Filter by every category present in the published set, plus All.
3. Full detail per project: cover, meta, summary, story, outbound link.
4. Empty states read plainly per filter.

### Covers

1. Accept PNG or JPG under 5MB, resized on upload.
2. Remove and replace at any time.
3. Render from stored data only, never from remote URLs.

### Backup and settings

1. Export plain JSON only after explicit confirmation.
2. Export password encrypted backups with PBKDF2 plus AES GCM.
3. Restore both formats, rejecting wrong passwords without detail.
4. Keep studio identity, contact, and admin credentials in Settings.

## 7. Security and privacy requirements

1. No credential ships in the product. First run forces a fresh password of 8 characters or more.
2. Passwords persist as salted SHA 256 hashes only.
3. Unlock is per tab. Idle ten minutes locks. Five wrong tries trigger a growing wait that survives reloads.
4. Every view sits behind login. The page hides from search crawlers.
5. Client names in records follow the studio retention rule: browser plus backups only, deleted when no longer needed.

## 8. UX requirements

1. One primary action per view.
2. Every action answers at once with a toast, a status flip, or a new view.
3. Touch targets suit phones. Cover upload works from mobile galleries.
4. Print views contain the document only.
5. Empty states read in plain words with a single path forward.

## 9. Data model

1. **Project.** Reference, title, client, category, year, summary, story, link URL, cover data, featured flag, status, creation date.
2. **Settings.** Studio identity, contact, admin username, lock hash.

## 10. Acceptance criteria

1. All suites pass: buttons and nav, CRUD plus filter plus encrypted backup, lock plus throttle plus timing, audit plus escaping plus CSP plus gating.
2. A project travels creation to published display without leaving the studio.
3. Drafts never appear on the display under any filter.
4. A fresh zip plus a tagged commit plus a pushed main branch close every change.

## 11. Rollout and operations

1. Local use runs from `start-server.bat` on port 8081.
2. Public use deploys from `main` through GitHub Actions to the portfolio subdomain, followed by first run password creation.
3. Backup discipline after every publishing session is part of the definition of done.
