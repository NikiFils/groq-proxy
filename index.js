const express = require('express');
const fetch = require('node-fetch');
const app = express();

// Включаем парсинг JSON
app.use(express.json());

// Настройка CORS, чтобы Cloudflare мог обращаться
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Эндпоинт, который мы будем дергать
app.post('/chat', async (req, res) => {
  try {
    // Достаем сообщения из тела запроса
    const { messages, tools } = req.body || {};
    
    console.log('[RENDER] Received messages count:', messages ? messages.length : 0);

    // Отправляем в Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        model: "llama-3.3-70b-versatile", 
        messages, 
        tools: tools && tools.length > 0 ? tools : undefined 
      })
    });

    const data = await groqRes.text();
    
    // Логируем в консоль Render, чтобы видеть статус
    console.log('[GROQ] Status:', groqRes.status, 'Data start:', data.slice(0, 50));

    // Отдаем ответ обратно
    res.status(groqRes.status).send(data);

  } catch (e) {
    console.error('[RENDER ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));