# Notes & Open Questions — PTC Website Rebuild

A running list to go through with Leslie before this replaces the live site.
Organized so you can just read this top to bottom with her.

---

## 1. Questions for Leslie

### Content decisions
- **PTC Members of the Month** — the old site had this as its own nav page,
  but you mentioned the club skipped it this year with everything else going
  on. I left it **out of the new site's navigation entirely** rather than
  building a page that says "on hold." Confirm: kill it for good, bring it
  back next year, or keep a low-key archive page of past honorees (2019–2023
  photos existed on the old site but weren't real text, so those would need
  to be re-transcribed by hand either way)?
- **Local Cycling routes/resources page** — the old content (route list,
  clubs, etc.) reads like it hasn't been refreshed since ~2024. Rather than
  guess at a "wait until 2027" cadence, worth asking Leslie: is there someone
  who owns keeping this page current, and how often should it actually get
  revisited? I flagged this directly on the new [resources.html](resources.html)
  page with a visible dev note so it doesn't get missed.
- **Leadership page** — carried over the 2025 board (Joan Wolfe, Lauren
  Ascah, Ed Schmiech, Dustin Wehler) plus a placeholder card for **Leslie
  Weidner** since her write-up/photo/role weren't ready yet. Need: her title,
  bio blurb, and (ideally) a headshot.
