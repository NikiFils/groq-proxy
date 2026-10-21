const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.post('/api', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    const { messages, tools, tool_choice } = req.body || {};

    const payload = {
      model: "openai/gpt-oss-120b",
      messages: messages || [],
    };
    if (Array.isArray(tools) && tools.length > 0) {
      payload.tools = tools;
      if (tool_choice) payload.tool_choice = tool_choice;
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await groqRes.text();
    res.status(groqRes.status).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = app;