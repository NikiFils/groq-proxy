const express = require('express');
const app = express();

app.use(express.json());

app.get('/chat', (req, res) => {
  res.send('Сервер работает. Отправь POST-запрос.');
});

app.post('/chat', (req, res) => {
  res.json({ ok: true, message: "POST работает!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT));
