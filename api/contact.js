/**
 * POST /api/contact
 *
 * Receives the contact form on contact.html and emails it via Resend.
 * No third-party form service, no submission cap.
 *
 * SETUP (one time, in Vercel):
 *   Project Settings > Environment Variables > add
 *     RESEND_API_KEY = your Resend key
 *   Set it for Production, Preview and Development, then redeploy.
 *
 * The two addresses below are the only things you'd ever edit in this file.
 */

const TO_ADDRESS = 'anthony@beaworkhorse.com';

// Must be on a domain you've verified in Resend. beaworkhorse.com is verified,
// so this works. The mailbox itself doesn't need to exist.
const FROM_ADDRESS = 'Workhorse Site <site@beaworkhorse.com>';

const MAX_MESSAGE = 5000;

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Vercel usually parses the body for us, but handle a raw string too. */
function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'object') return b;
  if (typeof b === 'string') {
    try {
      return JSON.parse(b);
    } catch (e) {
      return Object.fromEntries(new URLSearchParams(b));
    }
  }
  return {};
}

function validate(fields) {
  const name = (fields.name || '').trim();
  const email = (fields.email || '').trim();
  const message = (fields.message || '').trim();
  const who = (fields.who || '').trim();

  // Honeypot. People can't see this field, so anything filling it is a bot.
  // Return success so the bot doesn't learn it was caught.
  if ((fields._gotcha || '').trim()) return { silentlyDrop: true };

  if (!name || !email || !message) return { error: 'Please fill in every required field.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address does not look right.' };
  if (message.length > MAX_MESSAGE) return { error: 'That message is too long.' };

  return { ok: true, name, email, message, who };
}

function buildEmail(v) {
  // Strip anything that could act as a header/line injection if a name ever
  // contains a newline or control character (email subjects are a single
  // header line, so this is the one place that matters even though the
  // fields are already validated above).
  const safeName = v.name.replace(/[\r\n]+/g, ' ').slice(0, 120);
  const subject = `New enquiry from ${safeName} — workhorse-training.com`;

  const text = [
    `Name:  ${v.name}`,
    `Email: ${v.email}`,
    v.who ? `They are: ${v.who}` : null,
    '',
    v.message,
    '',
    '---',
    'Sent from the contact form on workhorse-training.com',
  ].filter(Boolean).join('\n');

  const html = `
    <div style="font-family:system-ui,sans-serif;line-height:1.6;max-width:600px">
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(v.name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong>
        <a href="mailto:${escapeHtml(v.email)}">${escapeHtml(v.email)}</a></p>
      ${v.who ? `<p style="margin:0 0 4px"><strong>They are:</strong> ${escapeHtml(v.who)}</p>` : ''}
      <hr style="border:0;border-top:1px solid #ddd;margin:16px 0">
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(v.message)}</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:16px 0">
      <p style="color:#777;font-size:13px;margin:0">
        Sent from the contact form on workhorse-training.com.
        Hit reply to answer ${escapeHtml(v.name)} directly.
      </p>
    </div>`.trim();

  return { subject, text, html };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method not allowed');
  }

  const v = validate(readBody(req));

  // Bot caught by the honeypot. Behave exactly like a success.
  if (v.silentlyDrop) {
    res.writeHead(303, { Location: '/thanks' });
    return res.end();
  }

  if (v.error) {
    res.writeHead(303, { Location: '/contact?error=' + encodeURIComponent(v.error) });
    return res.end();
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set on this deployment.');
    res.writeHead(303, { Location: '/contact?error=' + encodeURIComponent('Something went wrong sending that. Please email anthony@beaworkhorse.com directly.') });
    return res.end();
  }

  const mail = buildEmail(v);

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: v.email,     // so replying in your inbox goes to them
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error('Resend rejected the send:', r.status, detail);
      res.writeHead(303, { Location: '/contact?error=' + encodeURIComponent('Something went wrong sending that. Please email anthony@beaworkhorse.com directly.') });
      return res.end();
    }
  } catch (err) {
    console.error('Could not reach Resend:', err);
    res.writeHead(303, { Location: '/contact?error=' + encodeURIComponent('Something went wrong sending that. Please email anthony@beaworkhorse.com directly.') });
    return res.end();
  }

  res.writeHead(303, { Location: '/thanks' });
  return res.end();
};
