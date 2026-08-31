# Workhorse Training & Nutrition — website

Plain HTML and CSS. No build step, no dependencies. Edit any file in a text
editor, push, and Vercel redeploys it.

```
index.html      Home — VSL is the hero, plus the wrestler/fan split
program.html    Main Event-Ready Physique
about.html      Your background
blog.html       Blog index — the list of posts
blog-*.html     One file per post
contact.html    Booking link + message form
styles.css      All styling
vercel.json     Gives you /about instead of /about.html
```

## Adding a blog post

Two steps, no CMS, no build.

1. **Copy `blog-TEMPLATE.html`** and rename it `blog-your-topic.html`. Lowercase,
   hyphens, no spaces — the filename becomes the URL. Fill in the title, date and
   body. The template has numbered comments telling you what to change.
2. **Add it to the list.** Open `blog.html`, copy one of the `<article class="post-row">`
   blocks, and change the date, title, link and summary line.

That's it. The post is live at `beaworkhorse.com/blog-your-topic`.

If you'd rather just write the words and skip the HTML, send me the draft and I'll
hand you back a finished file to drop in.

## Before it goes live — five things to replace

1. **The VSL embed.** `index.html`, inside `<div class="frame">`. Paste the
   iframe from YouTube/Vimeo and delete the `<div class="frame-empty">` under it.
2. **Your booking link.** Every `href="#"` on a "Book a call" button, across all
   four pages. Search for `REPLACE #`.
3. **The contact form.** `contact.html` — sign up at formspree.io, create a form,
   paste their URL into the form's `action`. Until then the form sends nowhere.
4. **Your email address.** Bottom of `contact.html`.
5. **Photos.** Commented-out `<img>` spots are marked in `about.html` (a photo of
   you) and `program.html` (an app screenshot). Make an `images/` folder and drop
   files in.

Optional: your surname in the credit line at the top of `index.html`, and pricing
on `program.html` if you'd rather not keep it on the call.

## Deploying

1. New repo on GitHub — keep it separate from the Workhorse Strong app repo.
2. Upload these files via **Add file → Upload files** on github.com (the route
   that works reliably for you).
3. In Vercel: **Add New → Project**, pick the repo. Framework preset: **Other**.
   No build command, no output directory. Deploy.
4. Settings → Domains → add `beaworkhorse.com` and `www.beaworkhorse.com`, then
   copy the DNS records Vercel shows you into your registrar.

Point the app at `app.beaworkhorse.com` in the Workhorse Strong project's own
Domains settings, so the site and the app share the domain without colliding.

## Editing later

Changing text: open the `.html` file, edit between the tags, push.
Changing colours: the top of `styles.css` — `--orange` is `#BF5700` and every
orange element reads from it, so one edit changes the whole site.
