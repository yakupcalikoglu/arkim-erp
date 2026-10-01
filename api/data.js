export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPA_URL = process.env.SUPABASE_URL;
  const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPA_URL || !SUPA_KEY) {
    return res.status(500).json({ error: 'Env vars missing', hasURL: !!SUPA_URL, hasKey: !!SUPA_KEY });
  }

  const base = `${SUPA_URL}/rest/v1/arkim_data`;
  const headers = {
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${SUPA_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${base}?id=eq.1&select=data,updated_at,updated_by`, { headers });
      const rows = await r.json();
      if (!rows || !rows.length) return res.json({ data: {} });
      return res.json(rows[0]);
    }

    if (req.method === 'POST') {
      let body = req.body || {};
      if (typeof body === 'string') { try { body = JSON.parse(body); } catch(e){} }
      const payload = {
        id: 1,
        data: body.data || body,
        updated_by: body.user || 'system',
        updated_at: new Date().toISOString()
      };
      // Upsert - hem insert hem update
      const r = await fetch(base, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(payload)
      });
      const result = await r.json();
      return res.json({ ok: true, result });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('API error:', e);
    res.status(500).json({ error: e.message });
  }
}
