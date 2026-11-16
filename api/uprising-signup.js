/**
 * POST /api/uprising-signup
 *
 * Priority-list form on /uprising. Adds the person to Kit and emails Anthony
 * a copy, so a signup is never lost even if Kit is down or not set up yet.
 *
 * SETUP (Vercel > Project Settings > Environment Variables, then redeploy):
 *   KIT_API_KEY      Kit > Settings > Developer > API keys > "Add a new key" (v4)
 *   RESEND_API_KEY   already set for the contact form
 *
 * Each signup is created in Kit, tagged "uprising-priority" (that tag is who
 * gets the priority-list emails) and added to the welcome sequence, which
 * sends Email 3 straight away. The IDs below are from Anthony's Kit account.
 */

const NOTIFY_TO = 'anthony@workhorse-training.com';
const FROM_ADDRESS = 'Workhorse Site <site@workhorse-training.com>';
const KIT = 'https://api.kit.com/v4';
const PRIORITY_TAG_ID = 25881189;      // tag: uprising-priority
const WELCOME_SEQUENCE_ID = 2971540;   // sequence: Uprising: priority-list welcome (Email 3)

function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === 'object') return b;
  try { return JSON.parse(b); } catch (e) { return Object.fromEntries(new URLSearchParams(b)); }
}

function validate(f) {
  if ((f._gotcha || '').trim()) return { silentlyDrop: true };
  const first_name = String(f.first_name || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 60);
  const email = String(f.email || '').trim().toLowerCase();
  if (!first_name || !email) return { error: 'Add your first name and email.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address does not look right.' };
  return { ok: true, first_name, email };
}

async function kit(path, key, body, fetchFn) {
  const r = await fetchFn(KIT + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': key },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Kit ${path} ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

async function addToKit(v, env, fetchFn = fetch) {
  const key = env.KIT_API_KEY;
  if (!key) return { skipped: true };
  await kit('/subscribers', key, { email_address: v.email, first_name: v.first_name, state: 'active' }, fetchFn);
  await kit(`/tags/${PRIORITY_TAG_ID}/subscribers`, key, { email_address: v.email }, fetchFn);
  await kit(`/sequences/${WELCOME_SEQUENCE_ID}/subscribers`, key, { email_address: v.email }, fetchFn);
  return { ok: true };
}

async function notify(v, kitResult, env, fetchFn = fetch) {
  if (!env.RESEND_API_KEY) return;
  const status = kitResult.ok ? 'Added to Kit.' : kitResult.skipped
    ? 'NOT in Kit yet (Kit keys not set). Add them by hand.'
    : `NOT in Kit: ${kitResult.error}. Add them by hand.`;
  await fetchFn('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [NOTIFY_TO],
      subject: `Uprising priority list: ${v.first_name}`,
      text: `${v.first_name} <${v.email}> joined the Workhorse:Uprising priority list.\n\n${status}`,
    }),
  }).catch(() => {});
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const v = validate(readBody(req));
  if (v.silentlyDrop) return res.status(200).json({ ok: true });
  if (v.error) return res.status(400).json({ error: v.error });

  let kitResult;
  try { kitResult = await addToKit(v, process.env); } catch (e) { kitResult = { error: e.message }; }
  await notify(v, kitResult, process.env);

  // The person is on the list either way: Anthony has the backup email.
  return res.status(200).json({ ok: true });
}

module.exports = handler;
module.exports.validate = validate;
module.exports.addToKit = addToKit;
