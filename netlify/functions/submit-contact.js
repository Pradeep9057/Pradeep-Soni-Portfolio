const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "method" }) };
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "not_configured" }),
    };
  }

  let row = {};
  try {
    row = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "invalid_json" }),
    };
  }

  const name = String(row.name || "").trim().slice(0, 200);
  const email = String(row.email || "").trim().slice(0, 320);
  const message = String(row.message || "").trim().slice(0, 8000);

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "missing_fields" }),
    };
  }

  const insert = {
    name,
    email,
    company: String(row.company || "").trim().slice(0, 200) || null,
    subject: String(row.subject || "").trim().slice(0, 300) || null,
    message,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio_contacts`, {
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
