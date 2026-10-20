const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/chat', async (req, res) => {
  try {
    const { messages, tools } = req.body;
    
    // Логируем, что пришло
    console.log('[RENDER] Received messages:', messages.length);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, tools })
    });

    const data = await groqRes.text();
    
    // Логируем, что ответил Groq
    console.log('[GROQ RESPONSE] Status:', groqRes.status, 'Data:', data.slice(0, 100));

    res.status(groqRes.status).send(data);
  } catch (e) {
    console.error('[RENDER ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
