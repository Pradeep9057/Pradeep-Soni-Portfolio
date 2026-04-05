const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method" }) };
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, skipped: true }),
    };
  }

  let row = {};
  try {
    row = JSON.parse(event.body || "{}");
  } catch {
    row = {};
  }

  const insert = {
    browser: row.browser ?? null,
    device: row.device ?? null,
    os: row.os ?? null,
    screen: row.screen ?? null,
    referrer: row.referrer ?? null,
    lang: row.lang ?? null,
    timezone: row.timezone ?? null,
    country: row.country ?? null,
    city: row.city ?? null,
    region: row.region ?? null,
    isp: row.isp ?? null,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_visits`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(insert),
  });

  return {
    statusCode: res.ok ? 200 : 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: res.ok }),
  };
};
