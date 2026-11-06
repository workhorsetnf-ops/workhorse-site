# Workhorse Training & Nutrition — website

Plain HTML and CSS. No build step, no dependencies. Edit any file in a text
editor, push, and Vercel redeploys it.

```
index.html      Home: problem, solution, video, book a call, results,
                story, who I am, testimonials, how it works (one page)
blog.html       Blog index — the list of posts
blog-*.html     One file per post
contact.html    Booking link + message form
thanks.html     Shown after the contact form sends
images/         Photos used on the home page
styles.css      All styling
vercel.json     Clean URLs; /program and /about redirect to the home page
api/contact.js  Sends the contact form to your inbox (needs RESEND_API_KEY)
```

## Adding a blog post

Two steps, no CMS, no build.

1. **Copy `blog-TEMPLATE.html`** and rename it `blog-your-topic.html`. Lowercase,
   hyphens, no spaces — the filename becomes the URL. Fill in the title, date and
   body. The template has numbered comments telling you what to change.
2. **Add it to the list.** Open `blog.html`, copy one of the `<article class="post-row">`
   blocks, and change the date, title, link and summary line.

That's it. The post is live at `workhorse-training.com/blog-your-topic`.

If you'd rather just write the words and skip the HTML, send me the draft and I'll
hand you back a finished file to drop in.

## Adding the VSL (the one thing still to do)

In `index.html`, find the `VSL VIDEO` comment in section 3. Delete the
`START HIDDEN` and `END HIDDEN` lines, then paste your YouTube/Vimeo/Loom embed
`<iframe>` where it says `PASTE HERE`. The video then shows between the
solution and the "Book your free Game Plan Call" block.

## Booking link

Every "Book a call" button points to
`https://calendly.com/anthony-workhorse-training/30min`. If that ever changes,
search all files for `calendly.com` and replace it.

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
Changing colours: the top of `styles.css` — `--orange` is `#FF8C00` and every
orange element reads from it, so one edit changes the whole site.
