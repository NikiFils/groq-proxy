const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Обработчик для любого POST-запроса
app.post('*', async (req, res) => {
  try {
    const { messages, tools } = req.body || {};
    console.log('[RENDER] Получено сообщений:', messages ? messages.length : 0);

    // ИСПРАВЛЕНА МОДЕЛЬ НА РАБОЧУЮ
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        model: "llama-3.3-70b-specdec", 
        messages, 
        tools: tools && tools.length > 0 ? tools : undefined 
      })
    });

    const data = await groqRes.text();
    console.log('[GROQ] Статус:', groqRes.status);

    res.status(groqRes.status).send(data);
  } catch (e) {
    console.error('[RENDER ERROR]', e.message);
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT));
