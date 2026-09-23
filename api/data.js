// Vercel Serverless Function - ARKİM ERP Data API
// Supabase ile konuşur, CORS ayarlar

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  const base = `${SUPABASE_URL}/rest/v1/arkim_data`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    if (req.method === 'GET') {
      // Veriyi oku
      const r = await fetch(`${base}?id=eq.1&select=data,updated_at,updated_by`, { headers });
      const rows = await r.json();
      if (!rows.length) return res.json({ data: {}, updated_at: null });
      return res.json(rows[0]);
    }

    if (req.method === 'POST') {
      // Veriyi güncelle
      const body = req.body;
      const payload = {
        data: typeof body.data === 'object' ? body.data : JSON.parse(body.data || '{}'),
        updated_by: body.user || 'unknown',
        updated_at: new Date().toISOString()
      };
      const r = await fetch(`${base}?id=eq.1`, {
        method: 'PATCH',
        headers,
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
