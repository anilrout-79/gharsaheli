// GharSaheli AI — serverless proxy for the Anthropic API (Vercel)
// Deploy on Vercel. Add your key in Project Settings → Environment Variables:
//   ANTHROPIC_API_KEY = sk-ant-...
// The browser calls /api/claude; the key never leaves the server.

export default async function handler(req, res) {
  // CORS (same-origin on Vercel; permissive here for flexibility)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Safety: cap tokens and force a known model server-side
    const payload = {
      model: body.model || 'claude-sonnet-4-6',
      max_tokens: Math.min(body.max_tokens || 400, 1024),
      system: body.system,
      messages: body.messages || [],
    };
    if (body.tools) payload.tools = body.tools;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Proxy error', detail: String(e) });
  }
}
