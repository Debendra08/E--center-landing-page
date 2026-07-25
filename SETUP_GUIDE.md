# E-CENTER Tikapur — Dynamic Website Setup Guide

Your site is now a **dynamic showroom website**: products load live from a
free database, you get an **admin panel** to add/edit/delete products, and
every "Interested" form fills a **leads list** with the customer's name,
phone, and address.

Everything still runs on **GitHub + Cloudflare, 100% free** — nothing
server-side to host. The "backend" is Google Firebase's free tier, called
directly from the browser.

**No file names or images were renamed** — everything you had before is
untouched. Only new files were added.

---

## What's new in this zip

| File / Folder | Purpose |
|---|---|
| `js/firebase-config.js` | Your Firebase project keys go here (one-time setup) |
| `js/products-data.js` | Shared code that loads products & saves leads |
| `css/dynamic.css` | Skeleton loading animation + extra visual polish |
| `product-detail.html` | One page that displays **any** product by ID, with the "I'm Interested" form |
| `admin.html` + `js/admin.js` + `css/admin.css` | Your admin panel |
| `FIRESTORE_RULES.txt` | Security rules to paste into Firebase |
| `index.html` | Product grid now loads dynamically (with skeleton loading) |
| `rickshaw.html`, `loader.html`, `scooter.html`, `cycle.html`, `moped.html`, `battery.html` | Each is now a **category page** that lists every product you've added in that category |

---

## Step 1 — Create your free Firebase project (10 minutes, one-time)

1. Go to **https://console.firebase.google.com** and sign in with any Google account.
2. Click **Add project** → name it (e.g. `ecenter-tikapur`) → finish the wizard (you can disable Google Analytics, not needed).
3. In the left menu: **Build → Firestore Database → Create database** → choose **Production mode** → pick a location close to Nepal (e.g. `asia-south1`) → Enable.
4. In the left menu: **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.**
5. Still in Authentication, go to the **Users** tab → **Add user** → enter the email + password YOU want to log into `admin.html` with. This is your admin login — nobody else can create an account.
6. Go to **Firestore Database → Rules** tab → delete what's there → paste the contents of `FIRESTORE_RULES.txt` (included in this zip) → **Publish**.
7. Go to **Project settings** (gear icon, top left) → scroll to **Your apps** → click the **`</>`** (web) icon → give it any nickname → **Register app**. Firebase will show you a code block containing a `firebaseConfig = { ... }` object.
8. Open `js/firebase-config.js` in this zip, and replace the `REPLACE_ME` values with the real values Firebase gave you. Save the file.

That's it — no more coding needed after this.

---

## Step 2 — Upload to GitHub (same as before)

Replace the contents of your existing `ecentertikapur.com.np` GitHub repo
with everything in this zip (keep the same repo, same GitHub Pages +
Cloudflare + CNAME setup you already have). Commit and push. Cloudflare
will pick up the change automatically like it always has.

---

## Step 3 — Log into your admin panel

Visit `https://ecentertikapur.com.np/admin.html`, sign in with the email/password
you created in Step 1.5, and you'll see:

- **Dashboard** — quick stats + your most recent customer leads
- **Products** — Add / Edit / Delete products. Each product has:
  - Name, Category (rickshaw / loader / scooter / cycle / moped / battery)
  - Short description (shown on the homepage card)
  - Full description + Specifications (shown on the product's own page)
  - Image links — either upload new images into your `images/` folder on
    GitHub and type `./images/yourfile.jpg`, or paste any public image URL
  - "Feature on homepage" checkbox (for future use)
- **Leads** — every customer who filled the "I'm Interested" form on a
  product page, with their name, phone, address, which product they
  wanted, and the date. Mark them "Contacted" once you've called them.

Bookmark `admin.html` on your phone/computer — that's your control panel
from now on, no coding required to add or remove products.

---

## Notes

- **Cost:** Firebase's free "Spark" plan comfortably covers a small
  showroom site (50K reads/20K writes per day free). You will not be
  charged unless you manually upgrade the plan.
- **Images:** Firebase Storage wasn't used (it now requires a billing
  account even on the free tier), so images are simple URLs — keep using
  your existing `images/` folder and GitHub, which is free and already
  working for you.
- **Old pages:** `rickshaw.html`, `scooter.html`, etc. now show *all*
  products you've added in that category instead of one hardcoded
  product — so you're no longer limited to one product per category.
- **admin.html** is excluded from search engines (`noindex` tag) but is
  not password-protected beyond Firebase login — that login is the
  security layer, so keep your password private.
