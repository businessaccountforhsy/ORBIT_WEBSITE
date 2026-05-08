const crypto = require('crypto');

const DEFAULT_ALLOWED_EVENTS = new Set([
  'submit_waitlist',
  'complete_preference_quiz',
  'update_preference',
  'view_story',
  'save_creator',
  'click_membership_cta',
  'request_pass_invite',
  'view_market_drop',
  'add_to_cart',
  'view_live_event',
  'rsvp_popup',
  'view_reward_mission',
  'complete_mission'
]);

function json(statusCode, body, origin = '*') {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': origin || '*',
      'access-control-allow-headers': 'content-type',
      'access-control-allow-methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
}

function getOrigin(event) {
  return event.headers.origin || event.headers.Origin || '';
}

function allowedOrigin(event) {
  const configured = process.env.ALLOWED_ORIGIN || '';
  const origin = getOrigin(event);
  if (!configured) return origin || '*';
  const list = configured.split(',').map(s => s.trim()).filter(Boolean);
  if (!origin || list.includes(origin)) return origin || list[0];
  return list[0];
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (_) {
    const params = new URLSearchParams(event.body);
    return Object.fromEntries(params.entries());
  }
}

function cleanString(value, max = 400) {
  return String(value ?? '').trim().slice(0, max);
}

function cleanEmail(email) {
  return cleanString(email, 254).toLowerCase();
}

function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function bool(value) {
  return value === true || value === 'true' || value === 'on' || value === '1' || value === 1;
}

function stableExternalId(email) {
  const salt = process.env.EXTERNAL_ID_SALT || 'orbit-dev-salt-change-me';
  return 'orbit_' + crypto.createHash('sha256').update(`${salt}:${cleanEmail(email)}`).digest('hex').slice(0, 32);
}

function nowIso() {
  return new Date().toISOString();
}

function safeProperties(input = {}) {
  const out = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (!key || key.length > 80) continue;
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) out[key] = value.map(v => cleanString(v, 140)).slice(0, 20);
    else if (typeof value === 'boolean' || typeof value === 'number') out[key] = value;
    else out[key] = cleanString(value, 500);
  }
  return out;
}

function normalizeInterestList(value) {
  if (Array.isArray(value)) return value.map(v => cleanString(v, 80)).filter(Boolean).slice(0, 20);
  return cleanString(value, 500).split(',').map(v => v.trim()).filter(Boolean).slice(0, 20);
}

function baseAttributes(data, external_id) {
  const emailOptIn = bool(data.email_marketing_opt_in);
  return {
    external_id,
    email: cleanEmail(data.email),
    email_subscribe: emailOptIn ? 'opted_in' : 'subscribed',
    email_marketing_opt_in: emailOptIn,
    display_name: cleanString(data.display_name, 80),
    favorite_genre: cleanString(data.first_content_preference || data.favorite_genre, 80),
    first_content_preference: cleanString(data.first_content_preference, 80),
    email_rhythm: cleanString(data.email_rhythm, 80),
    selected_interests: normalizeInterestList(data.selected_interests),
    tone_preference: cleanString(data.tone_preference, 120),
    format_preference: cleanString(data.format_preference, 120),
    preferred_channel: 'email',
    lifecycle_stage: 'new_explorer',
    orbit_canvas_candidate: true,
    is_internal_test_user: bool(data.is_internal_test_user),
    source: cleanString(data.source || 'direct', 120),
    utm_source: cleanString(data.utm_source, 120),
    utm_medium: cleanString(data.utm_medium, 120),
    utm_campaign: cleanString(data.utm_campaign, 160),
    utm_content: cleanString(data.utm_content, 160),
    last_waitlist_at: nowIso()
  };
}

function waitlistPayload(data) {
  const email = cleanEmail(data.email);
  if (!isEmail(email)) throw new Error('A valid email address is required.');
  if (!bool(data.email_marketing_opt_in)) throw new Error('Email opt-in is required for the onboarding email experiment.');
  if (!bool(data.project_acknowledgement)) throw new Error('Project acknowledgement is required.');

  const external_id = stableExternalId(email);
  const attributes = [baseAttributes(data, external_id)];
  const eventProperties = safeProperties({
    source: data.source,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    utm_content: data.utm_content,
    referrer: data.referrer,
    landing_url: data.landing_url,
    first_content_preference: data.first_content_preference,
    email_rhythm: data.email_rhythm,
    selected_interests: normalizeInterestList(data.selected_interests),
    tone_preference: data.tone_preference,
    format_preference: data.format_preference,
    project_acknowledgement: bool(data.project_acknowledgement)
  });
  const events = [
    { external_id, name: 'submit_waitlist', time: nowIso(), properties: eventProperties }
  ];
  if (data.selected_interests || data.first_content_preference) {
    events.push({ external_id, name: 'complete_preference_quiz', time: nowIso(), properties: eventProperties });
  }
  return { external_id, brazePayload: { attributes, events } };
}

function eventPayload(data) {
  const eventName = cleanString(data.event_name, 80);
  if (!DEFAULT_ALLOWED_EVENTS.has(eventName)) throw new Error(`Event not allowed: ${eventName}`);
  const external_id = cleanString(data.external_id, 80) || (data.email ? stableExternalId(data.email) : '');
  if (!external_id) throw new Error('Missing external_id or email for event tracking.');
  return {
    external_id,
    brazePayload: {
      events: [{
        external_id,
        name: eventName,
        time: nowIso(),
        properties: safeProperties(data.properties || {})
      }]
    }
  };
}

async function sendToBraze(payload) {
  const dryRunFlag = String(process.env.BRAZE_DRY_RUN || '').toLowerCase();
  const endpoint = (process.env.BRAZE_REST_ENDPOINT || '').replace(/\/$/, '');
  const apiKey = process.env.BRAZE_REST_API_KEY || '';
  const missingReason = !endpoint ? 'missing_braze_rest_endpoint' : (!apiKey ? 'missing_braze_rest_api_key' : '');

  // If Braze API access is not available yet, do not break the waitlist form.
  // The submission can still be saved by Netlify Forms and GA4 can still record the event.
  if (dryRunFlag === 'true' || missingReason) {
    return {
      dry_run: true,
      braze_sent: false,
      braze_response: null,
      skipped_reason: dryRunFlag === 'true' ? 'dry_run_enabled' : missingReason
    };
  }

  const res = await fetch(`${endpoint}/users/track`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch (_) { body = { raw: text }; }
  if (!res.ok) {
    const msg = body && body.message ? body.message : `Braze request failed with ${res.status}`;
    throw new Error(msg);
  }
  return { dry_run: false, braze_sent: true, braze_response: body };
}

module.exports = {
  json,
  allowedOrigin,
  parseBody,
  cleanEmail,
  isEmail,
  bool,
  waitlistPayload,
  eventPayload,
  sendToBraze
};