- **"PTC Leadership Over the Years"** — the old site referenced a historical
  roster of past officers that never came through in the migration (it may
  have been an image or a section that didn't render in the scrape). If that
  history matters to keep, we need the actual list from Leslie or an old
  backup of the site.
- **Founding year** — I'd put "Est. 2009" on the homepage and footer, but
  that was a bad inference on my part: the only "2009" I actually have is
  "bylaws adopted May 1, 2009," which is the date the *bylaws* were
  formalized, not necessarily when the club itself started (could easily
  predate that). I've removed the claim sitewide rather than guess. If
  Leslie knows the real founding year, worth adding back somewhere as a
  nice credibility marker — just needs to be accurate.
- **Annual Elections contact** — the old site listed
  `justin.schell78@gmail.com` as the elections contact, with a note that
  current board members reportedly don't have access to that inbox anymore.
  I'd swap this for the general club email or the correct current contact —
  need Leslie to confirm which.
- **Club By-Laws** — I reconstructed a plain-English summary of the bylaws
  from what the old site exposed as text, but for a governing document the
  *actual* signed bylaws PDF should be the source of truth. Need that file
  re-uploaded rather than relying on my summary — flagged directly on
  [by-laws.html](by-laws.html).
- **Sponsorship Guidelines PDF** — same situation: the old "Become a
  Sponsor" page linked a downloadable 2017 guidelines PDF with sponsor tier
  details that didn't come through as text. Need that file to re-upload —
  flagged on [sponsors.html](sponsors.html).
- **Coaching Resources bios** — old site had a short list of coach names
  (Crew Racing and Rehab, FLYT Performance, Get Fit Families, Ken Presutti,
  Deb Sagan, Hill Pursuit) each linking to their own bio sub-page. I kept the
  names/links but didn't migrate individual bios — worth doing if those
  pages get real traffic.

### Sharing / privacy
- The **Google Calendar** and **Race List spreadsheet** are now embedded
  directly on the site (see below) — which only works because they're
  currently shared publicly ("anyone with the link can view"). Confirm
  that's actually fine to leave public, since embedding makes the entire
  calendar/sheet visible to anyone who visits the site, not just people who
  had the link before.

## 2. To do before launch (Jesse)

- **Get real embed codes from Square, Google, and other services** instead
  of the placeholder iframe URLs currently in place, so everything is using
  the officially supported embed method rather than a generic iframe src:
  - **Google Calendar** ([events.html](events.html)) — currently using a
    hand-built `calendar/embed?src=...` URL. Google Calendar's own
    "Settings → Integrate calendar → Embed code" panel gives an iframe
    snippet with proper sizing/config options (default view, color, showing
    tabs, etc.) — swap that in.
  - **Race List spreadsheet** ([races.html](races.html)) — currently using
    `/preview` on the sheet URL, which happens to render but isn't the
    "supported" embed path. Use **File → Share → Publish to web** in Google
    Sheets to get the real embed HTML, which is more stable and lets you
    control which sheet/range shows.
  - **Square Shop** — currently just links out to
    [shopptc.square.site](https://shopptc.square.site/) in a new tab. Square
    has embeddable site/store widgets — worth checking whether embedding
    select products (or the whole storefront) on-site is worth it vs. just
    linking out. Simplest to leave as a link for now.
- **Contact form** ([contact.html](contact.html)) — currently submits via a
  plain `mailto:` link (opens the visitor's email client — works with zero
  setup, but clunky UX). For a real "submit and done" form, set up a free
  [Formspree](https://formspree.io) or Netlify Forms endpoint and swap the
  `<form action="...">` — noted inline in the HTML.
- **Real photos** — hero images, leadership headshots, and section art are
  currently CSS gradient placeholders, not real photos. Old site had some
  (ptc_penn_state, Run, Pgh_Sunset images on the homepage) that weren't
  recoverable as files during migration — grab originals from Leslie or
  reshoot/re-select.
- **Hosting** — this is a static site (plain HTML/CSS/JS, no build step),
  so it can go on Netlify, Vercel, GitHub Pages, or Wix's own file hosting —
  whichever is easiest for whoever inherits this. Netlify or Vercel are the
  easiest for a non-technical person to redeploy (drag-and-drop the folder,
  or connect a GitHub repo for auto-deploys on every save).

## 3. How editing works now (the "hard to edit" problem)

The old Wix site required going into the Wix editor to change almost
anything. This version splits things two ways:

- **Race list and events calendar** update themselves automatically —
  they're live embeds of the club's existing Google Sheet and Google
  Calendar. Add a race to the sheet or an event to the calendar, and the
  website updates within minutes, with zero code changes.
- **Everything else** (membership pricing, leadership bios, sponsor names,
  resource content, etc.) lives directly in the HTML files in this folder,
  in plain readable text — no CMS, no build step. Anyone reasonably
  comfortable editing a Word doc can open e.g. `membership.html` in a text
  editor, find the sentence they want to change, and edit it directly.

## 4. Site structure

```
index.html         Home (mission, get involved, testimonials, follow us)
membership.html     Become a Member, pricing, elections
races.html          Race list (live Google Sheet embed)
events.html          Events calendar (live Google Calendar embed)
resources.html       Beginners / open water / swimming / running / cycling / coaching / FAQ
leadership.html      Board bios
sponsors.html        Our sponsors + become a sponsor
shop.html            Club shop overview, links out to Square store
by-laws.html         Club bylaws
contact.html         Contact form + club email/socials
404.html             Branded "page not found" (most hosts auto-serve this on broken links)
robots.txt / sitemap.xml   Basic SEO hygiene
assets/img/ptc-logo.jpg   Real club logo — used as favicon + header/footer mark (see note below on resolution)
assets/css/style.css  Design system (all colors, fonts, spacing in one file)
assets/js/main.js     Shared header/footer injection, mobile nav, accordions
partials/header.html  Shared nav — edit once, updates on every page
partials/footer.html  Shared footer — edit once, updates on every page
```

### What got added for the client demo pass
- **Shop page** — nav/footer "Shop" now points to an actual `/shop.html`
  instead of jumping straight to Square, so every nav item lands somewhere
  on-brand first.
- **FAQ accordion** — added to the bottom of Resources, answering the most
  obvious new-member questions (cost, gear, nerves about open water/group
  rides, how to add a race).
- **Testimonials** — homepage now has a "What members say" section using
  real quotes pulled from the leadership bios (Joan Wolfe, Ed Schmiech) and
  the beginners page — no invented content.
- **Real logo added** — the actual club crest (Pittsburgh skyline + gear +
  swim/bike/run figures) is now the favicon and the header/footer mark.
  Only source we have is a 288×288px export (looks like an Instagram
  profile picture) — perfectly fine at the small sizes it's used at now, but
  it'll look soft/pixelated if used anywhere large (a hero banner, apparel,
  print materials). Worth asking Leslie whether whoever originally designed
  it (Canva, Illustrator, a local designer) still has the original file —
  ideally a vector (.ai/.eps/.svg) or a large PNG (2000px+).
- **Social share previews** (Open Graph/Twitter meta tags) — so pasting a
  link into Slack/text/Facebook shows a proper title + description instead
  of nothing. No preview *image* yet since there are no real photos — add
  one once you have a hero photo.
- **404 page + robots.txt/sitemap.xml** — basic polish/SEO hygiene most
  hosts (Netlify, Vercel, GitHub Pages) will pick up automatically.

To preview locally: run `python3 -m http.server 8000` from this folder and
open `http://localhost:8000`.
