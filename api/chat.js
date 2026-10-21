$code = @'
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, tools } = req.body || {};
    console.log('[VERCEL] Получено сообщений:', messages ? messages.length : 0);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        model: "openai/gpt-oss-120b", 
        messages, 
        tools: tools && tools.length > 0 ? tools : undefined 
      })
    });

    const data = await groqRes.text();
    console.log('[GROQ] Статус:', groqRes.status);

    res.status(groqRes.status).send(data);
  } catch (e) {
    console.error('[VERCEL ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
}
'@
Set-Content -Path api/chat.js -Value $code -Encoding UTF8