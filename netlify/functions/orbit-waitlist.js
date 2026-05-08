const { json, allowedOrigin, parseBody, waitlistPayload, sendToBraze } = require('./_shared');

exports.handler = async (event) => {
  const origin = allowedOrigin(event);
  if (event.httpMethod === 'OPTIONS') return json(200, { ok: true }, origin);
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'Method not allowed' }, origin);

  try {
    const data = parseBody(event);
    if (data['bot-field']) return json(200, { ok: true, ignored: true }, origin);
    const { external_id, brazePayload } = waitlistPayload(data);
    const brazeResult = await sendToBraze(brazePayload);
    return json(200, { ok: true, external_id, ...brazeResult }, origin);
  } catch (err) {
    return json(400, { ok: false, error: String(err.message || err) }, origin);
  }
};
