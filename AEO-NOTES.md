# AEO notes: entities, schema, and what actually moves the needle

## 1. Semantic entity map

These are the things an AI system needs to connect to your brand. The ones marked **live** are already stated in the site's HTML and schema. The ones marked *gap* are not yet on the site anywhere, which means no system can associate them with you.

### People
| Entity | Status |
|---|---|
| Anthony (founder, coach, active performer) | live, first name only |
| Anthony's surname / ring name | **gap** — this is the single biggest one. See note below. |

### Organisations
| Entity | Status |
|---|---|
| Workhorse Training & Nutrition | live |
| AEW (All Elite Wrestling) | live |
| WWE | live |
| ROH (Ring of Honor) | *gap* — mentioned nowhere in text |
| NASM | live |

### Products and programs
| Entity | Status |
|---|---|
| Main Event-Ready Physique (flagship program) | live |
| TV-Ready Physique (former name) | live in llms.txt only |
| Workhorse Strong (the client app) | live |

### Concepts and topics
Body recomposition · cutting and reverse dieting · macronutrient targets · hypertrophy training · training around travel · recovery from bumps · weekly check-ins · progress photos · RIR-based autoregulation · online physique coaching · professional wrestling conditioning

### Credentials
Master's in exercise science · NASM certification · 25 years in professional wrestling

### Locations
| Entity | Status |
|---|---|
| Service area (worldwide, remote) | live |
| A city or region | deliberately omitted — add only if you want local search traffic |

**The surname gap.** Right now no AI system can connect this site to your wrestling career, because the site says "Anthony" and every wrestling database says your full or ring name. That single missing string is worth more than everything else in this document. Add it to the About page and to the `Person` schema and the site becomes linkable to 25 years of existing coverage.

---

## 2. Q&A data

The FAQ section on the homepage is already structured for scraping: each question is an `<h3>`, each answer a `<p>` directly beneath it, in semantic HTML with no JavaScript. That is the format AI crawlers actually read, and it's why the FAQ lives on the page rather than inside an accordion.

The same six questions are duplicated as `FAQPage` JSON-LD in `index.html`, worded slightly differently: the on-page version is written in your voice for humans, the schema version is written flatly for machines and phrased to match how people actually type queries ("How do you train for a physique while travelling constantly?").

A note on expectations: Google restricted FAQ rich results in 2023 to government and health sites, so this will not produce dropdown snippets in normal search results. It still matters, because the JSON-LD is machine-readable regardless of whether Google draws a widget from it.

---

## 3. JSON-LD schema

In `index.html`, in the `<head>`. Five connected entity types:

- **Organization** — the brand, its position, what it knows about
- **Person** — you, linked to the Organization as founder
- **Service** — Main Event-Ready Physique, linked to the Organization as provider
- **WebPage** — the page itself
- **FAQPage** — the six questions above

They're joined with `@id` references, so a crawler reads them as one connected graph rather than five unrelated blocks. That connection is the point.

**Two things to fill in before it ships**, both marked in comments in the file:

1. `sameAs` — your real Instagram and YouTube URLs. This is how a machine confirms the Anthony on this site is the Anthony on those accounts. Delete lines for accounts you don't have; leaving the example URLs in is worse than nothing.
2. `founder` name — the surname gap above.

**One thing not to add:** `aggregateRating` or `review` markup for reviews that aren't real and published on the page. That's a manual-action penalty from Google, not a grey area.

---

## 4. llms.txt, and what it's actually worth

`llms.txt` is shipped. Be clear about what it does, because the brief assumed more than it delivers.

It cannot control how AI crawlers index you. It carries no restrictive power at all — it's the opposite of `robots.txt`. It's a community proposal with no standards body behind it and no enforcement mechanism.

The evidence as of 2026:

- Roughly 10% of domains have one. Among the fifty most AI-cited domains, one.
- Across 500M+ monitored AI bot events, only a few hundred requests hit `/llms.txt` at all. GPTBot, ClaudeBot, PerplexityBot and Google-Extended crawl the HTML instead.
- Google has said on the record that it doesn't support the file and isn't planning to, and its 2026 generative-AI documentation lists it among unnecessary tactics.

It took ten minutes and it costs nothing to have. Ship it. Just don't expect it to do anything measurable, and don't let it displace the things that do.

**`robots.txt` is the file that actually carries weight.** It's shipped too, and it's set to allow both the AI search agents (which can cite you and send traffic) and the training crawlers. If you'd rather not have your writing used for model training, flip three `Allow: /` lines to `Disallow: /` — comments in the file mark exactly which. That won't affect your eligibility to be cited.

`sitemap.xml` is also shipped, listing all seven pages, and referenced from `robots.txt`.

---

## 5. Honest priority order

Ranked by what actually affects whether an AI system cites you:

1. **Your surname on the page.** Nothing else here comes close. It's what links this site to a verifiable 25-year career.
2. **Content that answers real questions.** Your two blog posts do this well. Ten more like them beats every technical item below combined.
3. **Schema markup.** Shipped. This is real and it works.
4. **Clean semantic HTML.** Already the case, because the site is static HTML with no JavaScript rendering. You're ahead of most sites here without having tried.
5. **robots.txt and sitemap.** Shipped.
6. **llms.txt.** Shipped, and last for a reason.

The uncomfortable version: AI systems cite sources they can verify and that have said something specific. The technical files make you readable. Being worth citing is a content problem, and the blog is where that gets solved.
